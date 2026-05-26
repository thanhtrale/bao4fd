<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin-auth'] })

const router = useRouter()
const { fetchCategories } = useCategories()

const notifyEmail = ref(false)
const submitting = ref(false)
const errorMsg = ref('')
const skipped = ref<string[]>([])
const { data: categories } = await fetchCategories()

// Source selection
const activeSource = ref<'vnexpress' | 'tuoitre' | null>(null)
const browseLimit = ref(10)
const browsing = ref(false)
const browseError = ref('')

interface BrowseArticle {
  url: string
  title: string
  categoryName: string
  selected: boolean
}

interface BrowseCategory {
  name: string
  url: string
  selected: boolean
}

const browseArticles = ref<BrowseArticle[]>([])
const browseCategories = ref<BrowseCategory[]>([])
const browseMode = ref<'idle' | 'categories' | 'articles'>('idle')

// Import queue
interface ImportItem {
  url: string
  title: string
  categoryId: string
  categoryName: string
}
const importQueue = ref<ImportItem[]>([])

const selectedCount = computed(() => browseArticles.value.filter(a => a.selected).length)
const allSelected = computed(() => browseArticles.value.length > 0 && browseArticles.value.every(a => a.selected))

// Manual URL entry
const manualUrls = ref('')
const manualCategoryId = ref('')

function toggleSelectAll() {
  const newVal = !allSelected.value
  browseArticles.value.forEach(a => a.selected = newVal)
}

async function fetchAuthHeaders() {
  const supabase = useSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return { Authorization: `Bearer ${session?.access_token}` }
}

async function selectSource(source: 'vnexpress' | 'tuoitre') {
  activeSource.value = source
  browseError.value = ''
  browsing.value = true
  browseArticles.value = []
  browseCategories.value = []
  browseMode.value = 'idle'

  try {
    const headers = await fetchAuthHeaders()
    const result = await $fetch<any>('/api/admin/fetch-category-urls', {
      params: { source },
      headers,
    })

    if (result.type === 'categories') {
      browseCategories.value = (result.categories || []).map((c: any) => ({ ...c, selected: false }))
      browseMode.value = 'categories'
      if (browseCategories.value.length === 0) {
        browseError.value = 'Không tìm thấy danh mục nào'
      }
    }
  }
  catch (err: any) {
    browseError.value = err.data?.statusMessage || err.message || 'Không thể fetch'
  }
  finally {
    browsing.value = false
  }
}

async function fetchFromSelectedCategories() {
  const selected = browseCategories.value.filter(c => c.selected)
  if (selected.length === 0 || !activeSource.value) return
  browseError.value = ''
  browsing.value = true
  browseArticles.value = []

  try {
    const headers = await fetchAuthHeaders()
    for (const cat of selected) {
      const result = await $fetch<any>('/api/admin/fetch-category-urls', {
        params: { source: activeSource.value, url: cat.url, limit: browseLimit.value },
        headers,
      })
      if (result.type === 'articles' && result.articles) {
        const existing = new Set(browseArticles.value.map(a => a.url))
        for (const a of result.articles) {
          if (!existing.has(a.url)) {
            browseArticles.value.push({ ...a, categoryName: a.categoryName || cat.name, selected: true })
            existing.add(a.url)
          }
        }
      }
    }
    browseMode.value = 'articles'
    if (browseArticles.value.length === 0) {
      browseError.value = 'Không tìm thấy bài viết nào'
    }
  }
  catch (err: any) {
    browseError.value = err.data?.statusMessage || err.message || 'Không thể fetch'
  }
  finally {
    browsing.value = false
  }
}

async function findOrCreateCategory(name: string): Promise<string> {
  const headers = await fetchAuthHeaders()
  const result = await $fetch<{ id: string }>('/api/admin/categories/find-or-create', {
    method: 'POST',
    headers,
    body: { name },
  })
  return result.id
}

async function addSelectedToImport() {
  const selected = browseArticles.value.filter(a => a.selected)
  if (selected.length === 0) return

  browsing.value = true
  browseError.value = ''

  try {
    const categoryMap = new Map<string, string>()
    const uniqueNames = [...new Set(selected.map(a => a.categoryName).filter(Boolean))]

    for (const name of uniqueNames) {
      const existing = categories.value?.find(c => c.name.toLowerCase() === name.toLowerCase())
      if (existing) {
        categoryMap.set(name, existing.id)
      }
      else {
        const id = await findOrCreateCategory(name)
        categoryMap.set(name, id)
      }
    }

    const existingUrls = new Set(importQueue.value.map(i => i.url))
    for (const article of selected) {
      if (existingUrls.has(article.url)) continue
      const catId = categoryMap.get(article.categoryName)
      if (!catId) continue
      importQueue.value.push({
        url: article.url,
        title: article.title,
        categoryId: catId,
        categoryName: article.categoryName,
      })
    }

    browseArticles.value = []
    browseMode.value = 'categories'
  }
  catch (err: any) {
    browseError.value = err.data?.statusMessage || err.message || 'Lỗi khi tạo danh mục'
  }
  finally {
    browsing.value = false
  }
}

function addManualUrls() {
  if (!manualUrls.value.trim() || !manualCategoryId.value) return
  const urls = manualUrls.value
    .split('\n')
    .map(u => u.trim())
    .filter(u => u && (u.startsWith('http://') || u.startsWith('https://')))
  if (urls.length === 0) return
  const existing = new Set(importQueue.value.map(i => i.url))
  const cat = categories.value?.find(c => c.id === manualCategoryId.value)
  for (const url of urls) {
    if (existing.has(url)) continue
    importQueue.value.push({
      url,
      title: url,
      categoryId: manualCategoryId.value,
      categoryName: cat?.name || '',
    })
    existing.add(url)
  }
  manualUrls.value = ''
}

function removeFromQueue(index: number) {
  importQueue.value.splice(index, 1)
}

async function submit() {
  errorMsg.value = ''
  skipped.value = []

  if (importQueue.value.length === 0) {
    errorMsg.value = 'Chưa có bài viết nào trong danh sách import'
    return
  }

  if (importQueue.value.length > 100) {
    errorMsg.value = `Tối đa 100 bài (hiện tại: ${importQueue.value.length})`
    return
  }

  submitting.value = true
  try {
    const headers = await fetchAuthHeaders()
    const result = await $fetch<any>('/api/admin/bulk-import', {
      method: 'POST',
      headers,
      body: {
        articles: importQueue.value.map(i => ({ url: i.url, categoryId: i.categoryId })),
        notifyEmail: notifyEmail.value,
      },
    })

    if (result.skipped && result.skipped.length > 0) {
      skipped.value = result.skipped
    }

    if (result.batchId) {
      router.push('/admin/imports')
    }
    else {
      errorMsg.value = result.message || 'Không có URL nào được import'
    }
  }
  catch (err: any) {
    errorMsg.value = err.data?.statusMessage || err.message || 'Có lỗi xảy ra'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Import bài viết</h1>
        <p class="text-sm text-slate-500 mt-1">Duyệt bài viết từ nguồn tin hoặc nhập URL thủ công</p>
      </div>
      <NuxtLink to="/admin/imports" class="text-sm text-slate-500 hover:text-accent transition-colors">
        ← Danh sách import
      </NuxtLink>
    </div>

    <!-- Source pills -->
    <div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Chọn nguồn tin</h2>
      <div class="flex gap-3 mb-4">
        <button
          class="px-5 py-2.5 text-sm font-medium rounded-full border-2 transition-all"
          :class="activeSource === 'vnexpress'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:text-blue-600'"
          @click="selectSource('vnexpress')"
        >
          VNExpress
        </button>
        <button
          class="px-5 py-2.5 text-sm font-medium rounded-full border-2 transition-all"
          :class="activeSource === 'tuoitre'
            ? 'bg-orange-600 text-white border-orange-600'
            : 'bg-white text-slate-700 border-slate-300 hover:border-orange-400 hover:text-orange-600'"
          @click="selectSource('tuoitre')"
        >
          Tuổi Trẻ
        </button>
      </div>

      <!-- Loading -->
      <div v-if="browsing && browseMode === 'idle'" class="text-sm text-slate-500">Đang tải danh mục...</div>

      <!-- Browse error -->
      <div v-if="browseError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
        {{ browseError }}
      </div>

      <!-- Category selection -->
      <div v-if="browseMode === 'categories'" class="mb-4">
        <h3 class="text-sm font-medium text-slate-700 mb-2">Chọn danh mục để lấy bài viết:</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
          <label
            v-for="cat in browseCategories"
            :key="cat.url"
            class="flex items-center gap-2 p-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-sm"
            :class="{ 'bg-accent/5 border-accent/30': cat.selected }"
          >
            <input v-model="cat.selected" type="checkbox" class="w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent/30">
            <span>{{ cat.name }}</span>
          </label>
        </div>

        <div class="flex items-center gap-3">
          <label class="text-sm text-slate-600">Số bài / danh mục:</label>
          <input
            v-model.number="browseLimit"
            type="number" min="1" max="100"
            class="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          >
          <button
            :disabled="browsing || browseCategories.filter(c => c.selected).length === 0"
            class="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="fetchFromSelectedCategories"
          >
            <span v-if="browsing">Đang tải...</span>
            <span v-else>Fetch bài viết ({{ browseCategories.filter(c => c.selected).length }} danh mục)</span>
          </button>
        </div>
      </div>

      <!-- Article list -->
      <div v-if="browseMode === 'articles' && browseArticles.length > 0">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-slate-700">
            {{ browseArticles.length }} bài viết · {{ selectedCount }} đã chọn
          </h3>
          <button class="text-xs text-accent hover:text-accent/80 transition-colors" @click="toggleSelectAll">
            {{ allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả' }}
          </button>
        </div>
        <div class="max-h-80 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
          <label
            v-for="article in browseArticles" :key="article.url"
            class="flex items-start gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
            :class="{ 'bg-accent/5': article.selected }"
          >
            <input v-model="article.selected" type="checkbox" class="w-4 h-4 mt-0.5 rounded border-slate-300 text-accent focus:ring-accent/30 shrink-0">
            <div class="min-w-0 flex-1">
              <p class="text-sm text-slate-800 leading-snug">{{ article.title }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span v-if="article.categoryName" class="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{{ article.categoryName }}</span>
                <span class="text-xs text-slate-400 truncate">{{ article.url }}</span>
              </div>
            </div>
          </label>
        </div>
        <div class="flex items-center gap-3 mt-3">
          <button
            :disabled="selectedCount === 0 || browsing"
            class="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="addSelectedToImport"
          >
            <span v-if="browsing">Đang xử lý...</span>
            <span v-else>Thêm {{ selectedCount }} bài vào import</span>
          </button>
          <button class="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors" @click="browseMode = 'categories'">
            ← Quay lại danh mục
          </button>
        </div>
      </div>
    </div>

    <!-- Manual URL entry -->
    <div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Thêm URL thủ công</h2>
      <div class="mb-3">
        <textarea
          v-model="manualUrls"
          rows="4"
          placeholder="https://vnexpress.net/bai-viet-1.html&#10;https://tuoitre.vn/bai-viet-2.htm&#10;Mỗi URL một dòng"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-y"
        />
      </div>
      <div class="flex items-center gap-2">
        <select
          v-model="manualCategoryId"
          class="w-48 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        >
          <option value="" disabled>Danh mục...</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <button
          :disabled="!manualUrls.trim() || !manualCategoryId"
          class="px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="addManualUrls"
        >
          Thêm
        </button>
      </div>
    </div>

    <!-- Import queue -->
    <div class="bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-lg font-semibold mb-4">
        Danh sách import
        <span v-if="importQueue.length > 0" class="text-sm font-normal text-slate-500">({{ importQueue.length }} bài)</span>
      </h2>

      <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{{ errorMsg }}</div>

      <div v-if="skipped.length > 0" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
        <p class="font-medium">{{ skipped.length }} URL đã bị bỏ qua (trùng lặp):</p>
        <ul class="mt-1 list-disc list-inside">
          <li v-for="url in skipped" :key="url" class="truncate">{{ url }}</li>
        </ul>
      </div>

      <div v-if="importQueue.length === 0" class="py-8 text-center text-sm text-slate-400">
        Chưa có bài viết nào. Duyệt từ nguồn tin hoặc thêm URL thủ công.
      </div>

      <div v-else class="max-h-96 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 mb-4">
        <div v-for="(item, idx) in importQueue" :key="item.url" class="flex items-center gap-3 p-3">
          <div class="min-w-0 flex-1">
            <p class="text-sm text-slate-800 leading-snug truncate">{{ item.title }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{{ item.categoryName }}</span>
              <span class="text-xs text-slate-400 truncate">{{ item.url }}</span>
            </div>
          </div>
          <button class="text-slate-400 hover:text-red-500 transition-colors shrink-0" title="Xoá" @click="removeFromQueue(idx)">✕</button>
        </div>
      </div>

      <div class="mb-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="notifyEmail" type="checkbox" class="w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent/30">
          <span class="text-sm text-slate-700">Gửi email báo cáo khi import xong</span>
        </label>
      </div>

      <button
        :disabled="submitting || importQueue.length === 0"
        class="px-5 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="submit"
      >
        <span v-if="submitting">Đang xử lý...</span>
        <span v-else>Submit Import ({{ importQueue.length }} bài)</span>
      </button>
    </div>
  </div>
</template>
