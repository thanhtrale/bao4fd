<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Reactive page from query
const page = computed(() => Number(route.query.page) || 1)

const { fetchArticles } = useArticles()
const { data: result, error } = await fetchArticles({ page: page.value, category: slug })

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}

// For mobile infinite scroll
const allArticles = ref(result.value?.data || [])
const meta = ref(result.value?.meta)
const loadingMore = ref(false)

async function loadMore() {
  if (loadingMore.value || !meta.value?.hasMore || meta.value.page >= 50) return
  loadingMore.value = true

  try {
    const nextPage = (meta.value?.page || 1) + 1
    const response = await $fetch(`/api/articles?page=${nextPage}&category=${slug}`)
    const typed = response as any
    allArticles.value = [...allArticles.value, ...typed.data]
    meta.value = typed.meta
  } finally {
    loadingMore.value = false
  }
}

useHead({
  title: `${slug} - Mini News Portal`,
})
</script>

<template>
  <div>
    <h1 style="text-transform: capitalize;">
      {{ slug }}
    </h1>

    <ArticleList
      :articles="allArticles"
      :meta="meta"
      :category="slug"
      @load-more="loadMore"
    />
  </div>
</template>
