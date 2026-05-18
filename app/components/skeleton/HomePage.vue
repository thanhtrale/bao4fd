<template>
  <div>
    <!-- Hero skeleton -->
    <div class="w-full h-64 md:h-96 rounded-xl bg-slate-200 animate-pulse mb-8" />

    <div class="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
      <!-- Cards grid skeleton -->
      <div class="space-y-10">
        <div v-for="s in 2" :key="s">
          <div class="h-6 w-32 rounded bg-slate-200 animate-pulse mb-4" />
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <SkeletonCard v-for="i in 4" :key="i" />
          </div>
        </div>
      </div>
      <!-- Sidebar skeleton -->
      <div class="hidden lg:block">
        <div class="bg-surface rounded-xl p-5 border border-border space-y-3">
          <div class="h-5 w-40 rounded bg-slate-200 animate-pulse" />
          <div v-for="i in 5" :key="i" class="flex gap-3">
            <div class="h-6 w-6 rounded bg-slate-100 animate-pulse" />
            <div class="h-4 w-full rounded bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
