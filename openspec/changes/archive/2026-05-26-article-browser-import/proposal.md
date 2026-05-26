## Why

The current bulk import flow requires users to manually paste individual article URLs. This is tedious when importing many articles from the same VNExpress category. Users need an article browser that can fetch article listings from category pages, let them preview and select articles, and import selected ones — all from a single UI.

## What Changes

- Replace the simple URL textarea with an interactive article browser on the import page
- Add server-side scraping of VNExpress category/homepage listings to extract article titles, URLs, and source categories
- Support homepage URL detection: show available VNExpress categories for user to select before fetching
- Support multi-page fetching with configurable article limit (default 10)
- Add check/uncheck all + individual article selection via checkboxes
- Show article source category name alongside each fetched article
- Keep backward compatibility: users can still manually type/paste URLs in the textarea

## Capabilities

### New Capabilities
- `article-browser`: Interactive article browser UI that fetches, displays, and allows selection of articles from VNExpress category/homepage URLs with configurable limits and checkbox selection

### Modified Capabilities
- `import-form`: Update the import form page to integrate the article browser, replacing the simple category-URL fetch with the full browser experience

## Impact

- **Server**: Modify `server/api/admin/fetch-category-urls.get.ts` — return article titles + source category names, support `limit` param, multi-page fetching, homepage category detection
- **UI**: Major rework of `app/pages/admin/imports/new.vue` — new article browser section with fetch, preview list, checkboxes, category selection for homepage
- **Dependencies**: No new packages needed (cheerio already available)
