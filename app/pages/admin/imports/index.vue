<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin-auth'] })

interface BatchCounts {
  pending: number
  processing: number
  published: number
  failed: number
}

interface Batch {
  id: string
  category_id: string
  total_urls: number
  status: string
  created_at: string
  completed_at: string | null
  categories: { name: string } | null
  counts: BatchCounts
}

const supabase = useSupabaseClient()
const loading = ref(true)
const batches = ref<Batch[]>([])

async function loadBatches() {
  try {
    const { data: session } = await supabase.auth.getSession()
    const result = await $fetch('/api/admin/import-batches', {
      headers: { Authorization: `Bearer ${session.session?.access_token}` },
    })
    batches.value = (result as any).batches || []
  }
  catch {
    // silently fail
  }
  finally {
    loading.value = false
  }
}

// Initial load
await loadBatches()

// Supabase Realtime subscription for live updates
const channel = supabase
  .channel('import-jobs-changes')
  .on(
    'postgres_changes' as any,
    { event: 'UPDATE', schema: 'public', table: 'import_jobs' },
    (payload: any) => {
      const { batch_id, status } = payload.new
      const oldStatus = payload.old?.status

      // Update the local counts
      const batch = batches.value.find(b => b.id === batch_id)
      if (batch && oldStatus && oldStatus !== status) {
        if (oldStatus in batch.counts) {
          batch.counts[oldStatus as keyof BatchCounts] = Math.max(0, batch.counts[oldStatus as keyof BatchCounts] - 1)
        }
        if (status in batch.counts) {
          batch.counts[status as keyof BatchCounts]++
        }

        // Update batch status based on counts
        const total = batch.counts.published + batch.counts.failed
        if (total === batch.total_urls) {
          batch.status = batch.counts.failed > 0 ? 'partial_failure' : 'completed'
        }
        else if (batch.counts.processing > 0) {
          batch.status = 'processing'
        }
      }
    },
  )
  .subscribe()

onUnmounted(() => {
  supabase.removeChannel(channel)
})

function progressPercent(batch: Batch): number {
  const done = batch.counts.published + batch.counts.failed
  return batch.total_urls > 0 ? Math.round((done / batch.total_urls) * 100) : 0
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: 'Đang chờ',
    processing: 'Đang xử lý',
    completed: 'Hoàn tất',
    partial_failure: 'Có lỗi',
  }
  return map[status] || status
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'text-slate-500 bg-slate-100',
    processing: 'text-blue-600 bg-blue-50',
    completed: 'text-green-600 bg-green-50',
    partial_failure: 'text-amber-600 bg-amber-50',
  }
  return map[status] || 'text-slate-500 bg-slate-100'
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Bulk Import</h1>
      <NuxtLink
        to="/admin/imports/new"
        class="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
      >
        + Import mới
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-slate-400">Đang tải...</div>

    <!-- Empty state -->
    <div v-else-if="batches.length === 0" class="text-center py-12">
      <p class="text-slate-400 mb-4">Chưa có batch import nào</p>
      <NuxtLink
        to="/admin/imports/new"
        class="inline-block px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
      >
        Tạo import đầu tiên
      </NuxtLink>
    </div>

    <!-- Batch list -->
    <div v-else class="space-y-4">
      <div
        v-for="batch in batches"
        :key="batch.id"
        class="bg-white border border-slate-200 rounded-xl p-5"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="font-medium text-slate-800">
              {{ batch.categories?.name || 'Unknown' }}
            </span>
            <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', statusColor(batch.status)]">
              {{ statusLabel(batch.status) }}
            </span>
          </div>
          <span class="text-xs text-slate-400">{{ formatTime(batch.created_at) }}</span>
        </div>

        <!-- Progress bar -->
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
          <div class="h-full rounded-full transition-all duration-500 ease-out" :style="{ width: `${progressPercent(batch)}%` }" :class="batch.counts.failed > 0 ? 'bg-amber-400' : 'bg-green-500'" />
        </div>

        <!-- Status counts -->
        <div class="flex items-center gap-4 text-xs">
          <span class="text-slate-500">{{ batch.total_urls }} URLs</span>
          <span class="text-green-600" v-if="batch.counts.published > 0">✓ {{ batch.counts.published }}</span>
          <span class="text-blue-500" v-if="batch.counts.processing > 0">⟳ {{ batch.counts.processing }}</span>
          <span class="text-slate-400" v-if="batch.counts.pending > 0">○ {{ batch.counts.pending }}</span>
          <span class="text-red-500" v-if="batch.counts.failed > 0">✗ {{ batch.counts.failed }}</span>
          <span class="ml-auto text-slate-400">{{ progressPercent(batch) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
