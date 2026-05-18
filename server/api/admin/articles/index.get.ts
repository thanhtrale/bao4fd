export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const offset = (page - 1) * limit
  const search = (query.search as string || '').trim()
  const dateFrom = query.dateFrom as string || ''
  const dateTo = query.dateTo as string || ''

  const supabase = useSupabaseAdmin()

  let q = supabase
    .from('articles')
    .select('id, title, slug, is_published, published_at, created_at, categories(name, slug)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    q = q.ilike('title', `%${search}%`)
  }
  if (dateFrom) {
    q = q.gte('published_at', `${dateFrom}T00:00:00+07:00`)
  }
  if (dateTo) {
    q = q.lte('published_at', `${dateTo}T23:59:59+07:00`)
  }

  const { data, count, error } = await q

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    data: data || [],
    meta: { page, limit, total, totalPages, hasMore: page < totalPages },
  }
})
