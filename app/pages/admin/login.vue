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

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
        <div class="relative flex justify-center"><span class="bg-white px-3 text-xs text-slate-400">hoặc</span></div>
      </div>

      <button
        class="w-full py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        @click="loginWithGoogle"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Đăng nhập với Google
      </button>
    </div>
  </div>
</template>
