import { getCategories } from '../../services/category.service'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()
  return await getCategories(supabase)
})
