<script setup lang="ts">
const { fetchMostViewed } = useArticles()
const { fetchCategories } = useCategories()

const { data: mostViewed } = await fetchMostViewed()
const { data: categories } = await fetchCategories()

// Fetch latest articles per category for home page
const { data: categorySections } = await useFetch('/api/home-sections')
</script>

<template>
  <div>
    <h1>Mini News Portal</h1>

    <!-- Most Viewed Today -->
    <ArticleMostViewed v-if="mostViewed && mostViewed.length > 0" :articles="mostViewed" />

    <!-- Articles by Category -->
    <section v-if="categorySections" v-for="section in categorySections" :key="section.id" style="margin-top: 32px;">
      <h2>
        <NuxtLink :to="`/category/${section.slug}`">{{ section.name }}</NuxtLink>
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px;">
        <ArticleCard v-for="article in section.articles" :key="article.id" :article="article" />
      </div>
      <NuxtLink :to="`/category/${section.slug}`" style="display: inline-block; margin-top: 8px;">
        View all →
      </NuxtLink>
    </section>
  </div>
</template>
