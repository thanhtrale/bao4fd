## Why

Current UI uses raw inline styles with no CSS framework. Need to install Tailwind CSS 4 as the foundation for the upcoming UI redesign — provides utility classes, responsive system, typography plugin, and theme configuration.

## What Changes

- Install `@nuxtjs/tailwindcss` module with Tailwind CSS 4
- Install `@tailwindcss/typography` plugin for article prose content
- Configure theme: color palette, fonts (Inter via Google Fonts), spacing
- Create base CSS with `@theme` block (Tailwind 4 CSS-first config)
- Define category color mapping utility
- Add smooth scroll, transition defaults

## Capabilities

### New Capabilities
- `tailwind-theme`: Tailwind 4 installation, theme configuration (colors, typography, responsive breakpoints), base global styles

### Modified Capabilities

## Impact

- `nuxt.config.ts`: Add `@nuxtjs/tailwindcss` module
- `package.json`: New devDependencies (`@nuxtjs/tailwindcss`, `@tailwindcss/typography`)
- `app/assets/css/main.css`: New file — Tailwind directives + `@theme` config
- All `.vue` files will gradually migrate from inline styles to Tailwind classes (in subsequent changes)
