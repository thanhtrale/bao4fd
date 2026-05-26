import * as cheerio from 'cheerio'

interface ArticleItem {
  url: string
  title: string
  categoryName: string
}

interface CategoryItem {
  name: string
  url: string
}

const ARTICLE_PATTERN = /^https?:\/\/(www\.)?vnexpress\.net\/.+-\d+\.html$/
const MAX_PAGES = 5
const MAX_LIMIT = 100
const DEFAULT_LIMIT = 10

function isHomepageUrl(parsed: URL): boolean {
  const path = parsed.pathname.replace(/\/+$/, '')
  return path === '' || path === '/'
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
    },
  })
  if (!response.ok) {
    throw createError({ statusCode: 502, statusMessage: `Failed to fetch: HTTP ${response.status}` })
  }
  return response.text()
}

function extractCategoriesFromHomepage($: cheerio.CheerioAPI): CategoryItem[] {
  const categories: CategoryItem[] = []
  const seen = new Set<string>()
  const BASE = 'https://vnexpress.net'
  const SKIP = /^(javascript:|#|\/tin-tuc-24h|\/vne-go|\/$|\/?)$/
  const SKIP_SECTIONS = /\/(video|anh|podcast|infographics|interactive|multimedia)\/?$/

  // VNExpress main nav links — hrefs are relative like /thoi-su
  $('nav a[href]').each((_, el) => {
    let href = $(el).attr('href')?.trim()
    const text = $(el).text().trim()
    if (!href || !text) return
    if (SKIP.test(href) || SKIP_SECTIONS.test(href)) return
    // Only top-level category paths: /slug-name (no nested paths)
    if (!/^\/[a-z-]+\/?$/.test(href) && !/^https?:\/\/(www\.)?vnexpress\.net\/[a-z-]+\/?$/.test(href)) return
    // Resolve to full URL
    const fullUrl = href.startsWith('http') ? href : `${BASE}${href}`
    if (seen.has(fullUrl)) return
    seen.add(fullUrl)
    categories.push({ name: text, url: fullUrl })
  })

  return categories
}

function extractArticlesFromPage($: cheerio.CheerioAPI): ArticleItem[] {
  const articles: ArticleItem[] = []
  const seen = new Set<string>()

  // Extract category name from page heading or breadcrumb
  const categoryName = $('h1.title-heading').first().text().trim()
    || $('h2.title-heading').first().text().trim()
    || $('.breadcrumb li:last-child a').text().trim()
    || $('.breadcrumb li:last-child').text().trim()
    || ''

  // Find article links with titles from article containers
  $('article a.title-news[href], .item-news a.title-news[href], .title-news[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim()
    const title = $(el).attr('title')?.trim() || $(el).text().trim()
    if (!href || !title) return
    if (!ARTICLE_PATTERN.test(href)) return
    if (href.includes('/video/') || href.includes('/anh/')) return
    if (seen.has(href)) return
    seen.add(href)
    articles.push({ url: href, title, categoryName })
  })

  // Fallback: if no .title-news found, scan all links
  if (articles.length === 0) {
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')?.trim()
      const title = $(el).attr('title')?.trim() || $(el).text().trim()
      if (!href || !title || title.length < 10) return
      if (!ARTICLE_PATTERN.test(href)) return
      if (href.includes('/video/') || href.includes('/anh/')) return
      if (seen.has(href)) return
      seen.add(href)
      articles.push({ url: href, title, categoryName })
    })
  }

  return articles
}

function buildPageUrl(baseUrl: string, page: number): string {
  if (page <= 1) return baseUrl
  // VNExpress pagination: /thoi-su → /thoi-su-p2
  const clean = baseUrl.replace(/\/$/, '').replace(/-p\d+$/, '')
  return `${clean}-p${page}`
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const categoryUrl = query.url as string
  const limit = Math.min(Math.max(Number(query.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT)

  if (!categoryUrl) {
    throw createError({ statusCode: 400, statusMessage: 'url is required' })
  }

  let parsed: URL
  try {
    parsed = new URL(categoryUrl)
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid URL' })
  }

  const hostname = parsed.hostname.replace(/^www\./, '')
  if (hostname !== 'vnexpress.net') {
    throw createError({ statusCode: 400, statusMessage: 'Only vnexpress.net is supported' })
  }

  // Homepage → return categories
  if (isHomepageUrl(parsed)) {
    const html = await fetchPage(categoryUrl)
    const $ = cheerio.load(html)
    const categories = extractCategoriesFromHomepage($)
    return { type: 'categories' as const, categories }
  }

  // Category page → fetch articles with pagination
  const allArticles: ArticleItem[] = []
  const seenUrls = new Set<string>()

  for (let page = 1; page <= MAX_PAGES; page++) {
    if (allArticles.length >= limit) break

    const pageUrl = buildPageUrl(categoryUrl, page)
    const html = await fetchPage(pageUrl)
    const $ = cheerio.load(html)
    const pageArticles = extractArticlesFromPage($)

    if (pageArticles.length === 0) break

    for (const article of pageArticles) {
      if (seenUrls.has(article.url)) continue
      seenUrls.add(article.url)
      allArticles.push(article)
      if (allArticles.length >= limit) break
    }
  }

  return { type: 'articles' as const, articles: allArticles }
})
