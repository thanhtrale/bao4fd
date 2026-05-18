import { getMostViewedToday } from '~/server/services/article.service'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()
  return await getMostViewedToday(supabase)
})
