## 1. Server API - Fetch Category URLs Upgrade

- [x] 1.1 Add homepage detection: if URL is vnexpress.net root, scrape nav links and return `{ type: "categories", categories: [{ name, url }] }`
- [x] 1.2 Add article title extraction from category listing page HTML using cheerio
- [x] 1.3 Add source category name extraction from page heading/breadcrumb
- [x] 1.4 Add multi-page fetching with `-p{n}` suffix, capped at 5 pages
- [x] 1.5 Add `limit` query param (default 10, max 100) to control article count
- [x] 1.6 Return `{ type: "articles", articles: [{ url, title, categoryName }] }` response shape

## 2. Import Form UI - Article Browser

- [x] 2.1 Add article browser section with URL input and "Fetch" button
- [x] 2.2 Add limit input field (default 10)
- [x] 2.3 Add category multi-select UI (shown when homepage URL returns categories)
- [x] 2.4 Add article list display with checkboxes, titles, and category badges
- [x] 2.5 Add select all / deselect all toggle
- [x] 2.6 Add "Add to Import" button that appends selected URLs to the textarea
- [x] 2.7 Add loading state and error handling for fetch operations
