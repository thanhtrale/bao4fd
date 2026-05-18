import type { SupabaseClient } from '@supabase/supabase-js'

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

interface ArticleListResult {
  data: any[]
  meta: PaginationMeta
}

export async function getArticles(
  supabase: SupabaseClient,
  options: { page?: number; limit?: number; category?: string } = {},
): Promise<ArticleListResult> {
  const page = Math.max(1, options.page || 1)
  const limit = Math.min(100, Math.max(1, options.limit || 20))
  const offset = (page - 1) * limit

  let query = supabase
    .from('articles')
    .select('id, title, slug, excerpt, thumbnail, category_id, published_at, created_at, categories(name, slug)', { count: 'exact' })
    .eq('is_published', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (options.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.category)
      .single()

    if (!cat) {
      return { data: [], meta: { page, limit, total: 0, totalPages: 0, hasMore: false } }
    }
    query = query.eq('category_id', cat.id)
  }

  const { data, count, error } = await query

  if (error) throw error

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    data: data || [],
    meta: { page, limit, total, totalPages, hasMore: page < totalPages },
  }
}

export async function getArticleBySlug(supabase: SupabaseClient, slug: string) {
  const { data: article, error } = await supabase
    .from('articles')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !article) return null

  // Get newer and older posts in same category
  const [newerResult, olderResult] = await Promise.all([
    supabase
      .from('articles')
      .select('slug, title')
      .eq('category_id', article.category_id)
      .eq('is_published', true)
      .gt('published_at', article.published_at)
      .order('published_at', { ascending: true })
      .limit(1)
      .single(),
    supabase
      .from('articles')
      .select('slug, title')
      .eq('category_id', article.category_id)
      .eq('is_published', true)
      .lt('published_at', article.published_at)
      .order('published_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  return {
    ...article,
    newerPost: newerResult.data || null,
    olderPost: olderResult.data || null,
  }
}

export async function getMostViewedToday(supabase: SupabaseClient, limit = 5) {
  // Try to get today's most viewed
  const today = new Date().toISOString().split('T')[0]

  const { data: views } = await supabase
    .from('article_daily_views')
    .select('article_id, view_count')
    .eq('view_date', today)
    .order('view_count', { ascending: false })
    .limit(limit)

  if (views && views.length > 0) {
    const articleIds = views.map((v: any) => v.article_id)
    const { data: articles } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, thumbnail, published_at, categories(name, slug)')
      .in('id', articleIds)
      .eq('is_published', true)

    if (articles && articles.length > 0) {
      // Sort by view count order
      const viewMap = new Map(views.map((v: any) => [v.article_id, v.view_count]))
      return articles
        .map((a: any) => ({ ...a, todayViews: viewMap.get(a.id) || 0 }))
        .sort((a: any, b: any) => b.todayViews - a.todayViews)
    }
  }

  // Fallback: latest published articles
  const { data: fallback } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, thumbnail, published_at, categories(name, slug)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  return fallback || []
}

export async function getArticlesByCategory(supabase: SupabaseClient, limitPerCategory = 4) {
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('sort_order', { ascending: true })

  if (!categories || categories.length === 0) return []

  const result = await Promise.all(
    categories.map(async (cat: any) => {
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, thumbnail, published_at')
        .eq('category_id', cat.id)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(limitPerCategory)

      return { ...cat, articles: articles || [] }
    }),
  )

  // Filter out categories with no articles
  return result.filter((cat: any) => cat.articles.length > 0)
}
