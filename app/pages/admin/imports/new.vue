<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin-auth'] })

const router = useRouter()
const { fetchCategories } = useCategories()

const urlText = ref('')
const categoryId = ref('')
const notifyEmail = ref(false)
const submitting = ref(false)
const errorMsg = ref('')
const skipped = ref<string[]>([])
const { data: categories } = await fetchCategories()

// Article browser state
const browseUrl = ref('')
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

const selectedCount = computed(() => browseArticles.value.filter(a => a.selected).length)
const allSelected = computed(() => browseArticles.value.length > 0 && browseArticles.value.every(a => a.selected))

function toggleSelectAll() {
  const newVal = !allSelected.value
  browseArticles.value.forEach(a => a.selected = newVal)
}

async function fetchAuthHeaders() {
  const supabase = useSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return { Authorization: `Bearer ${session?.access_token}` }
}

async function browseFetch() {
  const url = browseUrl.value.trim()
  if (!url) return
  browseError.value = ''
  browsing.value = true
  browseArticles.value = []
  browseCategories.value = []
  browseMode.value = 'idle'

  try {
    const headers = await fetchAuthHeaders()
    const result = await $fetch<any>('/api/admin/fetch-category-urls', {
      params: { url, limit: browseLimit.value },
      headers,
    })

    if (result.type === 'categories') {
      browseCategories.value = (result.categories || []).map((c: any) => ({ ...c, selected: false }))
      browseMode.value = 'categories'
      if (browseCategories.value.length === 0) {
        browseError.value = 'Không tìm thấy danh mục nào'
      }
    }
    else if (result.type === 'articles') {
      browseArticles.value = (result.articles || []).map((a: any) => ({ ...a, selected: true }))
      browseMode.value = 'articles'
      if (browseArticles.value.length === 0) {
        browseError.value = 'Không tìm thấy bài viết nào'
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
  if (selected.length === 0) return
  browseError.value = ''
  browsing.value = true
  browseArticles.value = []

  try {
    const headers = await fetchAuthHeaders()
    for (const cat of selected) {
      const result = await $fetch<any>('/api/admin/fetch-category-urls', {
        params: { url: cat.url, limit: browseLimit.value },
        headers,
      })
      if (result.type === 'articles' && result.articles) {
        const existing = new Set(browseArticles.value.map(a => a.url))
        for (const a of result.articles) {
          if (!existing.has(a.url)) {
            browseArticles.value.push({ ...a, selected: true })
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

function addSelectedToTextarea() {
  const selectedUrls = browseArticles.value.filter(a => a.selected).map(a => a.url)
  if (selectedUrls.length === 0) return
  const existing = new Set(getUrls())
  const newUrls = selectedUrls.filter(u => !existing.has(u))
  if (newUrls.length > 0) {
    const current = urlText.value.trim()
    urlText.value = current ? `${current}\n${newUrls.join('\n')}` : newUrls.join('\n')
  }
  // Reset browser
  browseArticles.value = []
  browseMode.value = 'idle'
}

function getUrls(): string[] {
  return urlText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
}

function validate(): string | null {
  const urls = getUrls()
  if (urls.length === 0) return 'Vui lòng nhập ít nhất 1 URL'
  if (urls.length > 100) return `Tối đa 100 URLs (hiện tại: ${urls.length})`
  if (!categoryId.value) return 'Vui lòng chọn danh mục'

  const invalid = urls.filter(url => {
    try {
      const parsed = new URL(url)
      return !['http:', 'https:'].includes(parsed.protocol)
    }
    catch {
      return true
    }
  })
  if (invalid.length > 0) return `URL không hợp lệ: ${invalid.slice(0, 3).join(', ')}${invalid.length > 3 ? '...' : ''}`

  return null
}

async function submit() {
  errorMsg.value = ''
  skipped.value = []

  const validationError = validate()
  if (validationError) {
    errorMsg.value = validationError
    return
  }

  submitting.value = true
  try {
    const headers = await fetchAuthHeaders()

    const result = await $fetch('/api/admin/bulk-import', {
      method: 'POST',
      headers,
      body: { urls: getUrls(), categoryId: categoryId.value, notifyEmail: notifyEmail.value },
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

const urlCount = computed(() => getUrls().length)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Import bài viết</h1>
        <p class="text-sm text-slate-500 mt-1">Duyệt bài viết từ VNExpress hoặc paste URLs trực tiếp</p>
      </div>
      <NuxtLink to="/admin/imports" class="text-sm text-slate-500 hover:text-accent transition-colors">
        ← Danh sách import
      </NuxtLink>
    </div>

    <div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Duyệt bài viết từ VNExpress</h2>

      <!-- Browse URL input + limit -->
      <div class="flex gap-2 mb-3">
        <input
          v-model="browseUrl"
          type="text"
          placeholder="https://vnexpress.net hoặc https://vnexpress.net/thoi-su"
          class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          @keydown.enter.prevent="browseFetch"
        >
        <input
          v-model.number="browseLimit"
          type="number"
          min="1"
          max="100"
          class="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          title="Số bài tối đa"
        >
        <button
          :disabled="browsing || !browseUrl.trim()"
          class="px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          @click="browseFetch"
        >
          <span v-if="browsing">Đang tải...</span>
          <span v-else>Fetch</span>
        </button>
      </div>
      <p class="text-xs text-slate-400 mb-4">Paste URL trang chủ (hiện danh mục) hoặc trang danh mục (hiện bài viết). Giới hạn: {{ browseLimit }} bài / danh mục.</p>

      <!-- Browse error -->
      <div v-if="browseError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
        {{ browseError }}
      </div>

      <!-- Category selection (homepage) -->
      <div v-if="browseMode === 'categories'" class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-slate-700">Chọn danh mục để lấy bài viết:</h3>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
          <label
            v-for="cat in browseCategories"
            :key="cat.url"
            class="flex items-center gap-2 p-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-sm"
            :class="{ 'bg-accent/5 border-accent/30': cat.selected }"
          >
            <input
              v-model="cat.selected"
              type="checkbox"
              class="w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent/30"
            >
            <span>{{ cat.name }}</span>
          </label>
        </div>
        <button
          :disabled="browsing || browseCategories.filter(c => c.selected).length === 0"
          class="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="fetchFromSelectedCategories"
        >
          <span v-if="browsing">Đang tải...</span>
          <span v-else>Fetch bài viết ({{ browseCategories.filter(c => c.selected).length }} danh mục)</span>
        </button>
      </div>

      <!-- Article list with checkboxes -->
      <div v-if="browseMode === 'articles' && browseArticles.length > 0">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-slate-700">
            {{ browseArticles.length }} bài viết · {{ selectedCount }} đã chọn
          </h3>
          <button
            class="text-xs text-accent hover:text-accent/80 transition-colors"
            @click="toggleSelectAll"
          >
            {{ allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả' }}
          </button>
        </div>
        <div class="max-h-80 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
          <label
            v-for="article in browseArticles"
            :key="article.url"
            class="flex items-start gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
            :class="{ 'bg-accent/5': article.selected }"
          >
            <input
              v-model="article.selected"
              type="checkbox"
              class="w-4 h-4 mt-0.5 rounded border-slate-300 text-accent focus:ring-accent/30 shrink-0"
            >
            <div class="min-w-0 flex-1">
              <p class="text-sm text-slate-800 leading-snug">{{ article.title }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span v-if="article.categoryName" class="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                  {{ article.categoryName }}
                </span>
                <span class="text-xs text-slate-400 truncate">{{ article.url }}</span>
              </div>
            </div>
          </label>
        </div>
        <button
          :disabled="selectedCount === 0"
          class="mt-3 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="addSelectedToTextarea"
        >
          Thêm {{ selectedCount }} bài vào danh sách import
        </button>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-xl p-6">
      <!-- Error message -->
      <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
        {{ errorMsg }}
      </div>

      <!-- Skipped URLs -->
      <div v-if="skipped.length > 0" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
        <p class="font-medium">{{ skipped.length }} URL đã bị bỏ qua (trùng lặp):</p>
        <ul class="mt-1 list-disc list-inside">
          <li v-for="url in skipped" :key="url" class="truncate">{{ url }}</li>
        </ul>
      </div>

      <!-- Category -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
        <select
          v-model="categoryId"
          class="w-full sm:w-64 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        >
          <option value="" disabled>Chọn danh mục...</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- URL textarea -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-1">
          <label class="text-sm font-medium text-slate-700">URLs</label>
          <span class="text-xs text-slate-400">{{ urlCount }}/100</span>
        </div>
        <textarea
          v-model="urlText"
          rows="8"
          placeholder="https://vnexpress.net/bai-viet-1.html&#10;https://vnexpress.net/bai-viet-2.html&#10;https://vnexpress.net/bai-viet-3.html"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-y"
          :class="{ 'border-red-300': urlCount > 100 }"
        />
      </div>

      <!-- Notify email -->
      <div class="mb-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="notifyEmail"
            type="checkbox"
            class="w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent/30"
          >
          <span class="text-sm text-slate-700">Gửi email báo cáo khi import xong</span>
        </label>
        <p class="text-xs text-slate-400 mt-1 ml-6">Bao gồm danh sách thành công/thất bại và link bài viết đã import</p>
      </div>

      <!-- Submit -->
      <button
        :disabled="submitting"
        class="px-5 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="submit"
      >
        <span v-if="submitting">Đang xử lý...</span>
        <span v-else>Submit Bulk Import</span>
      </button>
    </div>
  </div>
</template>
