<script setup lang="ts">
const { fetchMostViewed } = useArticles()

const { data: mostViewed } = await fetchMostViewed()

// Fetch latest articles for hero slider
const { data: latestResult } = await useFetch('/api/articles?limit=5')
const heroArticles = computed(() => (latestResult.value as any)?.data || [])

// Fetch latest articles per category for home page
const { data: categorySections } = await useFetch('/api/home-sections')
</script>

<template>
  <div>
    <!-- Hero Slider -->
    <HeroSlider v-if="heroArticles.length" :articles="heroArticles" class="mb-8" />

    <!-- Main content: sections + sidebar -->
    <div class="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
      <!-- Category Sections -->
      <div class="space-y-10">
        <section v-if="categorySections" v-for="section in (categorySections as any[])" :key="section.id">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold border-l-4 border-accent pl-3">
              <NuxtLink :to="`/category/${section.slug}`" class="hover:text-accent transition-colors">
                {{ section.name }}
              </NuxtLink>
            </h2>
            <NuxtLink
              :to="`/category/${section.slug}`"
              class="text-sm text-accent hover:underline"
            >
              Xem tất cả →
            </NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <ArticleCard v-for="article in section.articles" :key="article.id" :article="article" />
          </div>
        </section>
      </div>

      <!-- Sidebar: Most Viewed -->
      <aside class="hidden lg:block">
        <div class="sticky top-20">
          <ArticleMostViewed v-if="mostViewed && (mostViewed as any[]).length > 0" :articles="(mostViewed as any[])" />
        </div>
      </aside>
    </div>

    <!-- Mobile: Most Viewed below -->
    <div class="lg:hidden mt-10">
      <ArticleMostViewed v-if="mostViewed && (mostViewed as any[]).length > 0" :articles="(mostViewed as any[])" />
    </div>
  </div>
</template>
