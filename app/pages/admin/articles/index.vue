<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin-auth'] })

const articles = ref<any[]>([])
const loading = ref(true)
const meta = ref<{ page: number; totalPages: number; total: number } | null>(null)
const authors = ref<any[]>([])
const userRole = ref('')

// Filters
const search = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const authorFilter = ref('')
const currentPage = ref(1)

async function getToken() {
  const supabase = useSupabaseClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

async function loadArticles() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('page', String(currentPage.value))
    params.set('limit', '20')
    if (search.value) params.set('search', search.value)
    if (dateFrom.value) params.set('dateFrom', dateFrom.value)
    if (dateTo.value) params.set('dateTo', dateTo.value)
    if (authorFilter.value) params.set('author', authorFilter.value)

    const result = await $fetch(`/api/admin/articles?${params.toString()}`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }) as any
    articles.value = result.data
    meta.value = result.meta
    if (result.authors?.length) {
      authors.value = result.authors
      userRole.value = 'admin'
    }
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  currentPage.value = 1
  loadArticles()
}

function goToPage(page: number) {
  currentPage.value = page
  loadArticles()
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

// Pagination range with ellipsis
const paginationRange = computed(() => {
  if (!meta.value) return []
  const { page, totalPages } = meta.value
  const range: (number | string)[] = []
  const delta = 2
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      range.push(i)
    } else if (range[range.length - 1] !== '...') {
      range.push('...')
    }
  }
  return range
})

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

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-4 items-end">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-medium text-slate-500 mb-1">Tìm theo tên</label>
        <input
          v-model="search"
          type="text"
          placeholder="Tên bài viết..."
          class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          @keyup.enter="applyFilters"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1">Từ ngày</label>
        <input
          v-model="dateFrom"
          type="date"
          class="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1">Đến ngày</label>
        <input
          v-model="dateTo"
          type="date"
          class="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
      <div v-if="userRole === 'admin' && authors.length">
        <label class="block text-xs font-medium text-slate-500 mb-1">Tác giả</label>
        <select
          v-model="authorFilter"
          class="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="">Tất cả</option>
          <option v-for="a in authors" :key="a.id" :value="a.id">
            {{ a.display_name || a.email }}
          </option>
        </select>
      </div>
      <button
        class="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
        @click="applyFilters"
      >
        Lọc
      </button>
      <button
        class="px-4 py-2 border border-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
        @click="search = ''; dateFrom = ''; dateTo = ''; authorFilter = ''; applyFilters()"
      >
        Xóa bộ lọc
      </button>
    </div>

    <!-- Results count -->
    <div v-if="meta" class="text-xs text-slate-500 mb-3">
      {{ meta.total }} bài viết | Trang {{ meta.page }}/{{ meta.totalPages }}
    </div>

    <div v-if="loading" class="text-sm text-slate-500">Loading...</div>

    <div v-else class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50">
            <th class="text-left px-4 py-3 font-medium text-slate-600">Title</th>
            <th v-if="userRole === 'admin'" class="text-left px-4 py-3 font-medium text-slate-600">Author</th>
            <th class="text-left px-4 py-3 font-medium text-slate-600">Status</th>
            <th class="text-left px-4 py-3 font-medium text-slate-600">Published</th>
            <th class="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in articles" :key="article.id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td class="px-4 py-3 font-medium text-slate-800">{{ article.title }}</td>
            <td v-if="userRole === 'admin'" class="px-4 py-3 text-slate-500 text-xs">
              {{ article.profiles?.display_name || article.profiles?.email || '-' }}
            </td>
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
          <tr v-if="!articles.length">
            <td :colspan="userRole === 'admin' ? 5 : 4" class="px-4 py-8 text-center text-slate-400">Không tìm thấy bài viết nào</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="meta && meta.totalPages > 1" class="flex items-center justify-center gap-1 mt-6">
      <button
        :disabled="meta.page <= 1"
        class="px-3 py-1.5 text-sm rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        @click="goToPage(meta!.page - 1)"
      >
        ←
      </button>
      <template v-for="item in paginationRange" :key="item">
        <span v-if="item === '...'" class="px-2 text-slate-400">...</span>
        <button
          v-else
          class="px-3 py-1.5 text-sm rounded-md border transition-colors"
          :class="item === meta.page ? 'bg-accent text-white border-accent' : 'border-slate-200 hover:bg-slate-50'"
          @click="goToPage(item as number)"
        >
          {{ item }}
        </button>
      </template>
      <button
        :disabled="meta.page >= meta.totalPages"
        class="px-3 py-1.5 text-sm rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        @click="goToPage(meta!.page + 1)"
      >
        →
      </button>
    </div>
  </div>
</template>
