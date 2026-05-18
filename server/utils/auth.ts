import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export interface AuthUser {
  id: string
  email: string
  role: 'admin' | 'editor'
  display_name: string | null
}

export async function requireAuth(event: H3Event): Promise<AuthUser> {
  const config = useRuntimeConfig()
  const authHeader = getRequestHeader(event, 'authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Missing authorization token' })
  }

  const token = authHeader.slice(7)
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey)

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
  }

  // Lookup profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, role, display_name')
    .eq('id', user.id)
    .single()

  // Auto-create profile if missing (fallback for existing users before migration)
  if (!profile) {
    const isAdmin = user.email === 'admin@verticurl.com'
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'

    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email!,
        display_name: displayName,
        role: isAdmin ? 'admin' : 'editor',
      })
      .select('id, email, role, display_name')
      .single()

    if (!newProfile) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to create user profile' })
    }

    event.context.user = newProfile as AuthUser
    return newProfile as AuthUser
  }

  event.context.user = profile as AuthUser
  return profile as AuthUser
}

export async function requireAdmin(event: H3Event): Promise<AuthUser> {
  const user = await requireAuth(event)
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: admin access required' })
  }
  return user
}

export async function requireArticleOwner(event: H3Event, articleAuthorId: string | null): Promise<AuthUser> {
  const user = await requireAuth(event)
  if (user.role === 'admin') return user
  if (!articleAuthorId || articleAuthorId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: you can only modify your own articles' })
  }
  return user
}
