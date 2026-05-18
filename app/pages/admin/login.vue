<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { loginWithEmail, loginWithGoogle, loading, error } = useAuth()

const email = ref('')
const password = ref('')

async function handleSubmit() {
  const success = await loginWithEmail(email.value, password.value)
  if (success) {
    await navigateTo('/admin')
  }
}
</script>

<template>
  <div style="max-width: 400px; margin: 100px auto; padding: 20px;">
    <h1>Admin Login</h1>

    <div v-if="error" style="color: red; margin-bottom: 16px;">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 12px;">
        <label for="email">Email</label><br>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          style="width: 100%; padding: 8px;"
        >
      </div>

      <div style="margin-bottom: 12px;">
        <label for="password">Password</label><br>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          style="width: 100%; padding: 8px;"
        >
      </div>

      <button type="submit" :disabled="loading" style="width: 100%; padding: 10px; margin-bottom: 12px;">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <hr>

    <button style="width: 100%; padding: 10px;" @click="loginWithGoogle">
      Login with Google
    </button>
  </div>
</template>
