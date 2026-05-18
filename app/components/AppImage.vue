<script setup lang="ts">
const props = withDefaults(defineProps<{
  src?: string | null
  alt?: string
  eager?: boolean
  class?: string
}>(), {
  eager: false,
})

const loaded = ref(false)
const imgRef = ref<HTMLImageElement>()

function onLoad() {
  loaded.value = true
}

onMounted(() => {
  if (imgRef.value?.complete && imgRef.value?.naturalWidth > 0) {
    loaded.value = true
  }
})
</script>

<template>
  <div class="relative overflow-hidden bg-slate-100" :class="props.class">
    <!-- Skeleton shimmer -->
    <div
      v-if="!loaded"
      class="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"
    />

    <!-- Actual image with blur-up -->
    <img
      v-if="src"
      ref="imgRef"
      :src="src"
      :alt="alt || ''"
      :loading="eager ? 'eager' : 'lazy'"
      class="w-full h-full object-cover transition-[filter,opacity] duration-300"
      :class="loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'"
      @load="onLoad"
    />

    <!-- Fallback when no src -->
    <div v-if="!src" class="w-full h-full flex items-center justify-center">
      <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    </div>
  </div>
</template>
