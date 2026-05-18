import { incrementView } from '~/server/services/view.service'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug parameter' })
  }

  const supabase = useSupabaseAdmin()

  // Look up article by slug to get ID
  const { data: article } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  await incrementView(supabase, article.id)

  return { success: true }
})
