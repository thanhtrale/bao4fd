<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { loginWithEmail, loginWithGoogle, signUpWithEmail, loading, error } = useAuth()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const signUpSuccess = ref(false)

async function handleSubmit() {
  if (isSignUp.value) {
    const success = await signUpWithEmail(email.value, password.value)
    if (success) {
      signUpSuccess.value = true
    }
  } else {
    const success = await loginWithEmail(email.value, password.value)
    if (success) {
      await navigateTo('/admin')
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-center mb-6">{{ isSignUp ? 'Đăng ký' : 'Đăng nhập' }}</h1>

      <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
        {{ error }}
      </div>

      <div v-if="signUpSuccess" class="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
        Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.
      </div>

      <form v-if="!signUpSuccess" @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Đang xử lý...' : (isSignUp ? 'Đăng ký' : 'Đăng nhập') }}
        </button>
      </form>

      <div class="text-center mt-4">
        <button
          class="text-sm text-accent hover:underline"
          @click="isSignUp = !isSignUp; error = ''; signUpSuccess = false"
        >
          {{ isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký' }}
        </button>
      </div>
    </div>
  </div>
</template>
