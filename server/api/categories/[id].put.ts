export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing category id' })

  const body = await readBody(event)

  const updates: Record<string, any> = {}
  if (body.name !== undefined) updates.name = body.name.trim()
  if (body.slug !== undefined) updates.slug = body.slug.trim()
  if (body.description !== undefined) updates.description = body.description?.trim() || null
  if (body.sort_order !== undefined) updates.sort_order = body.sort_order

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
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
