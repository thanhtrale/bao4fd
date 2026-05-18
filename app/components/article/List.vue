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

// Compute smart pagination range with ellipsis
const paginationRange = computed(() => {
  if (!props.meta) return []
  const { page, totalPages } = props.meta
  const range: (number | string)[] = []
  const delta = 2

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      range.push(i)
    } else if (range[range.length - 1] !== '...') {
      range.push('...')
    }
  }
  return range
})

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
    <!-- Horizontal article rows -->
    <div class="space-y-4">
      <article
        v-for="article in articles"
        :key="article.id"
        class="flex gap-4 p-3 rounded-lg border border-border hover:shadow-md hover:border-accent/20 transition-all group"
      >
        <!-- Thumbnail -->
        <NuxtLink :to="`/article/${article.slug}`" class="shrink-0 w-32 sm:w-44 aspect-video rounded-md overflow-hidden bg-surface">
          <AppImage
            :src="article.thumbnail"
            :alt="article.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </NuxtLink>

        <!-- Content -->
        <div class="flex-1 min-w-0 flex flex-col justify-center">
          <div class="flex items-center gap-2 mb-1">
            <NuxtLink
              v-if="article.categories"
              :to="`/category/${article.categories.slug}`"
              class="text-xs font-medium text-accent hover:underline"
            >
              {{ article.categories.name }}
            </NuxtLink>
            <span v-if="article.published_at" class="text-xs text-text-muted">
              {{ relativeTime(article.published_at) }}
            </span>
          </div>
          <NuxtLink :to="`/article/${article.slug}`">
            <h3 class="font-semibold text-base leading-snug line-clamp-2 group-hover:text-accent transition-colors">
              {{ article.title }}
            </h3>
          </NuxtLink>
          <p v-if="article.excerpt" class="mt-1 text-sm text-text-secondary line-clamp-2 hidden sm:block">
            {{ article.excerpt }}
          </p>
        </div>
      </article>
    </div>

    <!-- Desktop pagination -->
    <nav v-if="meta && meta.totalPages > 1 && !isMobile" class="mt-8 flex items-center justify-center gap-1">
      <!-- Prev -->
      <NuxtLink
        v-if="meta.page > 1"
        :to="{ query: { page: meta.page - 1 } }"
        class="px-3 py-1.5 rounded text-sm font-medium text-text-secondary hover:bg-surface transition-colors"
      >
        ← Trước
      </NuxtLink>

      <!-- Page numbers -->
      <template v-for="p in paginationRange" :key="p">
        <span v-if="p === '...'" class="px-2 text-text-muted">...</span>
        <NuxtLink
          v-else
          :to="{ query: { page: p } }"
          class="w-9 h-9 flex items-center justify-center rounded text-sm font-medium transition-colors"
          :class="p === meta.page
            ? 'bg-accent text-white'
            : 'text-text-secondary hover:bg-surface'"
        >
          {{ p }}
        </NuxtLink>
      </template>

      <!-- Next -->
      <NuxtLink
        v-if="meta.page < meta.totalPages"
        :to="{ query: { page: meta.page + 1 } }"
        class="px-3 py-1.5 rounded text-sm font-medium text-text-secondary hover:bg-surface transition-colors"
      >
        Sau →
      </NuxtLink>
    </nav>

    <!-- Mobile infinite scroll trigger -->
    <div v-if="isMobile && meta?.hasMore" ref="loadMoreRef" class="text-center py-6 text-sm text-text-muted">
      <div class="inline-flex items-center gap-2">
        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Đang tải thêm...
      </div>
    </div>

    <!-- Max pages reached -->
    <div v-if="meta && meta.page >= 50" class="text-center py-6">
      <NuxtLink :to="{ query: { page: 1 } }" class="text-sm text-accent hover:underline">
        Xem lại từ đầu
      </NuxtLink>
    </div>
  </div>
</template>
