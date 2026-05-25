## Why

The bulk import system needs API endpoints to accept URL submissions and process them in the background. The processing must run server-side using the self-chaining `waitUntil` pattern so it continues even when the admin closes their browser.

## What Changes

- Add `POST /api/admin/bulk-import` endpoint for URL submission (validates, deduplicates, creates batch/jobs, returns 202, triggers chain)
- Add `POST /api/admin/process-imports` endpoint for background processing (scrapes URLs, saves articles, self-chains for remaining jobs)
- Add `GET /api/admin/import-batches` endpoint for listing batches (dashboard data)
- Add import service in `server/services/import.service.ts` for business logic
- Add `INTERNAL_API_KEY` environment variable for secure server-to-server chain calls

## Capabilities

### New Capabilities
- `bulk-import-endpoint`: API endpoint that validates URLs, checks duplicates, creates batch records, and triggers async processing
- `import-processing`: Self-chaining background processor that scrapes URLs, saves articles, handles retries with exponential backoff

### Modified Capabilities

## Impact

- New files in `server/api/admin/` and `server/services/`
- New runtime config: `INTERNAL_API_KEY`
- Depends on: import DB tables (bulk-import-db), scraper service (vnexpress-scraper)
