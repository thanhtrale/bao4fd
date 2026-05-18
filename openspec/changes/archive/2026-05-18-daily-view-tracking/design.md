## Context

View tracking needs a simple endpoint called from the article detail page. Uses the `increment_view` RPC function created in database-schema change.

## Goals / Non-Goals

**Goals:**
- API endpoint to increment daily view count
- Client-side integration on article detail page
- Fire-and-forget (don't block page rendering)

**Non-Goals:**
- No bot/crawler detection (MVP)
- No user deduplication (each page load = 1 view)
- No real-time view count display

## Decisions

**Decision 1: Fire-and-forget from client**
- Call `POST /api/articles/:slug/view` on `onMounted()` without awaiting.
- Don't block SSR rendering. View count is a side effect.

**Decision 2: No rate limiting for MVP**
- Each page load counts. Simple, no complexity.
- Alternative: Debounce by IP — rejected for MVP complexity.

## Risks / Trade-offs

- [Inflated view counts from bots/refreshes] → Acceptable for MVP. Can add rate limiting later.
- [View count API failure] → Silent failure. Don't affect user experience.
