## Why

The backoffice admin panel requires authentication. Only authorized users (admin email allowlist) should access CRUD operations. The system uses Supabase Auth with email/password and Google OAuth support.

## What Changes

- Set up Supabase Auth client (browser-side for login flow)
- Create login page at `/admin/login` with email/password form and Google OAuth button
- Create server middleware to verify Supabase JWT and check admin email allowlist
- Add `useAuth` composable for client-side auth state management
- Configure `ADMIN_EMAILS` env var for allowlist

## Capabilities

### New Capabilities
- `admin-auth`: Authentication flow for backoffice using Supabase Auth with admin email allowlist
- `auth-middleware`: Server-side JWT verification middleware for protected API routes

### Modified Capabilities

## Impact

- New `/admin/login` page
- Server middleware on all `/api/*` routes that require auth
- Dependencies: Supabase Auth (browser SDK)
- Env vars: `ADMIN_EMAILS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
