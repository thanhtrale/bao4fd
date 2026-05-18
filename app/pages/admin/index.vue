<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin-auth'] })

const { logout, user } = useAuth()
</script>

<template>
  <div>
    <h1>Admin Dashboard</h1>
    <p>Welcome, {{ user?.email }}</p>

    <div style="display: flex; gap: 20px; margin-top: 20px;">
      <NuxtLink to="/admin/categories" style="padding: 20px; border: 1px solid #ccc; text-decoration: none;">
        <h3>Categories</h3>
        <p>Manage news categories</p>
      </NuxtLink>
      <NuxtLink to="/admin/articles" style="padding: 20px; border: 1px solid #ccc; text-decoration: none;">
        <h3>Articles</h3>
        <p>Manage news articles</p>
      </NuxtLink>
    </div>

    <button style="margin-top: 32px; padding: 8px 16px;" @click="logout">
      Logout
    </button>
  </div>
</template>
