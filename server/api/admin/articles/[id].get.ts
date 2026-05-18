export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing article id' })

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  return data
})
