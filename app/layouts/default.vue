<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
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
