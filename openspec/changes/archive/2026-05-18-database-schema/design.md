## Context

Application needs PostgreSQL tables for a news portal. Supabase provides managed PostgreSQL with built-in RPC support and pg_cron.

## Goals / Non-Goals

**Goals:**
- Complete ERD with categories, articles, article_daily_views
- Proper constraints (NOT NULL, FK, UNIQUE)
- Indexes optimized for all query patterns
- Atomic view counting via RPC function

**Non-Goals:**
- No application code (handled by other changes)
- No RLS policies (using service_role key server-side)
- No full-text search (MVP)

## Decisions

**Decision 1: UUID primary keys with `gen_random_uuid()`**
- Rationale: Supabase default, avoids sequential ID enumeration, works well with distributed systems.

**Decision 2: Separate `article_daily_views` table instead of `view_count` column on articles**
- Rationale: Enables "most viewed today" without date filtering on articles table. Clean separation of concerns.
- Alternative: Single `view_count` column — rejected because it can't track daily views.

**Decision 3: UPSERT via RPC for view counting**
- Rationale: Atomic, no race conditions, single round-trip. `ON CONFLICT DO UPDATE` handles concurrent requests.

**Decision 4: `is_published` + `published_at` dual columns**
- Rationale: Supports draft/published workflow. `published_at` enables future scheduling. Only published articles shown on public site.

## Risks / Trade-offs

- [article_daily_views grows over time] → pg_cron cleanup job deletes records > 30 days. Table is very small per day (~1000 rows max).
- [No RLS policies] → Acceptable because all access goes through server API routes with service_role key. Never expose Supabase directly to client.
