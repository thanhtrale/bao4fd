<script setup lang="ts">
const { data: categories } = await useFetch('/api/categories')
</script>

<template>
  <footer class="bg-footer text-white mt-16">
    <div class="max-w-7xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <img src="/logo.svg" alt="Logo" class="w-7 h-7" />
            <span class="font-bold text-lg">Mini News Portal</span>
          </div>
          <p class="text-sm text-white/60">
            Cập nhật tin tức mới nhất mỗi ngày.
          </p>
        </div>

        <!-- Categories -->
        <div>
          <h4 class="font-semibold text-sm uppercase tracking-wide text-white/80 mb-3">Chuyên mục</h4>
          <ul class="space-y-1.5">
            <li v-for="cat in categories" :key="cat.id">
              <NuxtLink :to="`/category/${cat.slug}`" class="text-sm text-white/60 hover:text-white transition-colors">
                {{ cat.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Info -->
        <div>
          <h4 class="font-semibold text-sm uppercase tracking-wide text-white/80 mb-3">Thông tin</h4>
          <ul class="space-y-1.5">
            <li><span class="text-sm text-white/60">Liên hệ: admin@example.com</span></li>
            <li><span class="text-sm text-white/60">Powered by NuxtJS & Supabase</span></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/40">
        © {{ new Date().getFullYear() }} Mini News Portal. All rights reserved.
      </div>
    </div>
  </footer>
</template>
