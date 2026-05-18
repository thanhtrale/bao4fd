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
  <div style="max-width: 800px;">
    <h1>{{ isNew ? 'New Article' : 'Edit Article' }}</h1>

    <form @submit.prevent="save">
      <div style="margin-bottom: 12px;">
        <label>Title *</label><br>
        <input v-model="form.title" required style="width: 100%; padding: 8px;">
      </div>

      <div style="margin-bottom: 12px;">
        <label>Slug *</label><br>
        <input v-model="form.slug" required style="width: 100%; padding: 8px;">
      </div>

      <div style="margin-bottom: 12px;">
        <label>Category *</label><br>
        <select v-model="form.category_id" required style="width: 100%; padding: 8px;">
          <option value="">Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div style="margin-bottom: 12px;">
        <label>Excerpt</label><br>
        <textarea v-model="form.excerpt" rows="2" style="width: 100%; padding: 8px;" />
      </div>

      <div style="margin-bottom: 12px;">
        <label>Content * (HTML)</label><br>
        <textarea v-model="form.content" rows="15" required style="width: 100%; padding: 8px; font-family: monospace;" />
      </div>

      <div style="margin-bottom: 12px;">
        <label>Thumbnail</label><br>
        <input type="file" accept="image/jpeg,image/png,image/webp" @change="uploadThumbnail">
        <span v-if="uploading"> Uploading...</span>
        <div v-if="form.thumbnail" style="margin-top: 8px;">
          <img :src="form.thumbnail" style="max-width: 200px; max-height: 120px;">
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label>
          <input v-model="form.is_published" type="checkbox">
          Published
        </label>
      </div>

      <button type="submit" :disabled="saving" style="padding: 10px 24px;">
        {{ saving ? 'Saving...' : (isNew ? 'Create Article' : 'Update Article') }}
      </button>

      <NuxtLink to="/admin/articles" style="margin-left: 12px;">
        Cancel
      </NuxtLink>
    </form>
  </div>
</template>
