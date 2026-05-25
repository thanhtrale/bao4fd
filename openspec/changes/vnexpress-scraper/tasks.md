## 1. Dependencies

- [x] 1.1 Install `cheerio` and `sanitize-html` npm packages and their type definitions

## 2. Utilities

- [x] 2.1 Create `server/utils/sanitize.ts` with HTML sanitization function (safe tag whitelist, strip scripts/events/data URIs)
- [x] 2.2 Create `server/utils/slugify.ts` with Vietnamese-aware slug generation function

## 3. Scraper Service

- [x] 3.1 Create `server/services/scraper/types.ts` with `ScrapedArticle` interface and `Scraper` interface
- [x] 3.2 Create `server/services/scraper/vnexpress.ts` with VNExpress-specific selectors and extraction logic
- [x] 3.3 Create `server/services/scraper/index.ts` with factory function `getScraperForUrl(url)`

## 4. Placeholder Image

- [x] 4.1 Add placeholder image at `public/images/placeholder.svg`
