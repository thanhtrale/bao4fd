import type { SupabaseClient } from '@supabase/supabase-js'

export async function getCategories(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getCategoryBySlug(supabase: SupabaseClient, slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}
