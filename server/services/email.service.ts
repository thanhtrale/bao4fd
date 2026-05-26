import nodemailer from 'nodemailer'
import type { SupabaseClient } from '@supabase/supabase-js'

function createTransport() {
  const config = useRuntimeConfig()

  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
    return null
  }

  return nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort) || 587,
    secure: Number(config.smtpPort) === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })
}

export async function sendFailureDigest(supabase: SupabaseClient, batchId: string) {
  const config = useRuntimeConfig()
  const transport = createTransport()

  if (!transport) {
    console.warn('[email] SMTP not configured — skipping failure digest email')
    return
  }

  if (!config.adminEmail) {
    console.warn('[email] ADMIN_EMAIL not configured — skipping failure digest email')
    return
  }

  // Get batch info
  const { data: batch } = await supabase
    .from('import_batches')
    .select('id, total_urls, created_at, categories(name)')
    .eq('id', batchId)
    .single()

  if (!batch) return

  // Get failed jobs
  const { data: failedJobs } = await supabase
    .from('import_jobs')
    .select('url, error_message, updated_at')
    .eq('batch_id', batchId)
    .eq('status', 'failed')
    .order('updated_at', { ascending: true })

  if (!failedJobs || failedJobs.length === 0) return

  const categoryName = (batch as any).categories?.name || 'Unknown'
  const failedList = failedJobs
    .map((job, i) => `  ${i + 1}. ${job.url}\n     Error: ${job.error_message}\n     Time: ${job.updated_at}`)
    .join('\n\n')

  const subject = `[News Portal] Import batch failed: ${failedJobs.length}/${batch.total_urls} URLs failed`

  const text = `Import Batch Failure Report
============================

Batch ID: ${batchId}
Category: ${categoryName}
Total URLs: ${batch.total_urls}
Failed: ${failedJobs.length}
Created: ${batch.created_at}

Failed URLs:
${failedList}

---
This is an automated alert from Mini News Portal.`

  console.log(`[email] Sending failure digest: ${failedJobs.length} failed jobs, to: ${config.adminEmail}`)

  try {
    const info = await transport.sendMail({
      from: config.smtpFrom || config.adminEmail,
      to: config.adminEmail,
      subject,
      text,
    })
    console.log('[email] Sent successfully:', info.messageId)
  }
  catch (err) {
    console.error('[email] Failed to send failure digest:', err)
  }
}

export async function sendImportReport(supabase: SupabaseClient, batchId: string, siteUrl: string) {
  const config = useRuntimeConfig()
  const transport = createTransport()

  if (!transport) {
    console.warn('[email] SMTP not configured — skipping import report email')
    return
  }

  if (!config.adminEmail) {
    console.warn('[email] ADMIN_EMAIL not configured — skipping import report email')
    return
  }

  // Get batch info
  const { data: batch } = await supabase
    .from('import_batches')
    .select('id, total_urls, status, created_at, categories(name)')
    .eq('id', batchId)
    .single()

  if (!batch) return

  // Get all jobs with article slugs
  const { data: jobs } = await supabase
    .from('import_jobs')
    .select('url, status, error_message, article_id')
    .eq('batch_id', batchId)
    .order('created_at', { ascending: true })

  if (!jobs || jobs.length === 0) return

  const articleIds = jobs.filter(j => j.article_id).map(j => j.article_id)
  let slugMap: Record<string, string> = {}
  if (articleIds.length > 0) {
    const { data: articles } = await supabase
      .from('articles')
      .select('id, slug')
      .in('id', articleIds)
    for (const a of (articles || [])) {
      slugMap[a.id] = a.slug
    }
  }

  const categoryName = (batch as any).categories?.name || 'Unknown'
  const published = jobs.filter(j => j.status === 'published')
  const failed = jobs.filter(j => j.status === 'failed')

  const publishedList = published.length > 0
    ? published.map((j, i) => {
        const slug = j.article_id ? slugMap[j.article_id] : null
        const articleUrl = slug ? `${siteUrl}/article/${slug}` : 'N/A'
        return `  ${i + 1}. ✓ ${j.url}\n     → ${articleUrl}`
      }).join('\n\n')
    : '  (none)'

  const failedList = failed.length > 0
    ? failed.map((j, i) => `  ${i + 1}. ✗ ${j.url}\n     Error: ${j.error_message}`).join('\n\n')
    : '  (none)'

  const statusLabel = batch.status === 'completed' ? 'Hoàn tất' : 'Có lỗi'
  const subject = `[News Portal] Import ${statusLabel}: ${published.length}/${batch.total_urls} thành công`

  const text = `Import Report
============================

Batch ID: ${batchId}
Category: ${categoryName}
Total URLs: ${batch.total_urls}
Thành công: ${published.length}
Thất bại: ${failed.length}
Created: ${batch.created_at}

--- Thành công ---
${publishedList}

--- Thất bại ---
${failedList}

---
This is an automated report from Mini News Portal.`

  console.log(`[email] Sending import report: ${published.length} ok, ${failed.length} failed, to: ${config.adminEmail}`)

  try {
    const info = await transport.sendMail({
      from: config.smtpFrom || config.adminEmail,
      to: config.adminEmail,
      subject,
      text,
    })
    console.log('[email] Import report sent:', info.messageId)
  }
  catch (err) {
    console.error('[email] Failed to send import report:', err)
  }
}
