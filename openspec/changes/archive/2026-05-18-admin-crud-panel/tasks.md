## 1. Admin API Endpoints

- [x] 1.1 Create `POST /api/categories/index.post.ts` — create category (auth required)
- [x] 1.2 Create `PUT /api/categories/[id].put.ts` — update category (auth required)
- [x] 1.3 Create `DELETE /api/categories/[id].delete.ts` — delete category (auth required)
- [x] 1.4 Create `POST /api/articles/index.post.ts` — create article (auth required)
- [x] 1.5 Create `PUT /api/articles/[id].put.ts` — update article (auth required)
- [x] 1.6 Create `DELETE /api/articles/[id].delete.ts` — delete article (auth required)
- [x] 1.7 Create `POST /api/upload.post.ts` — upload image to Supabase Storage (auth required, max 2MB, image types only)

## 2. Admin Pages

- [x] 2.1 Create `app/pages/admin/index.vue` — admin dashboard with links to categories and articles management
- [x] 2.2 Create `app/pages/admin/categories/index.vue` — categories list with create/edit/delete actions
- [x] 2.3 Create `app/pages/admin/categories/[id].vue` — category create/edit form (new = no id param, edit = with id)
- [x] 2.4 Create `app/pages/admin/articles/index.vue` — articles list with create/edit/delete actions
- [x] 2.5 Create `app/pages/admin/articles/[id].vue` — article create/edit form with thumbnail upload
