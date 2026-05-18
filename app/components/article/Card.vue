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
  <div class="article-card">
    <NuxtLink :to="`/article/${article.slug}`">
      <img
        v-if="article.thumbnail"
        :src="article.thumbnail"
        :alt="article.title"
        style="width: 100%; max-height: 200px; object-fit: cover;"
      >
      <h3>{{ article.title }}</h3>
    </NuxtLink>
    <p v-if="article.excerpt" style="color: #666;">
      {{ article.excerpt }}
    </p>
    <div style="font-size: 0.85em; color: #999;">
      <NuxtLink v-if="article.categories" :to="`/category/${article.categories.slug}`">
        {{ article.categories.name }}
      </NuxtLink>
      <span v-if="article.published_at"> · {{ new Date(article.published_at).toLocaleDateString() }}</span>
    </div>
  </div>
</template>
