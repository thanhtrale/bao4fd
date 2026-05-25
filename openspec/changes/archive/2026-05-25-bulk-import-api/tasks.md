## 1. Configuration

- [x] 1.1 Add `INTERNAL_API_KEY` to nuxt.config.ts runtimeConfig

## 2. Import Service

- [x] 2.1 Create `server/services/import.service.ts` with `createBatch()`, `getJobsToProcess()`, `updateJobStatus()`, `finalizeBatch()`, and `getBatchesWithCounts()` functions

## 3. Bulk Import Endpoint

- [x] 3.1 Create `server/api/admin/bulk-import.post.ts` — validate URLs, dedup check, create batch + jobs, return 202, trigger chain via waitUntil

## 4. Process Imports Endpoint

- [x] 4.1 Create `server/api/admin/process-imports.post.ts` — auth (admin or internal key), process 5 jobs, scrape + save articles, handle retries, self-chain via waitUntil

## 5. Batch List Endpoint

- [x] 5.1 Create `server/api/admin/import-batches.get.ts` — return batches with job status counts
