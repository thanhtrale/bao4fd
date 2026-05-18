## Why

Public pages (home, category, article detail) are bare HTML with no visual design. Need a modern news portal look: sticky nav with category links, hero slider, card grid layout, proper typography, responsive design, and smooth interactions to feel like a real news site.

## What Changes

- Redesign default layout: sticky header with SVG logo, category nav links, mobile hamburger menu
- Home page: hero article slider (latest articles loop), category sections with cards, "Most Viewed" sidebar
- Category page: list layout with thumbnails, article count, responsive pagination
- Article detail: full-width hero image, large title, prose-styled content, reading time, navigation
- Article Card component: thumbnail, category tag with color, title, excerpt, relative time
- Most Viewed widget: numbered list with view count badges
- Footer: branded, link sections
- SVG logo icon for "Mini News Portal"
- Hover animations on cards (scale + shadow)
- Page transitions (fade)
- Responsive: mobile-first, 3 breakpoints (sm, md, lg)

## Capabilities

### New Capabilities
- `news-layout`: Header, footer, navigation structure, page transitions, responsive shell
- `hero-slider`: Auto-rotating hero section showing latest articles with smooth transitions
- `article-cards`: Article card component design, hover effects, category color badges, relative time display

### Modified Capabilities
- `home-page`: Redesign layout with hero slider + sidebar + category sections grid
- `category-page`: List layout with thumbnails, improved pagination UI
- `article-detail-page`: Full redesign with hero image, prose typography, reading time

## Impact

- `app/layouts/default.vue`: Complete rewrite — sticky nav, footer, responsive shell
- `app/pages/index.vue`: Redesign with hero + sidebar + sections
- `app/pages/category/[slug].vue`: List layout redesign
- `app/pages/article/[slug].vue`: Detail page redesign
- `app/components/article/Card.vue`: Full redesign with Tailwind
- `app/components/article/MostViewed.vue`: Redesign with numbered list
- `app/components/article/List.vue`: Update pagination styling
- New: `app/components/HeroSlider.vue`
- New: `app/components/SiteHeader.vue`
- New: `app/components/SiteFooter.vue`
- New: `public/logo.svg`
