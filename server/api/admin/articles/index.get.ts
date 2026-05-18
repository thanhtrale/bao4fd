export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const query = getQuery(event)
  const limit = Math.min(100, Number(query.limit) || 100)

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, is_published, published_at, created_at, categories(name, slug)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { data: data || [] }
})
