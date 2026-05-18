<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin-auth'] })

const articles = ref<any[]>([])
const loading = ref(true)

async function getToken() {
  const supabase = useSupabaseClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

async function loadArticles() {
  loading.value = true
  try {
    const result = await $fetch('/api/articles?limit=100') as any
    articles.value = result.data
  } finally {
    loading.value = false
  }
}

async function deleteArticle(id: string) {
  if (!confirm('Are you sure you want to delete this article?')) return

  try {
    await $fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
    await loadArticles()
  } catch (e: any) {
    alert(e.data?.statusMessage || 'Failed to delete article')
  }
}

onMounted(loadArticles)
</script>

<template>
  <div>
    <h1>Articles</h1>

    <NuxtLink to="/admin/articles/new" style="display: inline-block; margin-bottom: 16px; padding: 8px 16px; border: 1px solid #ccc; text-decoration: none;">
      + New Article
    </NuxtLink>

    <div v-if="loading">
      Loading...
    </div>
    <table v-else style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ccc;">Title</th>
          <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ccc;">Status</th>
          <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ccc;">Published</th>
          <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ccc;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.id">
          <td style="padding: 8px; border-bottom: 1px solid #eee;">{{ article.title }}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            <span :style="{ color: article.is_published ? 'green' : 'orange' }">
              {{ article.is_published ? 'Published' : 'Draft' }}
            </span>
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            {{ article.published_at ? new Date(article.published_at).toLocaleDateString() : '-' }}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            <NuxtLink :to="`/admin/articles/${article.id}`">Edit</NuxtLink>
            <button @click="deleteArticle(article.id)" style="color: red; margin-left: 8px;">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
