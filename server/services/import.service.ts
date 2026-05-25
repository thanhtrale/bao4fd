import type { SupabaseClient } from '@supabase/supabase-js'

export interface CreateBatchInput {
  categoryId: string
  urls: string[]
  createdBy: string
}

export async function createBatch(supabase: SupabaseClient, input: CreateBatchInput) {
  const { data: batch, error: batchError } = await supabase
    .from('import_batches')
    .insert({
      category_id: input.categoryId,
      total_urls: input.urls.length,
      status: 'pending',
      created_by: input.createdBy,
    })
    .select('id')
    .single()

  if (batchError || !batch) throw batchError || new Error('Failed to create batch')

  const jobs = input.urls.map(url => ({
    batch_id: batch.id,
    url,
    status: 'pending' as const,
  }))

  const { error: jobsError } = await supabase
    .from('import_jobs')
    .insert(jobs)

  if (jobsError) throw jobsError

  return batch.id as string
}

export async function checkDuplicateUrls(supabase: SupabaseClient, urls: string[]) {
  // Check in import_jobs
  const { data: existingJobs } = await supabase
    .from('import_jobs')
    .select('url')
    .in('url', urls)

  const jobUrls = new Set((existingJobs || []).map(j => j.url))

  // Check existing articles by matching scraped source URL pattern in content or by slug
  // For now, just check import_jobs duplicates — title dedup happens after scraping
  return urls.filter(url => jobUrls.has(url))
}

export async function getJobsToProcess(supabase: SupabaseClient, batchId: string, limit = 5) {
  // Select pending jobs ready for processing
  // Note: Supabase JS client doesn't support FOR UPDATE SKIP LOCKED,
  // so we select then update status to 'processing' as a claim
  const { data: jobs, error } = await supabase
    .from('import_jobs')
    .select('id, url, retry_count')
    .eq('batch_id', batchId)
    .eq('status', 'pending')
    .or('retry_after.is.null,retry_after.lte.' + new Date().toISOString())
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw error
  if (!jobs || jobs.length === 0) return []

  // Claim jobs by setting status to processing
  const jobIds = jobs.map(j => j.id)
  const { error: updateError } = await supabase
    .from('import_jobs')
    .update({ status: 'processing' })
    .in('id', jobIds)

  if (updateError) throw updateError

  return jobs
}

export async function markJobPublished(supabase: SupabaseClient, jobId: string, articleId: string) {
  const { error } = await supabase
    .from('import_jobs')
    .update({ status: 'published', article_id: articleId })
    .eq('id', jobId)

  if (error) throw error
}

export async function markJobFailed(supabase: SupabaseClient, jobId: string, errorMessage: string) {
  const { error } = await supabase
    .from('import_jobs')
    .update({ status: 'failed', error_message: errorMessage })
    .eq('id', jobId)

  if (error) throw error
}

export async function markJobRetry(supabase: SupabaseClient, jobId: string, retryCount: number, errorMessage: string) {
  const delayMs = 10000 * Math.pow(2, retryCount) // 10s, 20s, 40s
  const retryAfter = new Date(Date.now() + delayMs).toISOString()

  const { error } = await supabase
    .from('import_jobs')
    .update({
      status: 'pending',
      retry_count: retryCount + 1,
      retry_after: retryAfter,
      error_message: errorMessage,
    })
    .eq('id', jobId)

  if (error) throw error
}

export async function getRemainingJobCount(supabase: SupabaseClient, batchId: string) {
  const { count, error } = await supabase
    .from('import_jobs')
    .select('id', { count: 'exact', head: true })
    .eq('batch_id', batchId)
    .eq('status', 'pending')
    .or('retry_after.is.null,retry_after.lte.' + new Date().toISOString())

  if (error) throw error
  return count || 0
}

export async function finalizeBatch(supabase: SupabaseClient, batchId: string) {
  // Count jobs by status
  const { data: jobs, error } = await supabase
    .from('import_jobs')
    .select('status')
    .eq('batch_id', batchId)

  if (error) throw error

  const statuses = (jobs || []).map(j => j.status)
  const allTerminal = statuses.every(s => s === 'published' || s === 'failed')

  if (!allTerminal) return null

  const hasFailed = statuses.some(s => s === 'failed')
  const batchStatus = hasFailed ? 'partial_failure' : 'completed'

  const { error: updateError } = await supabase
    .from('import_batches')
    .update({ status: batchStatus, completed_at: new Date().toISOString() })
    .eq('id', batchId)

  if (updateError) throw updateError

  return batchStatus
}

export async function incrementInvocationCount(supabase: SupabaseClient, batchId: string) {
  // Get current count and increment
  const { data: batch, error: fetchError } = await supabase
    .from('import_batches')
    .select('invocation_count, total_urls, created_at, status')
    .eq('id', batchId)
    .single()

  if (fetchError || !batch) throw fetchError || new Error('Batch not found')

  const newCount = (batch.invocation_count || 0) + 1
  const maxInvocations = Math.ceil(batch.total_urls / 5) * 2

  // Safety checks
  const isStale = (Date.now() - new Date(batch.created_at).getTime()) > 30 * 60 * 1000
  const isOverLimit = newCount > maxInvocations

  if (isStale || isOverLimit) {
    await supabase
      .from('import_batches')
      .update({ status: 'partial_failure', completed_at: new Date().toISOString() })
      .eq('id', batchId)
    return { shouldContinue: false }
  }

  await supabase
    .from('import_batches')
    .update({ invocation_count: newCount, status: 'processing' })
    .eq('id', batchId)

  return { shouldContinue: true }
}

export async function getBatchesWithCounts(supabase: SupabaseClient) {
  const { data: batches, error } = await supabase
    .from('import_batches')
    .select('id, category_id, total_urls, status, invocation_count, created_at, completed_at, categories(name)')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error

  // Get job counts per batch
  const batchIds = (batches || []).map(b => b.id)
  if (batchIds.length === 0) return []

  const { data: jobs, error: jobsError } = await supabase
    .from('import_jobs')
    .select('batch_id, status')
    .in('batch_id', batchIds)

  if (jobsError) throw jobsError

  // Group counts
  const countMap: Record<string, Record<string, number>> = {}
  for (const job of (jobs || [])) {
    if (!countMap[job.batch_id]) {
      countMap[job.batch_id] = { pending: 0, processing: 0, published: 0, failed: 0 }
    }
    countMap[job.batch_id][job.status] = (countMap[job.batch_id][job.status] || 0) + 1
  }

  return (batches || []).map(b => ({
    ...b,
    counts: countMap[b.id] || { pending: 0, processing: 0, published: 0, failed: 0 },
  }))
}
