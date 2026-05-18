<template>
  <div class="min-h-screen flex flex-col bg-white">
    <SiteHeader />
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
