import type { Scraper } from './types'
import { vnexpressScraper } from './vnexpress'
import { tuoitreScraper } from './tuoitre'

const scraperMap: Record<string, Scraper> = {
  'vnexpress.net': vnexpressScraper,
  'tuoitre.vn': tuoitreScraper,
}

export function getScraperForUrl(url: string): Scraper {
  const hostname = new URL(url).hostname.replace(/^www\./, '')
  const scraper = scraperMap[hostname]
  if (!scraper) {
    throw new Error(`Unsupported domain: ${hostname}`)
  }
  return scraper
}

export type { ScrapedArticle, Scraper } from './types'
