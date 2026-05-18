## Context

Public website serving news content. Must be SSR for SEO. Pagination for desktop, optional infinite scroll for mobile. All data fetched through Nuxt API routes → Supabase.

## Goals / Non-Goals

**Goals:**
- Home page with latest articles per category + most viewed today
- Category page with paginated article list
- Article detail page with newer/older navigation (same category)
- REST API endpoints with consistent pagination response
- Shared components for article display

**Non-Goals:**
- No search functionality (MVP)
- No comments system
- No social sharing
- No article content rich-text editor (admin side handles this)

## Decisions

**Decision 1: Offset-based pagination with consistent meta format**
- API returns `{ data, meta: { page, limit, total, totalPages, hasMore } }`
- Same API serves both desktop (page links) and mobile (infinite scroll)

**Decision 2: Newer/Older = same category, ordered by published_at**
- Standard news pattern. Two queries run in parallel, returned with article detail.

**Decision 3: IntersectionObserver for mobile infinite scroll**
- Detect mobile via viewport width. Show "Load more" button as fallback.
- Cap at 50 pages (1000 items) to prevent memory issues.

**Decision 4: Most Viewed Today as separate API endpoint**
- `GET /api/articles/most-viewed` — top 5 from article_daily_views where view_date = today
- Falls back to empty array if no views today

## Risks / Trade-offs

- [No views today = empty most viewed section] → Show "Popular" section with fallback to latest articles if no daily views
- [Infinite scroll SEO] → Not needed, initial page is SSR with first page of results
