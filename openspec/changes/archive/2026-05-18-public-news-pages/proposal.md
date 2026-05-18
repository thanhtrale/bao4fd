## Why

The public-facing website is the core user experience. Visitors need to browse news by category, read articles, and discover trending content. These pages must be SSR for SEO and fast initial load.

## What Changes

- Create Home page (`/`): latest articles by category, most viewed today section
- Create Category page (`/category/:slug`): article listing with pagination (desktop) and optional infinite scroll (mobile)
- Create Detail page (`/article/:slug`): full article content with newer/older navigation within same category
- Create REST API endpoints for articles listing, single article, categories listing, most viewed today
- Create shared components: ArticleCard, ArticleList, MostViewed, Pagination

## Capabilities

### New Capabilities
- `home-page`: Home page displaying latest articles grouped by category and most viewed today
- `category-page`: Category listing page with pagination and optional infinite scroll on mobile
- `article-detail-page`: Article detail page with full content and newer/older navigation
- `public-api`: REST API endpoints for public data retrieval with pagination

### Modified Capabilities

## Impact

- New pages: `/`, `/category/:slug`, `/article/:slug`
- New API routes: `GET /api/articles`, `GET /api/articles/:slug`, `GET /api/categories`, `GET /api/articles/most-viewed`
- SSR rendering for all public pages
- Client-side composables: `useArticles`, `useCategories`
