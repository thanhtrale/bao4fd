export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const body = await readBody(event)

  if (!body.name?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  }
  if (!body.slug?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: body.name.trim(),
      slug: body.slug.trim(),
      description: body.description?.trim() || null,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Category slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
