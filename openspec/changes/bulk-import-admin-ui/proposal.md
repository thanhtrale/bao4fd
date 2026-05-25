## Why

The admin needs a UI to submit bulk URLs for import and monitor their processing progress in real-time. This is the frontend interface for the bulk import pipeline.

## What Changes

- Add "Import" navigation link to admin layout header
- Add bulk import form page at `/admin/imports/new` (textarea + category dropdown)
- Add import dashboard page at `/admin/imports` (batch list with real-time progress)
- Add import dashboard card on admin index page

## Capabilities

### New Capabilities
- `import-form`: Admin page with textarea for pasting URLs and category selector
- `import-dashboard`: Admin page showing batch progress with real-time updates via Supabase Realtime

### Modified Capabilities

## Impact

- New pages: `app/pages/admin/imports/index.vue`, `app/pages/admin/imports/new.vue`
- Modified: `app/layouts/admin.vue` (add Import nav link), `app/pages/admin/index.vue` (add dashboard card)
