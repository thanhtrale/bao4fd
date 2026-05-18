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
    const result = await $fetch('/api/admin/articles', {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }) as any
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
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Articles</h1>
      <NuxtLink
        to="/admin/articles/new"
        class="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
      >
        + New Article
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-sm text-slate-500">Loading...</div>

    <div v-else class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50">
            <th class="text-left px-4 py-3 font-medium text-slate-600">Title</th>
            <th class="text-left px-4 py-3 font-medium text-slate-600">Status</th>
            <th class="text-left px-4 py-3 font-medium text-slate-600">Published</th>
            <th class="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in articles" :key="article.id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td class="px-4 py-3 font-medium text-slate-800">{{ article.title }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                :class="article.is_published ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'"
              >
                {{ article.is_published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-4 py-3 text-slate-500">
              {{ article.published_at ? new Date(article.published_at).toLocaleDateString() : '-' }}
            </td>
            <td class="px-4 py-3">
              <NuxtLink :to="`/admin/articles/${article.id}`" class="text-accent hover:underline">Edit</NuxtLink>
              <button class="ml-3 text-red-500 hover:text-red-700 transition-colors" @click="deleteArticle(article.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
