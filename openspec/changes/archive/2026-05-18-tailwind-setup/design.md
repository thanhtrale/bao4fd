## Context

App currently uses inline styles everywhere. Need a CSS framework to enable consistent, maintainable styling across all pages. Tailwind CSS 4 chosen for its utility-first approach, CSS-first configuration, and excellent Nuxt integration.

## Goals / Non-Goals

**Goals:**
- Install and configure Tailwind CSS 4 with Nuxt module
- Define design tokens: colors, fonts, spacing, breakpoints
- Set up typography plugin for article content
- Create reusable category color system
- Establish animation/transition defaults

**Non-Goals:**
- Restyle any existing components (done in subsequent changes)
- Dark mode
- Custom Tailwind plugins
- Sass/SCSS

## Decisions

1. **Tailwind 4 CSS-first config** — Use `@theme` in CSS instead of `tailwind.config.js`. Simpler, no JS config file needed.

2. **Font: Inter** — Via Google Fonts CDN. Clean, modern, highly legible at all sizes. Good for news content.

3. **Color palette**:
   - Primary: slate (text), white (bg)
   - Accent: blue-600 (`#2563eb`) for links/CTAs
   - Header/Footer: slate-900 (`#0f172a`)
   - Category colors: blue (tech), emerald (business), orange (sports), pink (entertainment), teal (health)

4. **Typography plugin** — `@tailwindcss/typography` provides `prose` class for rich article content with proper heading sizes, paragraph spacing, list styling.

5. **Module: @nuxtjs/tailwindcss** — Official Nuxt module, handles purging, HMR, and Tailwind 4 support.

## Risks / Trade-offs

- **Tailwind 4 is newer** — Fewer community examples vs v3, but API is stable and Nuxt module supports it
- **CDN font** — Adds external request; acceptable for MVP. Could self-host later
- **No config.js** — Some Tailwind plugins may expect JS config; typography plugin works with CSS-first approach
