<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin-auth'] })

const route = useRoute()
const id = route.params.id as string
const isNew = id === 'new'

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  thumbnail: '',
  category_id: '',
  is_published: false,
})

const categories = ref<any[]>([])
const saving = ref(false)
const uploading = ref(false)

async function getToken() {
  const supabase = useSupabaseClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

// Load categories
onMounted(async () => {
  categories.value = await $fetch('/api/categories')

  // Load existing article if editing
  if (!isNew) {
    try {
      const article = await $fetch(`/api/admin/articles/${id}`) as any
      if (article) {
        form.value = {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || '',
          content: article.content || '',
          thumbnail: article.thumbnail || '',
          category_id: article.category_id,
          is_published: article.is_published,
        }
      }
    } catch {
      // silently fail, form stays empty
    }
  }
})

async function uploadThumbnail(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('File size exceeds 2MB limit')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const result = await $fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${await getToken()}` },
      body: formData,
    }) as any

    form.value.thumbnail = result.url
  } catch (e: any) {
    alert(e.data?.statusMessage || 'Upload failed')
  } finally {
    uploading.value = false
  }
}

// Auto-generate slug from title
watch(() => form.value.title, (title) => {
  if (isNew) {
    form.value.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
})

async function save() {
  saving.value = true
  try {
    const token = await getToken()
    if (isNew) {
      await $fetch('/api/articles', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form.value,
      })
    } else {
      await $fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: form.value,
      })
    }
    await navigateTo('/admin/articles')
  } catch (e: any) {
    alert(e.data?.statusMessage || 'Failed to save')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl">
    <h1 class="text-2xl font-bold mb-6">{{ isNew ? 'New Article' : 'Edit Article' }}</h1>

    <form @submit.prevent="save" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Title *</label>
        <input v-model="form.title" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
        <input v-model="form.slug" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Category *</label>
        <select v-model="form.category_id" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors">
          <option value="">Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
        <textarea v-model="form.excerpt" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Content * (HTML)</label>
        <textarea v-model="form.content" rows="15" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Thumbnail</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" class="text-sm text-slate-500 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" @change="uploadThumbnail" />
        <span v-if="uploading" class="ml-2 text-sm text-slate-500">Uploading...</span>
        <div v-if="form.thumbnail" class="mt-2">
          <img :src="form.thumbnail" class="max-w-[200px] max-h-[120px] rounded-lg border border-slate-200" />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <input v-model="form.is_published" type="checkbox" id="published" class="rounded border-slate-300 text-accent focus:ring-accent/50" />
        <label for="published" class="text-sm font-medium text-slate-700">Published</label>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          :disabled="saving"
          class="px-5 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors"
        >
          {{ saving ? 'Saving...' : (isNew ? 'Create Article' : 'Update Article') }}
        </button>
        <NuxtLink to="/admin/articles" class="px-4 py-2.5 text-sm text-slate-600 hover:text-slate-800 transition-colors">
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>
