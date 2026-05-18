import { getMostViewedToday } from '../../services/article.service'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()
  return await getMostViewedToday(supabase)
})
