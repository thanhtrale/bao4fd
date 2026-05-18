import type { SupabaseClient } from '@supabase/supabase-js'

export async function incrementView(supabase: SupabaseClient, articleId: string) {
  const { error } = await supabase.rpc('increment_view', { p_article_id: articleId })
  if (error) throw error
}
