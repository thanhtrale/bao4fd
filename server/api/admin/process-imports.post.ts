import { getScraperForUrl } from '~/server/services/scraper'
import {
  getJobsToProcess,
  markJobPublished,
  markJobFailed,
  markJobRetry,
  getRemainingJobCount,
  incrementInvocationCount,
  finalizeBatch,
} from '~/server/services/import.service'
import { sendFailureDigest } from '~/server/services/email.service'

export default defineEventHandler(async (event) => {
  // Auth: admin token OR internal API key
  const config = useRuntimeConfig()
  const internalKey = getRequestHeader(event, 'x-internal-key')

  if (internalKey && internalKey === config.internalApiKey) {
    // Internal chain call — authorized
  }
  else {
    await requireAdmin(event)
  }

  const body = await readBody(event)
  const { batchId } = body as { batchId?: string }

  if (!batchId) {
    throw createError({ statusCode: 400, statusMessage: 'batchId is required' })
  }

  const supabase = useSupabaseAdmin()

  // Safety check: increment invocation count
  const { shouldContinue } = await incrementInvocationCount(supabase, batchId)
  if (!shouldContinue) {
    return { status: 'stopped', reason: 'safety_limit' }
  }

  // Get batch info for category
  const { data: batch } = await supabase
    .from('import_batches')
    .select('category_id')
    .eq('id', batchId)
    .single()

  if (!batch) {
    throw createError({ statusCode: 404, statusMessage: 'Batch not found' })
  }

  // Get jobs to process
  const jobs = await getJobsToProcess(supabase, batchId, 5)

  if (jobs.length === 0) {
    // No more jobs — finalize
    const batchStatus = await finalizeBatch(supabase, batchId)
    return { status: 'complete', batchStatus }
  }

  // Process each job
  for (const job of jobs) {
    try {
      const scraper = getScraperForUrl(job.url)
      const scraped = await scraper.scrape(job.url)

      // Check for title duplicate
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', scraped.slug)
        .maybeSingle()

      if (existing) {
        // Slug conflict — append timestamp
        scraped.slug = `${scraped.slug}-${Date.now()}`
      }

      // Insert article
      const { data: article, error: insertError } = await supabase
        .from('articles')
        .insert({
          title: scraped.title,
          slug: scraped.slug,
          excerpt: scraped.description,
          content: scraped.content,
          thumbnail: scraped.thumbnail,
          category_id: batch.category_id,
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (insertError || !article) {
        throw new Error(insertError?.message || 'Failed to insert article')
      }

      await markJobPublished(supabase, job.id, article.id)
    }
    catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)

      if (job.retry_count < 3) {
        await markJobRetry(supabase, job.id, job.retry_count, errorMessage)
      }
      else {
        await markJobFailed(supabase, job.id, errorMessage)
      }
    }
  }

  // Check if more jobs to process
  const remaining = await getRemainingJobCount(supabase, batchId)

  if (remaining > 0) {
    // Self-chain: trigger next batch
    const baseUrl = getRequestURL(event).origin

    event.waitUntil(
      fetch(`${baseUrl}/api/admin/process-imports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-key': config.internalApiKey,
        },
        body: JSON.stringify({ batchId }),
      }).catch(() => {}),
    )
  }
  else {
    // All done — finalize batch
    const batchStatus = await finalizeBatch(supabase, batchId)
    if (batchStatus === 'partial_failure') {
      await sendFailureDigest(supabase, batchId)
    }
  }

  setResponseStatus(event, 202)
  return { processed: jobs.length, remaining }
})
