export function useArticles() {
  function fetchArticles(params: { page?: number; limit?: number; category?: string } = {}) {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.category) query.set('category', params.category)

    return useFetch(`/api/articles?${query.toString()}`)
  }

  function fetchArticle(slug: string) {
    return useFetch(`/api/articles/${slug}`)
  }

  function fetchMostViewed() {
    return useFetch('/api/articles/most-viewed')
  }

  return { fetchArticles, fetchArticle, fetchMostViewed }
}
