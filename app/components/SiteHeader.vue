<script setup lang="ts">
const route = useRoute()
const { data: categories } = await useFetch('/api/categories')
const mobileMenuOpen = ref(false)

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-header text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-90">
        <img src="/logo.svg" alt="Logo" class="w-8 h-8" />
        <span class="font-bold text-lg hidden sm:inline">Mini News Portal</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="`/category/${cat.slug}`"
          class="px-3 py-1.5 rounded text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          :class="{ 'text-white bg-white/15': route.path === `/category/${cat.slug}` }"
        >
          {{ cat.name }}
        </NuxtLink>
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <!-- Mobile hamburger -->
        <button
          class="md:hidden p-1.5 rounded hover:bg-white/10"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav v-if="mobileMenuOpen" class="md:hidden border-t border-white/10 px-4 py-3 space-y-1">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="`/category/${cat.slug}`"
          class="block px-3 py-2 rounded text-sm text-white/80 hover:text-white hover:bg-white/10"
        >
          {{ cat.name }}
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>
