## Context

Tailwind CSS 4 is installed with theme tokens (colors, fonts, typography plugin). Public pages need to be redesigned from raw HTML/inline styles to a polished modern news portal. The app has 5 categories, 222 articles, and supports pagination + infinite scroll on mobile.

## Goals / Non-Goals

**Goals:**
- Professional news portal look comparable to TechCrunch/The Verge style
- Mobile-first responsive design (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- Smooth interactions (hover effects, transitions, auto-rotating hero)
- Readable typography for long-form article content
- Visual category differentiation via color system
- SVG brand icon

**Non-Goals:**
- Dark mode
- Search functionality
- Comments or social sharing
- User profile pages
- SEO meta tags optimization (keep existing)

## Decisions

1. **Layout: max-w-7xl centered** — Content constrained to 1280px max, centered with padding on sides.

2. **Hero slider** — Client-side auto-rotate every 5s, shows 3-5 latest articles. CSS transitions (opacity/transform). Pause on hover. Dots indicator.

3. **Header** — Sticky, `bg-slate-900 text-white`. Logo left, category links center (desktop) / hamburger (mobile), Admin button right.

4. **Article Card** — Vertical card: thumbnail (aspect-video rounded), category badge (colored pill), title (font-semibold line-clamp-2), excerpt (line-clamp-2 text-sm text-slate-600), relative time.

5. **Category page** — Horizontal list layout (thumbnail left, content right) for better scanability with many articles. Pagination: styled number buttons with active state.

6. **Article detail** — `max-w-3xl mx-auto`. Breadcrumb-style category link, large title (text-3xl lg:text-4xl), meta line (date + reading time), full-width thumbnail, prose content.

7. **Relative time** — Use simple helper: "2 giờ trước", "1 ngày trước", "18/05/2026" (>7 days).

8. **Mobile nav** — Slide-in sidebar triggered by hamburger. Category links stacked vertically.

## Risks / Trade-offs

- **Hero slider** adds client-side complexity; kept simple (CSS transitions + setInterval) to avoid heavy lib
- **No image optimization** — thumbnails served as-is from Supabase Storage. Acceptable for MVP
- **line-clamp** requires Tailwind's built-in support (available in v4)
