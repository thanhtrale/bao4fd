<template>
  <div class="space-y-4">
    <div v-for="i in 6" :key="i" class="flex gap-4 p-3 rounded-lg border border-border">
      <!-- Thumbnail skeleton -->
      <div class="shrink-0 w-32 sm:w-44 aspect-video rounded-md bg-slate-100 animate-pulse" />
      <!-- Content skeleton -->
      <div class="flex-1 space-y-2 py-2">
        <div class="flex gap-2">
          <div class="h-3 w-16 rounded bg-slate-100 animate-pulse" />
          <div class="h-3 w-20 rounded bg-slate-100 animate-pulse" />
        </div>
        <div class="h-5 w-full rounded bg-slate-200 animate-pulse" />
        <div class="h-5 w-3/4 rounded bg-slate-200 animate-pulse" />
        <div class="h-3 w-full rounded bg-slate-100 animate-pulse hidden sm:block" />
      </div>
    </div>
  </div>
</template>
