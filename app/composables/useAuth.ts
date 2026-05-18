import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const supabase = useSupabaseClient()
  const user = useState<User | null>('auth-user', () => null)
  const loading = useState('auth-loading', () => false)
  const error = useState<string | null>('auth-error', () => null)

  async function init() {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
  }

  async function loginWithEmail(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        error.value = authError.message
        return false
      }
      user.value = data.user
      return true
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogle() {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    })
    if (authError) {
      error.value = authError.message
    }
  }

  async function signUpWithEmail(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      })
      if (authError) {
        error.value = authError.message
        return false
      }
      return true
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    await navigateTo('/admin/login')
  }

  // Listen for auth state changes
  if (import.meta.client) {
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error,
    init,
    loginWithEmail,
    loginWithGoogle,
    signUpWithEmail,
    logout,
  }
}
