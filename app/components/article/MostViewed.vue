<script setup lang="ts">
defineProps<{
  articles: any[]
}>()
</script>

<template>
  <div>
    <h2>Most Viewed Today</h2>
    <ul style="list-style: none; padding: 0;">
      <li v-for="article in articles" :key="article.id" style="margin-bottom: 12px;">
        <NuxtLink :to="`/article/${article.slug}`">
          {{ article.title }}
        </NuxtLink>
        <span v-if="article.todayViews" style="color: #999; font-size: 0.85em;">
          · {{ article.todayViews }} views
        </span>
      </li>
    </ul>
  </div>
</template>
