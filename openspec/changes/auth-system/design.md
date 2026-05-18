## Context

Backoffice needs authentication. Using Supabase Auth for simplicity — supports email/password and Google OAuth out of the box. Admin access restricted via email allowlist in env var.

## Goals / Non-Goals

**Goals:**
- Login page with email/password and Google OAuth
- Server middleware verifying Supabase JWT on protected routes
- Admin email allowlist check
- Client-side auth composable for state management
- Logout functionality

**Non-Goals:**
- No user registration (admin accounts pre-created in Supabase dashboard)
- No role-based access control (single admin role)
- No password reset flow (use Supabase dashboard)

## Decisions

**Decision 1: Supabase Auth browser SDK for login flow**
- Rationale: Handles OAuth redirect, token refresh, session management automatically.
- Alternative: Custom JWT — rejected, Supabase Auth is free and handles all edge cases.

**Decision 2: Admin email allowlist via `ADMIN_EMAILS` env var**
- Rationale: Simple, no DB table needed. Server middleware checks JWT email against comma-separated list.
- Format: `ADMIN_EMAILS=admin@example.com,user2@gmail.com`

**Decision 3: Server middleware only on write endpoints**
- Rationale: Public GET endpoints don't need auth. Only POST/PUT/DELETE on admin resources need protection.

**Decision 4: Supabase client-side (anon key) for auth, server-side (service_role) for data**
- Rationale: Auth flows need browser SDK (OAuth redirects). Data access uses service_role through API routes.

## Risks / Trade-offs

- [Google OAuth requires Supabase dashboard config] → Document as post-deploy setup step, use placeholder
- [Supabase free tier: 50K MAU] → More than enough for admin panel
