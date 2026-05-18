## 1. Supabase Auth Client Setup

- [ ] 1.1 Install `@supabase/ssr` package for Nuxt SSR-compatible auth
- [ ] 1.2 Create `app/utils/supabase-client.ts` — browser-side Supabase client using SUPABASE_URL and SUPABASE_ANON_KEY (exposed via runtimeConfig.public)
- [ ] 1.3 Create `app/composables/useAuth.ts` — composable providing login (email/password), loginWithGoogle, logout, user state, and isAdmin check

## 2. Server Auth Middleware

- [ ] 2.1 Create `server/utils/auth.ts` — helper function `requireAuth(event)` that verifies Supabase JWT from Authorization header and checks email against ADMIN_EMAILS env var
- [ ] 2.2 Add ADMIN_EMAILS to `.env.example`

## 3. Login Page

- [ ] 3.1 Create `/admin/login` page with email/password form and Google OAuth button
- [ ] 3.2 Create `app/middleware/admin-auth.ts` — client-side route middleware that redirects unauthenticated users to `/admin/login` for all `/admin` routes (except login itself)
