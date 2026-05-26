import * as cheerio from 'cheerio'
import { sanitizeContent } from '../../utils/sanitize'
import { slugify } from '../../utils/slugify'
import type { Scraper, ScrapedArticle } from './types'

const PLACEHOLDER_IMAGE = '/images/placeholder.svg'

const SELECTORS = {
  title: 'h1',
  content: '.detail-content',
  thumbnail: 'meta[property="og:image"]',
  description: 'meta[property="og:description"]',
}

async function checkImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })
    return response.ok
  }
  catch {
    return false
  }
}

async function replaceDeadImages($: cheerio.CheerioAPI): Promise<void> {
  const images = $(SELECTORS.content).first().find('img')
  const checks = images.toArray().map(async (el) => {
    const $el = $(el)
    const src = $el.attr('data-original') || $el.attr('src')
    if (src && src.startsWith('http')) {
      // Replace data-original with src for display
      if ($el.attr('data-original')) {
        $el.attr('src', $el.attr('data-original')!)
        $el.removeAttr('data-original')
      }
      const isValid = await checkImageUrl(src)
      if (!isValid) {
        $el.attr('src', PLACEHOLDER_IMAGE)
        $el.attr('alt', 'Image not available')
      }
    }
  })
  await Promise.all(checks)
}

export const tuoitreScraper: Scraper = {
  async scrape(url: string): Promise<ScrapedArticle> {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const title = $(SELECTORS.title).first().text().trim()
    if (!title) {
      throw new Error('Selector mismatch: title not found')
    }

    const contentEl = $(SELECTORS.content).first()
    if (!contentEl.length) {
      throw new Error('Selector mismatch: content not found')
    }

    await replaceDeadImages($)

    const rawContent = contentEl.html() || ''
    const content = sanitizeContent(rawContent)

    const thumbnail = $(SELECTORS.thumbnail).attr('content') || PLACEHOLDER_IMAGE
    const description = $(SELECTORS.description).attr('content') || ''
    const slug = slugify(title)

    return { title, content, thumbnail, description, slug }
  },
}
