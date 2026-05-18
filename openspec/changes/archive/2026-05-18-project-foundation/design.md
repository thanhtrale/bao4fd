## Context

Starting from an empty workspace. We need a NuxtJS 3 project configured for Vercel serverless deployment with Supabase as the backend. This is the foundation all other features build upon.

## Goals / Non-Goals

**Goals:**
- Working NuxtJS 3 project with TypeScript
- Vercel-compatible deployment configuration
- Server-side Supabase client ready for use by other features
- Layered folder structure (api / services / utils)
- Route rules: SSR public, SPA admin
- Base layouts for public and admin sections
- Environment variable placeholders for all third-party services

**Non-Goals:**
- No actual pages or components (handled by other changes)
- No database schema or migrations
- No authentication logic
- No business logic

## Decisions

**Decision 1: Use `@supabase/supabase-js` directly instead of `@nuxtjs/supabase` module**
- Rationale: Direct SDK gives full control over server-side client creation with service_role key. The Nuxt module abstracts too much and can conflict with custom auth flows.
- Alternative: `@nuxtjs/supabase` — rejected because it's opinionated about auth flow and we need custom admin allowlist logic.

**Decision 2: Single server-side Supabase client via `server/utils/supabase.ts`**
- Rationale: All API routes use the same service_role client. Nuxt auto-imports from `server/utils/`.
- Client uses `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` env vars.

**Decision 3: Vercel preset in nuxt.config.ts**
- Rationale: `nitro: { preset: 'vercel-edge' }` — actually use `'vercel'` (Node.js runtime) for full Node API compatibility. Edge runtime has limitations with some npm packages.

## Risks / Trade-offs

- [Cold start latency on Vercel serverless] → Acceptable for MVP, Nuxt SSR routes are lightweight
- [Supabase connection pooler required for serverless] → Use Supabase Supavisor pooler URL (transaction mode)
- [10s Vercel timeout on free plan] → Keep queries simple, add indexes in database-schema change
