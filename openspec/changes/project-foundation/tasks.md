## 1. Initialize NuxtJS 3 Project

- [ ] 1.1 Run `npx nuxi@latest init` to create NuxtJS 3 project in workspace root
- [ ] 1.2 Configure `nuxt.config.ts`: enable TypeScript, set Vercel preset (`nitro.preset: 'vercel'`), configure route rules (SSR public, SPA admin)
- [ ] 1.3 Create `.env.example` with all placeholder environment variables

## 2. Folder Structure & Layouts

- [ ] 2.1 Create layered folder structure: `server/api/.gitkeep`, `server/services/.gitkeep`, `server/utils/`, `server/middleware/`
- [ ] 2.2 Create base layouts: `app/layouts/default.vue` (public) and `app/layouts/admin.vue` (backoffice)

## 3. Supabase Client Setup

- [ ] 3.1 Install `@supabase/supabase-js` dependency
- [ ] 3.2 Create `server/utils/supabase.ts` — export `useSupabaseAdmin()` function that creates Supabase client with service_role key from env vars
