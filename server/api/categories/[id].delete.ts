export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing category id' })

  const supabase = useSupabaseAdmin()
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    if (error.code === '23503') {
      throw createError({ statusCode: 409, statusMessage: 'Cannot delete category with existing articles' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true }
})
