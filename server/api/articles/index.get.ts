import { getArticles } from '~/server/services/article.service'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const category = query.category as string | undefined

  const supabase = useSupabaseAdmin()
  return await getArticles(supabase, { page, limit, category })
})
