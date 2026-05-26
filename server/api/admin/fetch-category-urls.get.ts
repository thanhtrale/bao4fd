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

const MAX_PAGES = 5
const MAX_LIMIT = 100
const DEFAULT_LIMIT = 10

// ─── Source configs ───

interface SourceConfig {
  name: string
  hostname: string
  homepageUrl: string
  articlePattern: RegExp
  extractCategories: ($: cheerio.CheerioAPI) => CategoryItem[]
  extractArticles: ($: cheerio.CheerioAPI) => ArticleItem[]
  buildPageUrl: (baseUrl: string, page: number) => string
}

const SOURCES: Record<string, SourceConfig> = {
  vnexpress: {
    name: 'VNExpress',
    hostname: 'vnexpress.net',
    homepageUrl: 'https://vnexpress.net',
    articlePattern: /^https?:\/\/(www\.)?vnexpress\.net\/.+-\d+\.html$/,
    extractCategories($) {
      const categories: CategoryItem[] = []
      const seen = new Set<string>()
      const BASE = 'https://vnexpress.net'
      const SKIP = /^(javascript:|#|\/tin-tuc-24h|\/vne-go|\/$|\/?)$/
      const SKIP_SECTIONS = /\/(video|anh|podcast|infographics|interactive|multimedia)\/?$/

      $('nav a[href]').each((_, el) => {
        const href = $(el).attr('href')?.trim()
        const text = $(el).text().trim()
        if (!href || !text) return
        if (SKIP.test(href) || SKIP_SECTIONS.test(href)) return
        if (!/^\/[a-z-]+\/?$/.test(href) && !/^https?:\/\/(www\.)?vnexpress\.net\/[a-z-]+\/?$/.test(href)) return
        const fullUrl = href.startsWith('http') ? href : `${BASE}${href}`
        if (seen.has(fullUrl)) return
        seen.add(fullUrl)
        categories.push({ name: text, url: fullUrl })
      })
      return categories
    },
    extractArticles($) {
      const articles: ArticleItem[] = []
      const seen = new Set<string>()
      const pattern = /^https?:\/\/(www\.)?vnexpress\.net\/.+-\d+\.html$/

      const categoryName = $('h1.title-heading').first().text().trim()
        || $('h2.title-heading').first().text().trim()
        || $('.breadcrumb li:last-child a').text().trim()
        || ''

      $('article a.title-news[href], .item-news a.title-news[href], .title-news[href]').each((_, el) => {
        const href = $(el).attr('href')?.trim()
        const title = $(el).attr('title')?.trim() || $(el).text().trim()
        if (!href || !title) return
        if (!pattern.test(href)) return
        if (href.includes('/video/') || href.includes('/anh/')) return
        if (seen.has(href)) return
        seen.add(href)
        articles.push({ url: href, title, categoryName })
      })

      if (articles.length === 0) {
        $('a[href]').each((_, el) => {
          const href = $(el).attr('href')?.trim()
          const title = $(el).attr('title')?.trim() || $(el).text().trim()
          if (!href || !title || title.length < 10) return
          if (!pattern.test(href)) return
          if (href.includes('/video/') || href.includes('/anh/')) return
          if (seen.has(href)) return
          seen.add(href)
          articles.push({ url: href, title, categoryName })
        })
      }
      return articles
    },
    buildPageUrl(baseUrl, page) {
      if (page <= 1) return baseUrl
      const clean = baseUrl.replace(/\/$/, '').replace(/-p\d+$/, '')
      return `${clean}-p${page}`
    },
  },

  tuoitre: {
    name: 'Tuổi Trẻ',
    hostname: 'tuoitre.vn',
    homepageUrl: 'https://tuoitre.vn',
    articlePattern: /^https?:\/\/(www\.)?tuoitre\.vn\/.+-\d{14,}\.htm$/,
    extractCategories($) {
      const categories: CategoryItem[] = []
      const seen = new Set<string>()
      const BASE = 'https://tuoitre.vn'
      const SKIP_NAMES = new Set(['Cần biết', 'Dành cho bạn', 'Mới nhất', 'Xem nhiều', 'Video', 'Ảnh', 'Infographic', 'Thời tiết', 'Sao nhiều'])

      $('a[href]').each((_, el) => {
        const href = $(el).attr('href')?.trim()
        const text = $(el).text().trim()
        if (!href || !text || text.length > 30 || text.length < 2) return
        if (SKIP_NAMES.has(text)) return

        const match = href.match(/^(https?:\/\/tuoitre\.vn)?\/([a-z0-9-]+)\.htm$/)
        if (!match) return
        // Skip article URLs (have long numeric ID)
        if (/\d{14,}\.htm$/.test(href)) return

        const fullUrl = href.startsWith('http') ? href : `${BASE}${href}`
        if (seen.has(fullUrl)) return
        seen.add(fullUrl)
        categories.push({ name: text, url: fullUrl })
      })
      return categories
    },
    extractArticles($) {
      const articles: ArticleItem[] = []
      const seen = new Set<string>()
      const pattern = /^https?:\/\/(www\.)?tuoitre\.vn\/.+-\d{14,}\.htm$/
      const BASE = 'https://tuoitre.vn'

      const categoryName = $('h1').first().text().trim()
        || $('title').text().replace(/ - Tuổi Trẻ Online$/, '').trim()
        || ''

      $('a[href]').each((_, el) => {
        const href = $(el).attr('href')?.trim()
        const title = $(el).attr('title')?.trim() || $(el).text().trim()
        if (!href || !title || title.length < 10) return
        const fullUrl = href.startsWith('/') ? `${BASE}${href}` : href
        if (!pattern.test(fullUrl)) return
        if (seen.has(fullUrl)) return
        seen.add(fullUrl)
        articles.push({ url: fullUrl, title, categoryName })
      })
      return articles
    },
    buildPageUrl(baseUrl, page) {
      if (page <= 1) return baseUrl
      // Tuổi Trẻ: /thoi-su.htm → /thoi-su-trang-2.htm
      const clean = baseUrl.replace(/-trang-\d+\.htm$/, '.htm')
      return clean.replace(/\.htm$/, `-trang-${page}.htm`)
    },
  },
}

// ─── Shared helpers ───

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

// ─── Handler ───

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const source = (query.source as string) || ''
  const categoryUrl = query.url as string
  const limit = Math.min(Math.max(Number(query.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT)

  const sourceConfig = SOURCES[source]
  if (!sourceConfig) {
    throw createError({ statusCode: 400, statusMessage: `Unsupported source: ${source}. Use: ${Object.keys(SOURCES).join(', ')}` })
  }

  // If no URL, return categories from homepage
  if (!categoryUrl) {
    const html = await fetchPage(sourceConfig.homepageUrl)
    const $ = cheerio.load(html)
    const categories = sourceConfig.extractCategories($)
    return { type: 'categories' as const, categories }
  }

  // Validate URL
  let parsed: URL
  try {
    parsed = new URL(categoryUrl)
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid URL' })
  }

  const hostname = parsed.hostname.replace(/^www\./, '')
  if (hostname !== sourceConfig.hostname) {
    throw createError({ statusCode: 400, statusMessage: `URL must be from ${sourceConfig.hostname}` })
  }

  // Category page → fetch articles with pagination
  const allArticles: ArticleItem[] = []
  const seenUrls = new Set<string>()

  for (let page = 1; page <= MAX_PAGES; page++) {
    if (allArticles.length >= limit) break

    const pageUrl = sourceConfig.buildPageUrl(categoryUrl, page)
    const html = await fetchPage(pageUrl)
    const $ = cheerio.load(html)
    const pageArticles = sourceConfig.extractArticles($)

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
