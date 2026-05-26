export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const name = body.name?.trim()

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'name is required' })
  }

  const supabase = useSupabaseAdmin()

  // Try to find existing category by name (case-insensitive)
  const { data: existing } = await supabase
    .from('categories')
    .select('id, name, slug')
    .ilike('name', name)
    .limit(1)
    .maybeSingle()

  if (existing) {
    return { id: existing.id, name: existing.name, slug: existing.slug, created: false }
  }

  // Create new category with auto-generated slug
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const { data: created, error } = await supabase
    .from('categories')
    .insert({ name, slug })
    .select('id, name, slug')
    .single()

  if (error) {
    // Slug conflict — append timestamp
    if (error.code === '23505') {
      const { data: retry, error: retryError } = await supabase
        .from('categories')
        .insert({ name, slug: `${slug}-${Date.now()}` })
        .select('id, name, slug')
        .single()

      if (retryError) throw createError({ statusCode: 500, statusMessage: retryError.message })
      return { id: retry.id, name: retry.name, slug: retry.slug, created: true }
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { id: created.id, name: created.name, slug: created.slug, created: true }
})
