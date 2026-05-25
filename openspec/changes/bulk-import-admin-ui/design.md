## Context

The admin panel uses Nuxt SPA mode with Tailwind CSS. Pages follow a consistent pattern: definePageMeta with layout/middleware, data fetching via $fetch to API endpoints, and reactive state management with Vue 3 Composition API. Supabase client is available on the browser for Realtime subscriptions.

## Goals / Non-Goals

**Goals:**
- Provide URL input form with validation feedback
- Show live batch progress using Supabase Realtime
- Match existing admin UI patterns and styling

**Non-Goals:**
- No batch cancellation UI
- No job retry UI (handled automatically by backend)
- No pagination for batch list (limit to 50 most recent)

## Decisions

1. **Supabase Realtime for live updates** — Subscribe to `postgres_changes` on `import_jobs` table filtered by batch_id. Updates the UI as jobs transition through statuses. No polling needed.

2. **Form validation client-side** — Validate URL format, max 100 lines, and non-empty before submitting. Show inline error messages.

3. **Redirect after submit** — After successful 202 response, redirect to `/admin/imports` dashboard where the batch progress is visible.

## Risks / Trade-offs

- [Realtime subscription limit] → Supabase free tier allows up to 200 concurrent connections. With one admin user, this is not a concern.
