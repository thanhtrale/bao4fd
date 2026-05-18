<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: article, error, status } = await useFetch(
  () => `/api/articles/${slug.value}`,
  { watch: [slug] },
)

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

useHead({
  title: computed(() => `${article.value?.title || 'Article'} - Mini News Portal`),
})

// Estimated reading time
const readingTime = computed(() => {
  if (!article.value?.content) return 0
  const words = article.value.content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
})

// Fire-and-forget view tracking
watch(slug, (newSlug) => {
  $fetch(`/api/articles/${newSlug}/view`, { method: 'POST' }).catch(() => {})
}, { immediate: true })
</script>

<template>
  <!-- Skeleton while loading -->
  <SkeletonArticleDetail v-if="status === 'pending'" />

  <div v-else-if="article" class="max-w-3xl mx-auto">
    <article>
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-text-muted mb-4">
        <NuxtLink to="/" class="hover:text-accent transition-colors">Trang chủ</NuxtLink>
        <span>/</span>
        <NuxtLink
          v-if="article.categories"
          :to="`/category/${article.categories.slug}`"
          class="hover:text-accent transition-colors"
        >
          {{ article.categories.name }}
        </NuxtLink>
      </nav>

      <!-- Title -->
      <h1 class="text-3xl lg:text-4xl font-bold leading-tight mb-4">
        {{ article.title }}
      </h1>

      <!-- Meta -->
      <div class="flex items-center gap-3 text-sm text-text-muted mb-6">
        <span v-if="article.published_at">{{ relativeTime(article.published_at) }}</span>
        <span class="w-1 h-1 rounded-full bg-text-muted"></span>
        <span>{{ readingTime }} phút đọc</span>
      </div>

      <!-- Hero image -->
      <div v-if="article.thumbnail" class="rounded-xl overflow-hidden mb-8">
        <AppImage
          :src="article.thumbnail"
          :alt="article.title"
          class="w-full max-h-120 object-cover"
        />
      </div>

      <!-- Content -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="prose prose-lg max-w-none" v-html="article.content" />
    </article>

    <!-- Newer / Older navigation -->
    <nav class="flex justify-between mt-12 pt-6 border-t border-border gap-4">
      <div class="flex-1 min-w-0" v-if="article.olderPost">
        <span class="text-xs text-text-muted">← Bài cũ hơn</span>
        <NuxtLink
          :to="`/article/${article.olderPost.slug}`"
          class="block mt-1 text-sm font-medium line-clamp-2 hover:text-accent transition-colors"
        >
          {{ article.olderPost.title }}
        </NuxtLink>
      </div>
      <div v-else class="flex-1"></div>
      <div class="flex-1 min-w-0 text-right" v-if="article.newerPost">
        <span class="text-xs text-text-muted">Bài mới hơn →</span>
        <NuxtLink
          :to="`/article/${article.newerPost.slug}`"
          class="block mt-1 text-sm font-medium line-clamp-2 hover:text-accent transition-colors"
        >
          {{ article.newerPost.title }}
        </NuxtLink>
      </div>
      <div v-else class="flex-1"></div>
    </nav>
  </div>
</template>
