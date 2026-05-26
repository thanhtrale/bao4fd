export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  const body = await readBody(event)

  const { articles, categoryId, notifyEmail } = body as {
    articles?: Array<{ url: string; categoryId: string }>
    categoryId?: string
    notifyEmail?: boolean
  }

  // Support both old format (urls + categoryId) and new format (articles with per-item categoryId)
  const { urls } = body as { urls?: string[] }

  let articleList: Array<{ url: string; categoryId: string }> = []

  if (articles && Array.isArray(articles) && articles.length > 0) {
    articleList = articles
  }
  else if (urls && Array.isArray(urls) && urls.length > 0 && categoryId) {
    articleList = urls.map(url => ({ url, categoryId }))
  }
  else {
    throw createError({ statusCode: 400, statusMessage: 'articles or urls+categoryId is required' })
  }

  if (articleList.length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Maximum 100 articles per submission' })
  }

  // Validate URLs
  const supportedDomains = new Set(['vnexpress.net', 'tuoitre.vn'])

  for (const item of articleList) {
    try {
      const parsed = new URL(item.url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw createError({ statusCode: 400, statusMessage: `Invalid URL: ${item.url}` })
      }
      const hostname = parsed.hostname.replace(/^www\./, '')
      if (!supportedDomains.has(hostname)) {
        throw createError({ statusCode: 400, statusMessage: `Unsupported domain: ${hostname}` })
      }
    }
    catch (err: any) {
      if (err.statusCode) throw err
      throw createError({ statusCode: 400, statusMessage: `Invalid URL: ${item.url}` })
    }
  }

  const supabase = useSupabaseAdmin()

  // Verify all category IDs exist
  const categoryIds = [...new Set(articleList.map(a => a.categoryId))]
  const { data: cats } = await supabase.from('categories').select('id').in('id', categoryIds)
  const validCatIds = new Set((cats || []).map(c => c.id))
  const invalidCats = categoryIds.filter(id => !validCatIds.has(id))
  if (invalidCats.length > 0) {
    throw createError({ statusCode: 400, statusMessage: `Category not found: ${invalidCats.join(', ')}` })
  }

  // Dedup check
  const { checkDuplicateUrls, createBatchWithArticles } = await import('../../services/import.service')
  const allUrls = articleList.map(a => a.url)
  const duplicates = await checkDuplicateUrls(supabase, allUrls)
  const duplicateSet = new Set(duplicates)
  const uniqueArticles = articleList.filter(a => !duplicateSet.has(a.url))

  if (uniqueArticles.length === 0) {
    return { batchId: null, skipped: duplicates, message: 'All URLs are duplicates' }
  }

  // Use the first article's category as the batch-level category
  const batchCategoryId = uniqueArticles[0].categoryId

  const batchId = await createBatchWithArticles(supabase, {
    categoryId: batchCategoryId,
    articles: uniqueArticles,
    createdBy: user.id,
    notifyEmail: !!notifyEmail,
  })

  // Trigger background processing via self-chain
  const config = useRuntimeConfig()
  const baseUrl = getRequestURL(event).origin

  const chainPromise = fetch(`${baseUrl}/api/admin/process-imports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': config.internalApiKey,
    },
    body: JSON.stringify({ batchId }),
  }).catch((err) => {
    console.error('[bulk-import] Chain trigger failed:', err)
  })

  if (typeof event.waitUntil === 'function') {
    event.waitUntil(chainPromise)
  }

  setResponseStatus(event, 202)
  return {
    batchId,
    queued: uniqueArticles.length,
    skipped: duplicates,
  }
})
