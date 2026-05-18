<script setup lang="ts">
defineProps<{
  articles: any[]
}>()

const rankColors = ['text-accent font-extrabold', 'text-slate-700 font-bold', 'text-slate-700 font-bold', 'text-text-muted font-semibold', 'text-text-muted font-semibold']
</script>

<template>
  <div class="bg-surface rounded-xl p-5 border border-border">
    <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
      <span class="text-xl">🔥</span> Đọc nhiều hôm nay
    </h3>
    <ol class="space-y-3">
      <li v-for="(article, index) in articles" :key="article.id" class="flex gap-3 items-start">
        <span class="text-2xl leading-none w-7 shrink-0" :class="rankColors[index] || rankColors[4]">
          {{ index + 1 }}
        </span>
        <div class="flex-1 min-w-0">
          <NuxtLink
            :to="`/article/${article.slug}`"
            class="text-sm font-medium leading-snug line-clamp-2 hover:text-accent transition-colors"
          >
            {{ article.title }}
          </NuxtLink>
          <span v-if="article.todayViews" class="inline-flex items-center gap-0.5 mt-1 text-xs text-text-muted">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            {{ article.todayViews }}
          </span>
        </div>
      </li>
    </ol>
  </div>
</template>
