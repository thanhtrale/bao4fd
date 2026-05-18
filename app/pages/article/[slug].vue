<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { fetchArticle } = useArticles()
const { data: article, error } = await fetchArticle(slug)

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

useHead({
  title: `${article.value.title} - Mini News Portal`,
})
</script>

<template>
  <div v-if="article" style="max-width: 800px; margin: 0 auto;">
    <article>
      <h1>{{ article.title }}</h1>

      <div style="color: #666; margin-bottom: 16px;">
        <NuxtLink v-if="article.categories" :to="`/category/${article.categories.slug}`">
          {{ article.categories.name }}
        </NuxtLink>
        <span v-if="article.published_at"> · {{ new Date(article.published_at).toLocaleDateString() }}</span>
      </div>

      <img
        v-if="article.thumbnail"
        :src="article.thumbnail"
        :alt="article.title"
        style="width: 100%; max-height: 400px; object-fit: cover; margin-bottom: 20px;"
      >

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="article.content" />
    </article>

    <!-- Newer / Older navigation -->
    <nav style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
      <div>
        <template v-if="article.olderPost">
          <small>← Older Post</small><br>
          <NuxtLink :to="`/article/${article.olderPost.slug}`">
            {{ article.olderPost.title }}
          </NuxtLink>
        </template>
      </div>
      <div style="text-align: right;">
        <template v-if="article.newerPost">
          <small>Newer Post →</small><br>
          <NuxtLink :to="`/article/${article.newerPost.slug}`">
            {{ article.newerPost.title }}
          </NuxtLink>
        </template>
      </div>
    </nav>
  </div>
</template>
