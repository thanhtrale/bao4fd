## Context

The bulk import system currently has a simple textarea where users paste article URLs manually, plus a basic "fetch from category URL" feature that returns raw URLs without titles. The new article browser replaces this with an interactive listing where users can browse, preview, and select articles from VNExpress before importing.

## Goals / Non-Goals

**Goals:**
- Fetch article listings from VNExpress category pages with titles and source category names
- Detect homepage URL and present category selection before fetching
- Support configurable article limit with automatic multi-page fetching
- Provide checkbox selection (individual + select all) for choosing which articles to import
- Maintain the manual URL textarea as fallback

**Non-Goals:**
- Date filtering (VNExpress doesn't support server-side date params)
- Thumbnail/excerpt preview in the article list (too much data for many articles)
- Supporting sources other than VNExpress

## Decisions

### 1. Single API endpoint with dual response type

The `GET /api/admin/fetch-category-urls` endpoint detects whether the URL is a homepage or category page and returns different response shapes:
- Homepage → `{ type: "categories", categories: [...] }`
- Category → `{ type: "articles", articles: [...] }`

**Why**: Simpler than two endpoints. The client just checks `type` to decide what to render.

### 2. Server-side multi-page fetching

When `limit` exceeds articles on page 1, the server fetches subsequent pages (`-p2`, `-p3`) until the limit is reached or no more articles exist. Max 5 pages to prevent abuse.

**Why**: Client doesn't need to manage pagination. Single request, single response.

### 3. Extract title + category from listing HTML

Each article `<a>` in the category page is parsed with cheerio. The category name is derived from the page's `<h1>` or breadcrumb. Article titles come from the link text within article containers.

**Why**: Avoids fetching individual article pages just for preview. Fast and lightweight.

### 4. Two-phase UI: Browse → Import

The import page has two distinct phases:
1. **Browse**: Enter URL → fetch articles → select via checkboxes
2. **Import**: Selected articles populate the existing URL list → choose target category → submit

**Why**: Clean separation. The import submission logic (batch creation, processing chain) stays unchanged.

## Risks / Trade-offs

- **[HTML structure changes]** → VNExpress may change their HTML. Mitigation: selectors are simple (`a[href]` with URL pattern matching), resilient to layout changes.
- **[Rate limiting]** → Fetching multiple pages rapidly. Mitigation: cap at 5 pages max, add small delay between fetches.
- **[Large response]** → 100+ articles returned. Mitigation: default limit is 10, max 100.
