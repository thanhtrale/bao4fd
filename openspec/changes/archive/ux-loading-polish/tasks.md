## Tasks

- [x] Create `app/components/AppImage.vue` — blur-up image with skeleton shimmer, lazy loading, eager prop
- [x] Create skeleton components: `SkeletonCard.vue`, `SkeletonArticleDetail.vue`, `SkeletonCategoryList.vue`
- [x] Add `<NuxtLoadingIndicator>` to `app.vue` (subtle, 2px height)
- [x] Refactor `index.vue` to use `useLazyFetch` + skeleton fallback
- [x] Refactor `category/[slug].vue` to show skeleton while loading
- [x] Refactor `article/[slug].vue` to show skeleton while loading
- [x] Replace all `<img>` in Card.vue, List.vue, HeroSlider.vue, article/[slug].vue with `<AppImage>`
