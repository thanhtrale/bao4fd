## Why

The bulk import system needs a scraper service to extract article content from VNExpress URLs. This is the core content extraction engine that fetches HTML, parses it with CSS selectors, sanitizes the output against XSS, and produces article data ready for database insertion.

## What Changes

- Add `cheerio` and `sanitize-html` npm dependencies
- Create VNExpress scraper module with domain-specific CSS selectors
- Create HTML sanitization utility with safe tag whitelist
- Create scraper factory that resolves the correct scraper by URL domain
- Generate URL-safe slugs from Vietnamese article titles

## Capabilities

### New Capabilities
- `content-scraping`: Scraper service that fetches URLs, extracts structured content (title, body, thumbnail, description), sanitizes HTML, and generates slugs

### Modified Capabilities

## Impact

- New files in `server/services/scraper/` and `server/utils/`
- New npm dependencies: `cheerio`, `sanitize-html`
- No changes to existing code
