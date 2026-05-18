import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function useSupabaseAdmin(): SupabaseClient {
  if (client) return client

  const config = useRuntimeConfig()
  const url = config.supabaseUrl
  const key = config.supabaseServiceRoleKey

  if (!url) throw new Error('Missing SUPABASE_URL environment variable')
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')

  client = createClient(url, key)
  return client
}
