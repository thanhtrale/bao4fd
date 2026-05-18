<template>
  <div>
    <header>
      <nav>
        <span>Admin Panel</span>
        <NuxtLink to="/admin">Dashboard</NuxtLink>
        <NuxtLink to="/admin/categories">Categories</NuxtLink>
        <NuxtLink to="/admin/articles">Articles</NuxtLink>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
