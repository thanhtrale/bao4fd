export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const batchId = query.batchId as string

  if (!batchId) {
    throw createError({ statusCode: 400, statusMessage: 'batchId is required' })
  }

  const supabase = useSupabaseAdmin()

  const { data: jobs, error } = await supabase
    .from('import_jobs')
    .select('id, url, status, error_message, article_id, updated_at')
    .eq('batch_id', batchId)
    .order('created_at', { ascending: true })

  if (error) throw error
  if (!jobs || jobs.length === 0) return { jobs: [] }

  // Get article slugs for published jobs
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

  return {
    jobs: jobs.map(j => ({
      id: j.id,
      url: j.url,
      status: j.status,
      error_message: j.error_message,
      article_slug: j.article_id ? slugMap[j.article_id] || null : null,
      updated_at: j.updated_at,
    })),
  }
})
