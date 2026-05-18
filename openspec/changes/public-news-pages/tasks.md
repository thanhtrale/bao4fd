## 1. Public API Endpoints

- [x] 1.1 Create `server/services/article.service.ts` — service functions: getArticles (paginated, optional category filter), getArticleBySlug (with newer/older), getMostViewedToday (with fallback)
- [x] 1.2 Create `server/services/category.service.ts` — service functions: getCategories, getCategoryBySlug
- [x] 1.3 Create `GET /api/articles/index.get.ts` — list articles with pagination and optional category filter
- [x] 1.4 Create `GET /api/articles/most-viewed.get.ts` — top 5 most viewed today with fallback
- [x] 1.5 Create `GET /api/articles/[slug].get.ts` — single article with newer/older navigation
- [x] 1.6 Create `GET /api/categories/index.get.ts` — list all categories

## 2. Shared Components

- [x] 2.1 Create `app/components/article/Card.vue` — article card with thumbnail, title, excerpt, category, date
- [x] 2.2 Create `app/components/article/List.vue` — article list with pagination controls (desktop) and infinite scroll trigger (mobile)
- [x] 2.3 Create `app/components/article/MostViewed.vue` — most viewed today sidebar/section component

## 3. Public Pages

- [x] 3.1 Create `app/composables/useArticles.ts` — composable for fetching articles (paginated), single article, most viewed
- [x] 3.2 Create `app/composables/useCategories.ts` — composable for fetching categories
- [x] 3.3 Create `app/pages/index.vue` — home page: latest articles by category + most viewed today (SSR)
- [x] 3.4 Create `app/pages/category/[slug].vue` — category page with pagination + infinite scroll (SSR + client)
- [x] 3.5 Create `app/pages/article/[slug].vue` — article detail page with newer/older navigation (SSR)
