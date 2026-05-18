<script setup lang="ts">
const props = defineProps<{
  articles: any[]
  meta?: { page: number; totalPages: number; hasMore: boolean }
  category?: string
}>()

const emit = defineEmits<{
  loadMore: []
}>()

const isMobile = ref(false)
const loadMoreRef = ref<HTMLElement>()

onMounted(() => {
  isMobile.value = window.innerWidth < 768

  if (isMobile.value && loadMoreRef.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && props.meta?.hasMore) {
          emit('loadMore')
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(loadMoreRef.value)
    onUnmounted(() => observer.disconnect())
  }
})
</script>

<template>
  <div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
    </div>

    <!-- Desktop pagination -->
    <nav v-if="meta && meta.totalPages > 1 && !isMobile" style="margin-top: 20px; display: flex; gap: 8px; justify-content: center;">
      <NuxtLink
        v-for="p in meta.totalPages"
        :key="p"
        :to="{ query: { page: p, ...(category ? { category } : {}) } }"
        :style="{ fontWeight: p === meta.page ? 'bold' : 'normal', padding: '4px 12px', border: '1px solid #ccc', textDecoration: 'none' }"
      >
        {{ p }}
      </NuxtLink>
    </nav>

    <!-- Mobile infinite scroll trigger -->
    <div v-if="isMobile && meta?.hasMore" ref="loadMoreRef" style="text-align: center; padding: 20px;">
      Loading more...
    </div>

    <!-- Max pages reached -->
    <div v-if="meta && meta.page >= 50" style="text-align: center; padding: 20px;">
      <NuxtLink :to="{ query: { page: 1 } }">
        View all articles from the beginning
      </NuxtLink>
    </div>
  </div>
</template>
