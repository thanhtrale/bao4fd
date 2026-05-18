## Why

We need a foundational NuxtJS 3 project configured for deployment on Vercel with Supabase integration. Without this foundation, no feature development can begin. This sets up the project skeleton, build tooling, and environment configuration.

## What Changes

- Initialize NuxtJS 3 project with TypeScript
- Configure Vercel deployment preset
- Set up Supabase client utility (server-side with service_role key via pooler)
- Create layered folder structure: `server/api/`, `server/services/`, `server/utils/`
- Configure route rules: SSR for public pages, SPA for `/admin/**`
- Set up environment variable placeholders for all third-party services
- Add base layouts (default for public, admin for backoffice)

## Capabilities

### New Capabilities
- `nuxt-project-setup`: NuxtJS 3 project initialization with TypeScript, Vercel preset, and folder structure
- `supabase-client`: Server-side Supabase client configuration using service_role key through connection pooler

### Modified Capabilities

## Impact

- New project structure created from scratch
- Dependencies: nuxt, @nuxtjs/supabase or @supabase/supabase-js, typescript
- Environment vars: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- Vercel deployment configuration
