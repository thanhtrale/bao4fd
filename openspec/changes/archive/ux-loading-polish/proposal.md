## Why

Pages show blank/flash states during client-side navigation, images pop in abruptly, and there's no visual feedback during data loading. This hurts perceived performance and polish.

## What Changes

- Add skeleton loading components for each page type (home, category, article detail)
- Add blur-up effect for images (low-quality placeholder → sharp image on load)
- Add native `loading="lazy"` for below-fold images
- Keep existing fade page transition, add NuxtLoadingIndicator as subtle fallback
- Wrap pages with Suspense + skeleton fallback for client-side navigation

## Capabilities

### New Capabilities
- `loading-skeletons`: Skeleton placeholder components and blur-up image loading

### Modified Capabilities

## Impact

- New components: `AppImage.vue`, `SkeletonCard.vue`, `SkeletonArticle.vue`, `SkeletonCategoryPage.vue`
- Modified: `app.vue`, `Card.vue`, `List.vue`, `HeroSlider.vue`, `article/[slug].vue`, `index.vue`, `category/[slug].vue`
- No new dependencies (pure CSS animations + native browser features)
