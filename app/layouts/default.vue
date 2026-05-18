<template>
  <div>
    <header>
      <nav style="display: flex; justify-content: space-between; align-items: center;">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/admin" style="background: #333; color: #fff; padding: 6px 14px; border-radius: 4px; font-size: 14px; text-decoration: none;">Admin</NuxtLink>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <p>&copy; {{ new Date().getFullYear() }} Mini News Portal</p>
    </footer>
  </div>
</template>
