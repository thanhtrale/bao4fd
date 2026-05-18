import { getArticlesByCategory } from '../services/article.service'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()
  return await getArticlesByCategory(supabase, 4)
})
