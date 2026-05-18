<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin-auth'] })

const { user } = useAuth()
const categories = ref<any[]>([])
const loading = ref(true)
const error = ref('')

async function getToken() {
  const supabase = useSupabaseClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

async function loadCategories() {
  loading.value = true
  try {
    categories.value = await $fetch('/api/categories')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function deleteCategory(id: string) {
  if (!confirm('Are you sure you want to delete this category?')) return

  try {
    await $fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
    await loadCategories()
  } catch (e: any) {
    alert(e.data?.statusMessage || 'Failed to delete category')
  }
}

// Edit inline state
const editingId = ref<string | null>(null)
const editForm = ref({ name: '', slug: '', description: '', sort_order: 0 })

function startEdit(cat: any) {
  editingId.value = cat.id
  editForm.value = { name: cat.name, slug: cat.slug, description: cat.description || '', sort_order: cat.sort_order }
}

async function saveEdit() {
  try {
    await $fetch(`/api/categories/${editingId.value}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${await getToken()}` },
      body: editForm.value,
    })
    editingId.value = null
    await loadCategories()
  } catch (e: any) {
    alert(e.data?.statusMessage || 'Failed to update')
  }
}

// Create new
const showCreate = ref(false)
const createForm = ref({ name: '', slug: '', description: '', sort_order: 0 })

async function createCategory() {
  try {
    await $fetch('/api/categories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${await getToken()}` },
      body: createForm.value,
    })
    showCreate.value = false
    createForm.value = { name: '', slug: '', description: '', sort_order: 0 }
    await loadCategories()
  } catch (e: any) {
    alert(e.data?.statusMessage || 'Failed to create')
  }
}

onMounted(loadCategories)
</script>

<template>
  <div>
    <h1>Categories</h1>

    <button style="margin-bottom: 16px; padding: 8px 16px;" @click="showCreate = !showCreate">
      {{ showCreate ? 'Cancel' : '+ New Category' }}
    </button>

    <!-- Create form -->
    <div v-if="showCreate" style="margin-bottom: 20px; padding: 16px; border: 1px solid #ccc;">
      <h3>New Category</h3>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <input v-model="createForm.name" placeholder="Name" style="padding: 6px;">
        <input v-model="createForm.slug" placeholder="Slug" style="padding: 6px;">
        <input v-model="createForm.description" placeholder="Description" style="padding: 6px;">
        <input v-model.number="createForm.sort_order" type="number" placeholder="Sort Order" style="padding: 6px; width: 80px;">
        <button style="padding: 6px 12px;" @click="createCategory">
          Create
        </button>
      </div>
    </div>

    <div v-if="loading">
      Loading...
    </div>
    <table v-else style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ccc;">Name</th>
          <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ccc;">Slug</th>
          <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ccc;">Sort</th>
          <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ccc;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categories" :key="cat.id">
          <template v-if="editingId === cat.id">
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><input v-model="editForm.name" style="padding: 4px;"></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><input v-model="editForm.slug" style="padding: 4px;"></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><input v-model.number="editForm.sort_order" type="number" style="padding: 4px; width: 60px;"></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">
              <button @click="saveEdit">Save</button>
              <button @click="editingId = null">Cancel</button>
            </td>
          </template>
          <template v-else>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">{{ cat.name }}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">{{ cat.slug }}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">{{ cat.sort_order }}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">
              <button @click="startEdit(cat)">Edit</button>
              <button @click="deleteCategory(cat.id)" style="color: red;">Delete</button>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
