export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const body = await readBody(event)

  if (!body.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }
  if (!body.slug?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }
  if (!body.content?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Content is required' })
  }
  if (!body.category_id) {
    throw createError({ statusCode: 400, statusMessage: 'Category is required' })
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('articles')
    .insert({
      title: body.title.trim(),
      slug: body.slug.trim(),
      excerpt: body.excerpt?.trim() || null,
      content: body.content.trim(),
      thumbnail: body.thumbnail || null,
      category_id: body.category_id,
      is_published: body.is_published ?? false,
      published_at: body.is_published ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Article slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
