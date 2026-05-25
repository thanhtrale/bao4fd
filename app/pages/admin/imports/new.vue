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
    const { user } = useAuth()
    const supabase = useSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    const result = await $fetch('/api/admin/bulk-import', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session?.access_token}` },
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
        <p class="text-sm text-slate-500 mt-1">Paste URLs từ VNExpress (mỗi dòng 1 URL, tối đa 100)</p>
      </div>
      <NuxtLink to="/admin/imports" class="text-sm text-slate-500 hover:text-accent transition-colors">
        ← Danh sách import
      </NuxtLink>
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
          rows="12"
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
