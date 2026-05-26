<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin-auth'] })

interface Job {
  id: string
  url: string
  status: string
  error_message: string | null
  article_slug: string | null
  updated_at: string
}

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
  categoryNames: string[]
  counts: BatchCounts
}

const supabase = useSupabaseClient()
const loading = ref(true)
const batches = ref<Batch[]>([])
const expandedBatch = ref<string | null>(null)
const batchJobs = ref<Record<string, Job[]>>({})
const loadingJobs = ref<string | null>(null)
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
    { event: '*', schema: 'public', table: 'import_jobs' },
    (payload: any) => {
      // Any change on import_jobs → reload batches from API
      loadBatches()
    },
  )
  .subscribe()

// Polling fallback (every 5s) in case Realtime doesn't work
const hasActiveBatches = computed(() =>
  batches.value.some(b => b.status === 'pending' || b.status === 'processing'),
)

let pollTimer: ReturnType<typeof setInterval> | null = null

watch(hasActiveBatches, (active) => {
  if (active && !pollTimer) {
    pollTimer = setInterval(() => loadBatches(), 5000)
  }
  else if (!active && pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}, { immediate: true })

onUnmounted(() => {
  supabase.removeChannel(channel)
  if (pollTimer) clearInterval(pollTimer)
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

async function toggleBatchDetail(batchId: string) {
  if (expandedBatch.value === batchId) {
    expandedBatch.value = null
    return
  }
  expandedBatch.value = batchId
  await loadJobsForBatch(batchId)
}

async function loadJobsForBatch(batchId: string) {
  loadingJobs.value = batchId
  try {
    const { data: session } = await supabase.auth.getSession()
    const result = await $fetch('/api/admin/import-jobs', {
      params: { batchId },
      headers: { Authorization: `Bearer ${session.session?.access_token}` },
    })
    batchJobs.value[batchId] = (result as any).jobs || []
  }
  catch {
    batchJobs.value[batchId] = []
  }
  finally {
    loadingJobs.value = null
  }
}

function jobStatusIcon(status: string): string {
  return { published: '✓', failed: '✗', processing: '⟳', pending: '○' }[status] || '?'
}

function jobStatusColor(status: string): string {
  return { published: 'text-green-600', failed: 'text-red-500', processing: 'text-blue-500', pending: 'text-slate-400' }[status] || 'text-slate-400'
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
        <!-- Header (clickable) -->
        <div
          class="flex items-center justify-between mb-3 cursor-pointer"
          @click="toggleBatchDetail(batch.id)"
        >
          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400 transition-transform" :class="{ 'rotate-90': expandedBatch === batch.id }">▶</span>
            <span class="font-medium text-slate-800">
              {{ batch.categoryNames?.length ? batch.categoryNames.join(', ') : (batch.categories?.name || 'Unknown') }}
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

        <!-- Expandable job details -->
        <div v-if="expandedBatch === batch.id" class="mt-4 border-t border-slate-100 pt-4">
          <div v-if="loadingJobs === batch.id" class="text-xs text-slate-400 py-2">Đang tải chi tiết...</div>
          <div v-else-if="batchJobs[batch.id]?.length" class="space-y-2">
            <div
              v-for="job in batchJobs[batch.id]"
              :key="job.id"
              class="flex items-start gap-2 text-xs py-1.5 border-b border-slate-50 last:border-0"
            >
              <span :class="[jobStatusColor(job.status), 'font-medium shrink-0 mt-0.5']">{{ jobStatusIcon(job.status) }}</span>
              <div class="min-w-0 flex-1">
                <a :href="job.url" target="_blank" class="text-slate-600 hover:text-accent truncate block">
                  {{ job.url }}
                </a>
                <div v-if="job.status === 'published' && job.article_slug" class="mt-0.5">
                  <NuxtLink :to="`/article/${job.article_slug}`" class="text-green-600 hover:underline">
                    → /article/{{ job.article_slug }}
                  </NuxtLink>
                </div>
                <div v-if="job.status === 'failed' && job.error_message" class="mt-0.5 text-red-400">
                  {{ job.error_message }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-xs text-slate-400 py-2">Không có dữ liệu</div>
        </div>
      </div>
    </div>
  </div>
</template>
