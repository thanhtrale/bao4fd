export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  const body = await readBody(event)

  const { urls, categoryId } = body as { urls?: string[]; categoryId?: string }

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'urls is required and must be a non-empty array' })
  }

  if (urls.length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Maximum 100 URLs per submission' })
  }

  if (!categoryId) {
    throw createError({ statusCode: 400, statusMessage: 'categoryId is required' })
  }

  // Validate URL format and domain
  const invalidUrls: string[] = []
  const unsupportedUrls: string[] = []

  for (const url of urls) {
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        invalidUrls.push(url)
        continue
      }
      const hostname = parsed.hostname.replace(/^www\./, '')
      if (hostname !== 'vnexpress.net') {
        unsupportedUrls.push(url)
      }
    }
    catch {
      invalidUrls.push(url)
    }
  }

  if (invalidUrls.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid URLs: ${invalidUrls.join(', ')}`,
    })
  }

  if (unsupportedUrls.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Unsupported domains: ${unsupportedUrls.join(', ')}`,
    })
  }

  const supabase = useSupabaseAdmin()

  // Verify category exists
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('id', categoryId)
    .single()

  if (!category) {
    throw createError({ statusCode: 400, statusMessage: 'Category not found' })
  }

  // Dedup check
  const { checkDuplicateUrls, createBatch } = await import('~/server/services/import.service')
  const duplicates = await checkDuplicateUrls(supabase, urls)
  const uniqueUrls = urls.filter(url => !duplicates.includes(url))

  if (uniqueUrls.length === 0) {
    return { batchId: null, skipped: duplicates, message: 'All URLs are duplicates' }
  }

  // Create batch and jobs
  const batchId = await createBatch(supabase, {
    categoryId,
    urls: uniqueUrls,
    createdBy: user.id,
  })

  // Trigger background processing via self-chain
  const config = useRuntimeConfig()
  const baseUrl = getRequestURL(event).origin

  event.waitUntil(
    fetch(`${baseUrl}/api/admin/process-imports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-key': config.internalApiKey,
      },
      body: JSON.stringify({ batchId }),
    }).catch(() => {
      // Chain trigger failed — jobs remain pending, can be retried from dashboard
    }),
  )

  setResponseStatus(event, 202)
  return {
    batchId,
    queued: uniqueUrls.length,
    skipped: duplicates,
  }
})
