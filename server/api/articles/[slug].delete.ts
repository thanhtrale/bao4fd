export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const id = getRouterParam(event, 'slug')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing article id' })

  const supabase = useSupabaseAdmin()

  // Check ownership
  const { data: article } = await supabase
    .from('articles')
    .select('author_id')
    .eq('id', id)
    .single()
  await requireArticleOwner(event, article?.author_id || null)

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true }
})
