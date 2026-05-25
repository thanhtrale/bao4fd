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

  try {
    await transport.sendMail({
      from: config.smtpUser,
      to: config.adminEmail,
      subject,
      text,
    })
  }
  catch (err) {
    console.error('[email] Failed to send failure digest:', err)
  }
}
