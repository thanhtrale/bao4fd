import { getArticleBySlug } from '../../services/article.service'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug parameter' })
  }

  const supabase = useSupabaseAdmin()
  const article = await getArticleBySlug(supabase, slug)

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  return article
})
