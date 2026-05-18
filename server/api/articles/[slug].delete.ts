export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'slug')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing article id' })

  const supabase = useSupabaseAdmin()
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true }
})
