## Context

The bulk import pipeline needs to scrape articles from VNExpress. Content must be sanitized to prevent XSS. The scraper is designed as a pluggable module so future sources (Tuổi Trẻ, Dân Trí) can be added. The existing project uses TypeScript throughout.

## Goals / Non-Goals

**Goals:**
- Extract title, content, thumbnail URL, description from VNExpress articles
- Sanitize HTML content (whitelist safe tags, strip scripts/events)
- Handle broken content images by replacing with placeholder
- Generate URL-safe slugs from Vietnamese titles
- Extensible design: one file per source domain

**Non-Goals:**
- No Puppeteer/browser automation (VNExpress is server-rendered, cheerio suffices)
- No image downloading or re-hosting (keep original URLs)
- No pagination or list scraping (only individual article URLs)

## Decisions

1. **cheerio for parsing** — VNExpress serves server-rendered HTML. No JavaScript execution needed. cheerio is lightweight (~1MB) vs Puppeteer (~400MB). Perfect for serverless.

2. **sanitize-html for XSS prevention** — Well-maintained library with configurable tag/attribute whitelists. Strips `<script>`, event handlers, dangerous attributes. Alternative: DOMPurify requires jsdom (~10MB), heavier for serverless.

3. **Scraper factory pattern** — `getScraperForUrl(url)` resolves domain → scraper module. Initially only `vnexpress.ts`. Adding a new source = adding one file + registering in factory.

4. **Slug generation** — Convert Vietnamese characters to ASCII (e.g., "Việt Nam" → "viet-nam"), lowercase, hyphenate. Use a simple regex-based approach instead of adding a `slugify` dependency.

5. **Image handling** — Thumbnail: keep `og:image` URL, if missing use `/images/placeholder.jpg`. Content images: keep original URLs as-is. During scraping, verify image URLs are valid (HEAD request), replace broken ones with placeholder.

## Risks / Trade-offs

- [VNExpress redesign breaks selectors] → Monitor scraping failures. Selectors are isolated in one file, easy to update.
- [Rate limiting by VNExpress] → Process max 5 URLs concurrently, add 1-second delay between requests. Respectful scraping.
- [Content images going stale] → Accepted trade-off. Re-hosting would consume Supabase Storage quota.
