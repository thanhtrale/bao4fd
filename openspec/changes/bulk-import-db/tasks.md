## 1. Migration: import_batches table

- [x] 1.1 Create `supabase/migrations/008_import_batches.sql` with import_batches table (id, category_id FK, total_urls, status, invocation_count, created_by FK, created_at, completed_at)

## 2. Migration: import_jobs table

- [x] 2.1 Create `supabase/migrations/009_import_jobs.sql` with import_jobs table (id, batch_id FK CASCADE, url, status, article_id FK, error_message, retry_count, retry_after, created_at, updated_at)
- [x] 2.2 Add indexes: status+retry_after for queue queries, batch_id for dashboard queries
- [x] 2.3 Add updated_at trigger reusing existing `update_updated_at()` function

## 3. Enable Realtime

- [x] 3.1 Create `supabase/migrations/010_import_realtime.sql` to add import_jobs to Supabase Realtime publication
