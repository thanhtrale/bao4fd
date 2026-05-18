export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing article id' })

  const body = await readBody(event)

  const updates: Record<string, any> = {}
  if (body.title !== undefined) updates.title = body.title.trim()
  if (body.slug !== undefined) updates.slug = body.slug.trim()
  if (body.excerpt !== undefined) updates.excerpt = body.excerpt?.trim() || null
  if (body.content !== undefined) updates.content = body.content.trim()
  if (body.thumbnail !== undefined) updates.thumbnail = body.thumbnail || null
  if (body.category_id !== undefined) updates.category_id = body.category_id

  if (body.is_published !== undefined) {
    updates.is_published = body.is_published
    // Set published_at when first published
    if (body.is_published) {
      const supabase = useSupabaseAdmin()
      const { data: existing } = await supabase
        .from('articles')
        .select('published_at')
        .eq('id', id)
        .single()
      if (existing && !existing.published_at) {
        updates.published_at = new Date().toISOString()
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
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
