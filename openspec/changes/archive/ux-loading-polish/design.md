## Context

Public pages use SSR + `await useFetch()` which blocks server render but during client-side SPA navigation there's a gap where the old page fades out and the new page hasn't loaded yet. Images load abruptly without any placeholder.

## Goals / Non-Goals

**Goals:**
- Smooth perceived loading via skeleton placeholders during client navigation
- Blur-up image loading (shimmer → blurred tiny placeholder → sharp)
- Native lazy loading for off-screen images
- Minimal flash/blank between route changes

**Non-Goals:**
- Installing @nuxt/image (too heavy for MVP)
- Server-side image optimization/resizing
- Skeleton for admin pages (text "Loading..." is fine there)

## Decisions

### 1. AppImage component with blur-up via CSS filter

A reusable `<AppImage>` component that:
- Shows a pulsing skeleton placeholder initially
- On `@load`, transitions from `filter: blur(10px)` to `filter: blur(0)` with CSS transition
- Adds `loading="lazy"` by default (prop to disable for above-fold)

### 2. Page-level skeletons via `<Suspense>` pattern

Each page that uses `await useFetch()` already blocks during SSR. For client-side nav, Nuxt's `<NuxtPage>` with transition handles the swap. We add skeleton fallback using a `#fallback` slot approach — but since NuxtPage doesn't expose Suspense directly, we use a simple approach: each page exports a loading state, and we show skeletons inline.

Actually simpler: Use `useLazyFetch` + skeleton pattern — show skeleton while data loads on client navigation, but on SSR the data is already there.

### 3. NuxtLoadingIndicator as safety net only

Thin bar at top of page, very subtle (height: 2px, throttle: 200), just in case navigation takes longer than expected.

## Risks / Trade-offs

- Skeletons add template complexity but greatly improve perceived performance
- Blur-up adds a slight CPU cost for filter transition — negligible on modern devices
- `useLazyFetch` means pages need explicit `v-if` checks for null data states
