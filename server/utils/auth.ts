import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export async function requireAuth(event: H3Event) {
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

  const adminEmails = config.adminEmails
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean)

  if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: not an admin user' })
  }

  return user
}
