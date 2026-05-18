<script setup lang="ts">
const { logout } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <span class="font-bold text-lg text-slate-800">Admin</span>
          <nav class="flex items-center gap-1">
            <NuxtLink to="/admin" class="px-3 py-1.5 rounded text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Dashboard</NuxtLink>
            <NuxtLink to="/admin/categories" class="px-3 py-1.5 rounded text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Categories</NuxtLink>
            <NuxtLink to="/admin/articles" class="px-3 py-1.5 rounded text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Articles</NuxtLink>
          </nav>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-sm text-slate-500 hover:text-accent transition-colors">
            ← Back to site
          </NuxtLink>
          <button
            class="text-sm text-red-500 hover:text-red-700 transition-colors"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
    <main class="max-w-6xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>
