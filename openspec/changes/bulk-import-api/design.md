## Context

The bulk import API sits in the transport layer of the existing Nuxt server architecture. It uses the scraper service (vnexpress-scraper) and writes to the import tables (bulk-import-db). Processing runs server-side via Vercel's `waitUntil` API — each invocation processes a batch of jobs then triggers the next, creating a chain that runs independently of the client.

## Goals / Non-Goals

**Goals:**
- Accept bulk URL submissions with validation and dedup
- Process URLs asynchronously via self-chaining pattern
- Handle retries with exponential backoff (3 retries, 10s/20s/40s)
- Provide batch listing endpoint for dashboard

**Non-Goals:**
- No WebSocket or SSE (use Supabase Realtime on client side)
- No concurrent batch processing (one chain per batch)
- No batch cancellation API (out of scope for MVP)

## Decisions

1. **Self-chaining via `waitUntil`** — After returning 202, `event.waitUntil()` triggers a fetch to the same processing endpoint. Each invocation processes 5 jobs and chains to the next. This runs entirely server-side on Vercel without needing a persistent worker.

2. **Internal API key auth** — The processing endpoint accepts either admin Bearer auth OR an `x-internal-key` header matching `INTERNAL_API_KEY` env var. This allows server-to-server chain calls without passing user tokens.

3. **FOR UPDATE SKIP LOCKED** — Use Postgres advisory locking to prevent race conditions if multiple chains somehow run concurrently. Jobs are selected with `FOR UPDATE SKIP LOCKED` to ensure exclusive processing.

4. **Dedup by URL and title** — Before creating jobs, check if the URL already exists in `import_jobs` or if an article with the same URL exists. Title dedup happens after scraping (before insert).

5. **Batch size: 5 jobs per invocation** — Conservative to stay well within Vercel's 60s timeout. Each scrape takes 2-5 seconds, so 5 jobs ≈ 10-25 seconds.

## Risks / Trade-offs

- [waitUntil chain breaks] → If a chain invocation fails, remaining jobs stay in `pending`. Dashboard shows them; admin can trigger reprocessing. Stale batch detection stops chains after 30 minutes.
- [Duplicate chain invocations] → `FOR UPDATE SKIP LOCKED` prevents double-processing. `invocation_count` safety limit prevents infinite loops.
