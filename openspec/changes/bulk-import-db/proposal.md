## Why

The bulk import feature requires two new database tables to track import batches and individual job statuses. These tables serve as a Postgres-based job queue (no Redis needed) and enable real-time progress tracking via Supabase Realtime.

## What Changes

- Add `import_batches` table to group URLs submitted together with a target category
- Add `import_jobs` table to track individual URL processing status (pending → processing → published/failed)
- Add `updated_at` trigger for `import_jobs` (reuse existing trigger function)
- Add indexes for efficient job queue queries (status + retry_after)

## Capabilities

### New Capabilities
- `import-tables`: Database schema for import_batches and import_jobs tables, including indexes and triggers

### Modified Capabilities

## Impact

- New migration files in `supabase/migrations/`
- No changes to existing tables or APIs
- Tables designed to work with Supabase Realtime for live dashboard updates
