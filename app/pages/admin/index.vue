<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin-auth'] })

const { logout, user } = useAuth()
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-slate-500 mt-1">Welcome, {{ user?.email }}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <NuxtLink
        to="/admin/categories"
        class="p-5 bg-white border border-slate-200 rounded-xl hover:border-accent/30 hover:shadow-md transition-all group"
      >
        <h3 class="font-semibold text-slate-800 group-hover:text-accent transition-colors">Categories</h3>
        <p class="text-sm text-slate-500 mt-1">Manage news categories</p>
      </NuxtLink>
      <NuxtLink
        to="/admin/articles"
        class="p-5 bg-white border border-slate-200 rounded-xl hover:border-accent/30 hover:shadow-md transition-all group"
      >
        <h3 class="font-semibold text-slate-800 group-hover:text-accent transition-colors">Articles</h3>
        <p class="text-sm text-slate-500 mt-1">Manage news articles</p>
      </NuxtLink>
    </div>

    <button
      class="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>
