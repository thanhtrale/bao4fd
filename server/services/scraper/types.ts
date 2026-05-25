export interface ScrapedArticle {
  title: string
  content: string
  thumbnail: string
  description: string
  slug: string
}

export interface Scraper {
  scrape(url: string): Promise<ScrapedArticle>
}
