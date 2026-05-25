## Context

The bulk import feature needs database tables to track batches of imported URLs and individual job statuses. These tables double as a Postgres-based job queue — no external message broker needed. The existing database has categories, articles, article_daily_views, and profiles tables. Migration files follow the pattern `NNN_name.sql` in `supabase/migrations/`.

## Goals / Non-Goals

**Goals:**
- Create `import_batches` and `import_jobs` tables with proper foreign keys
- Support Supabase Realtime subscriptions on `import_jobs` for live dashboard
- Enable efficient job queue queries (pending jobs with retry-after support)
- Reuse existing `update_updated_at()` trigger function for `import_jobs`

**Non-Goals:**
- No RLS policies (admin-only tables, accessed via service role key)
- No partitioning or archival strategy (MVP scale)

## Decisions

1. **Postgres as job queue** — Use `import_jobs.status` + `retry_after` columns instead of Redis/BullMQ. Workers query with `FOR UPDATE SKIP LOCKED` to prevent race conditions. Alternative: BullMQ+Redis was rejected because it requires a persistent VPS (incompatible with Vercel free tier).

2. **Batch grouping** — `import_batches` groups URLs submitted together. Tracks overall progress and enables per-batch email alerts. The `invocation_count` column provides a safety counter to prevent infinite self-chaining loops.

3. **Retry via `retry_after` column** — Jobs that fail are set back to `pending` with an exponential backoff timestamp. The processing query filters `WHERE retry_after IS NULL OR retry_after <= now()`. Alternative: separate retry table was rejected as unnecessary complexity.

4. **Enable Realtime** — `import_jobs` needs Supabase Realtime enabled (via `ALTER PUBLICATION`) so the admin dashboard receives live status updates.

## Risks / Trade-offs

- [Postgres queue under load] → At MVP scale (max 100 URLs/batch), this is not a concern. If scale grows significantly, migrate to a proper queue.
- [No RLS on import tables] → These tables are only accessed server-side via service role key. If direct client access is ever needed, add RLS policies.
