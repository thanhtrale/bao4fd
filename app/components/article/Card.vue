<script setup lang="ts">
defineProps<{
  article: {
    title: string
    slug: string
    excerpt?: string
    thumbnail?: string
    published_at?: string
    categories?: { name: string; slug: string }
  }
}>()
</script>

<template>
  <article class="group rounded-lg overflow-hidden border border-border bg-white hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
    <NuxtLink :to="`/article/${article.slug}`" class="block">
      <div class="aspect-video bg-surface overflow-hidden">
        <AppImage
          :src="article.thumbnail"
          :alt="article.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    </NuxtLink>

    <div class="p-3">
      <div class="flex items-center gap-2 mb-2">
        <NuxtLink
          v-if="article.categories"
          :to="`/category/${article.categories.slug}`"
          class="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
        >
          {{ article.categories.name }}
        </NuxtLink>
        <span v-if="article.published_at" class="text-xs text-text-muted">
          {{ relativeTime(article.published_at) }}
        </span>
      </div>

      <NuxtLink :to="`/article/${article.slug}`">
        <h3 class="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {{ article.title }}
        </h3>
      </NuxtLink>

      <p v-if="article.excerpt" class="mt-1.5 text-xs text-text-secondary line-clamp-2">
        {{ article.excerpt }}
      </p>
    </div>
  </article>
</template>
