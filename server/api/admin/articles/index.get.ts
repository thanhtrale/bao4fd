export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const offset = (page - 1) * limit
  const search = (query.search as string || '').trim()
  const dateFrom = query.dateFrom as string || ''
  const dateTo = query.dateTo as string || ''
  const authorFilter = query.author as string || ''

  const supabase = useSupabaseAdmin()

  let q = supabase
    .from('articles')
    .select('id, title, slug, is_published, published_at, created_at, author_id, categories(name, slug), profiles(display_name, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // Editors can only see their own articles
  if (user.role !== 'admin') {
    q = q.eq('author_id', user.id)
  } else if (authorFilter) {
    q = q.eq('author_id', authorFilter)
  }

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

  // Fetch authors list for admin filter dropdown
  let authors: any[] = []
  if (user.role === 'admin') {
    const { data: profilesList } = await supabase
      .from('profiles')
      .select('id, display_name, email')
      .order('display_name')
    authors = profilesList || []
  }

  return {
    data: data || [],
    meta: { page, limit, total, totalPages, hasMore: page < totalPages },
    authors,
  }
})
