<script setup lang="ts">
const props = defineProps<{
  articles: any[]
}>()

const currentIndex = ref(0)
let interval: ReturnType<typeof setInterval> | null = null
const paused = ref(false)

function startAutoRotate() {
  interval = setInterval(() => {
    if (!paused.value) {
      currentIndex.value = (currentIndex.value + 1) % props.articles.length
    }
  }, 5000)
}

function goTo(index: number) {
  currentIndex.value = index
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + props.articles.length) % props.articles.length
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.articles.length
}

onMounted(() => {
  if (props.articles.length > 1) startAutoRotate()
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div
    class="group relative w-full h-64 md:h-96 rounded-xl overflow-hidden bg-slate-900"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <!-- Slides -->
    <TransitionGroup
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-500 absolute inset-0"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-for="(article, index) in articles"
        v-show="index === currentIndex"
        :key="article.id"
        class="absolute inset-0"
      >
        <NuxtLink :to="`/article/${article.slug}`" class="block w-full h-full">
          <!-- Background -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          />
          <AppImage
            :src="article.thumbnail"
            :alt="article.title"
            :eager="true"
            class="w-full h-full object-cover"
          />

          <!-- Content overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span
              v-if="article.categories"
              class="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-accent text-white mb-3"
            >
              {{ article.categories.name }}
            </span>
            <h2 class="text-xl md:text-3xl font-bold text-white line-clamp-2 mb-2">
              {{ article.title }}
            </h2>
            <p class="text-sm text-white/70 line-clamp-2 max-w-2xl hidden md:block">
              {{ article.excerpt }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </TransitionGroup>

    <!-- Chevron Navigation -->
    <button
      v-if="articles.length > 1"
      class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
      @click="prev"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>
    <button
      v-if="articles.length > 1"
      class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
      @click="next"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>

    <!-- Dots -->
    <div v-if="articles.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
      <button
        v-for="(_, index) in articles"
        :key="index"
        class="w-2 h-2 rounded-full transition-all"
        :class="index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'"
        @click="goTo(index)"
      />
    </div>
  </div>
</template>
