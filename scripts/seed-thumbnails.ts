import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CONCURRENCY = 5
const MAX_RETRIES = 3
const IMAGE_WIDTH = 800
const IMAGE_HEIGHT = 450

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<ArrayBuffer> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { redirect: 'follow' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.arrayBuffer()
    } catch (e: any) {
      if (i === retries - 1) throw e
      console.log(`  Retry ${i + 1}/${retries} for ${url}: ${e.message}`)
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw new Error('Unreachable')
}

async function processArticle(article: { id: string; slug: string; category_slug: string }, index: number) {
  const seed = `${article.category_slug}-${index}`
  const picUrl = `https://picsum.photos/seed/${seed}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`

  try {
    // Download image
    const imageData = await fetchWithRetry(picUrl)
    const buffer = Buffer.from(imageData)

    // Upload to Supabase Storage
    const path = `articles/${article.slug}.jpg`
    const { error: uploadError } = await supabase.storage
      .from('thumbnails')
      .upload(path, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (uploadError) {
      console.error(`  ✗ Upload failed for ${article.slug}: ${uploadError.message}`)
      return false
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(path)

    // Update article
    const { error: updateError } = await supabase
      .from('articles')
      .update({ thumbnail: publicUrl })
      .eq('id', article.id)

    if (updateError) {
      console.error(`  ✗ DB update failed for ${article.slug}: ${updateError.message}`)
      return false
    }

    console.log(`  ✓ ${article.slug}`)
    return true
  } catch (e: any) {
    console.error(`  ✗ Failed ${article.slug}: ${e.message}`)
    return false
  }
}

async function processBatch(batch: Array<{ id: string; slug: string; category_slug: string }>, startIndex: number) {
  return Promise.all(batch.map((article, i) => processArticle(article, startIndex + i)))
}

async function main() {
  console.log('Fetching articles without thumbnails...')

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, slug, categories!inner(slug)')
    .is('thumbnail', null)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch articles:', error.message)
    process.exit(1)
  }

  if (!articles || articles.length === 0) {
    console.log('All articles already have thumbnails!')
    return
  }

  console.log(`Found ${articles.length} articles without thumbnails. Processing in batches of ${CONCURRENCY}...`)

  const mapped = articles.map((a: any) => ({
    id: a.id,
    slug: a.slug,
    category_slug: a.categories.slug,
  }))

  let success = 0
  let failed = 0

  for (let i = 0; i < mapped.length; i += CONCURRENCY) {
    const batch = mapped.slice(i, i + CONCURRENCY)
    const batchNum = Math.floor(i / CONCURRENCY) + 1
    const totalBatches = Math.ceil(mapped.length / CONCURRENCY)
    console.log(`\nBatch ${batchNum}/${totalBatches}:`)

    const results = await processBatch(batch, i)
    success += results.filter(Boolean).length
    failed += results.filter(r => !r).length
  }

  console.log(`\n✅ Done! ${success} uploaded, ${failed} failed out of ${articles.length} total.`)
}

main()
