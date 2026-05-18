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
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Categories</h1>
      <button
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="showCreate ? 'bg-slate-100 text-slate-700' : 'bg-accent text-white hover:bg-accent/90'"
        @click="showCreate = !showCreate"
      >
        {{ showCreate ? 'Cancel' : '+ New Category' }}
      </button>
    </div>

    <!-- Create form -->
    <div v-if="showCreate" class="mb-6 p-4 bg-white border border-slate-200 rounded-xl">
      <h3 class="font-semibold text-sm text-slate-700 mb-3">New Category</h3>
      <div class="flex flex-wrap gap-2 items-end">
        <input v-model="createForm.name" placeholder="Name" class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
        <input v-model="createForm.slug" placeholder="Slug" class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
        <input v-model="createForm.description" placeholder="Description" class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
        <input v-model.number="createForm.sort_order" type="number" placeholder="Sort" class="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
        <button class="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors" @click="createCategory">
          Create
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-sm text-slate-500">Loading...</div>

    <div v-else class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50">
            <th class="text-left px-4 py-3 font-medium text-slate-600">Name</th>
            <th class="text-left px-4 py-3 font-medium text-slate-600">Slug</th>
            <th class="text-left px-4 py-3 font-medium text-slate-600">Sort</th>
            <th class="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <template v-if="editingId === cat.id">
              <td class="px-4 py-3"><input v-model="editForm.name" class="px-2 py-1 border border-slate-300 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent/50" /></td>
              <td class="px-4 py-3"><input v-model="editForm.slug" class="px-2 py-1 border border-slate-300 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent/50" /></td>
              <td class="px-4 py-3"><input v-model.number="editForm.sort_order" type="number" class="px-2 py-1 border border-slate-300 rounded text-sm w-16 focus:outline-none focus:ring-2 focus:ring-accent/50" /></td>
              <td class="px-4 py-3 space-x-2">
                <button class="text-accent hover:underline text-sm" @click="saveEdit">Save</button>
                <button class="text-slate-500 hover:text-slate-700 text-sm" @click="editingId = null">Cancel</button>
              </td>
            </template>
            <template v-else>
              <td class="px-4 py-3 font-medium text-slate-800">{{ cat.name }}</td>
              <td class="px-4 py-3 text-slate-500 font-mono">{{ cat.slug }}</td>
              <td class="px-4 py-3 text-slate-500">{{ cat.sort_order }}</td>
              <td class="px-4 py-3 space-x-2">
                <button class="text-accent hover:underline text-sm" @click="startEdit(cat)">Edit</button>
                <button class="text-red-500 hover:text-red-700 text-sm" @click="deleteCategory(cat.id)">Delete</button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
