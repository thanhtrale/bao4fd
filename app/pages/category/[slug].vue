<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Reactive page from query
const page = computed(() => Number(route.query.page) || 1)

const { data: result, error, status } = await useFetch(() => `/api/articles?page=${page.value}&category=${slug}`, {
  watch: [page],
})

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}

// For mobile infinite scroll
const allArticles = computed(() => (result.value as any)?.data || [])
const meta = computed(() => (result.value as any)?.meta)
const loadingMore = ref(false)

async function loadMore() {
  if (loadingMore.value || !meta.value?.hasMore || meta.value.page >= 50) return
  loadingMore.value = true

  try {
    const nextPage = (meta.value?.page || 1) + 1
    const response = await $fetch(`/api/articles?page=${nextPage}&category=${slug}`)
    const typed = response as any
    // Append to existing data for infinite scroll
    if (result.value) {
      ;(result.value as any).data = [...(result.value as any).data, ...typed.data]
      ;(result.value as any).meta = typed.meta
    }
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
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold capitalize">
        {{ slug.replace(/-/g, ' ') }}
      </h1>
      <span v-if="meta" class="text-sm text-text-muted">
        {{ meta.total }} bài viết
      </span>
    </div>

    <!-- Skeleton while loading -->
    <SkeletonCategoryList v-if="status === 'pending' && !allArticles.length" />

    <ArticleList
      v-else
      :articles="allArticles"
      :meta="meta"
      :category="slug"
      @load-more="loadMore"
    />
  </div>
</template>
