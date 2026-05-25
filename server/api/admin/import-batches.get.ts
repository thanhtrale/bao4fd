import { getBatchesWithCounts } from '../../services/import.service'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = useSupabaseAdmin()
  const batches = await getBatchesWithCounts(supabase)

  return { batches }
})
