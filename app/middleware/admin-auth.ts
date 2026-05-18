export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  if (!to.path.startsWith('/admin')) return

  const { user, init } = useAuth()

  if (!user.value) {
    await init()
  }

  if (!user.value) {
    return navigateTo('/admin/login')
  }
})
