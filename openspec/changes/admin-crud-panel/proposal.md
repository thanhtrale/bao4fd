## Why

Content managers need a backoffice interface to create, edit, and delete categories and news articles. This includes image upload for article thumbnails via Supabase Storage.

## What Changes

- Create admin dashboard at `/admin` (simple list view)
- Create Categories CRUD: list, create, edit, delete at `/admin/categories`
- Create Articles CRUD: list, create, edit, delete at `/admin/articles`
- Create image upload endpoint using Supabase Storage (public thumbnails bucket)
- Create protected REST API endpoints for CRUD operations
- Apply admin layout to all `/admin/**` routes

## Capabilities

### New Capabilities
- `admin-categories-crud`: CRUD interface and API for managing categories
- `admin-articles-crud`: CRUD interface and API for managing articles with image upload
- `image-upload`: Image upload to Supabase Storage public bucket for article thumbnails

### Modified Capabilities

## Impact

- New pages: `/admin`, `/admin/categories`, `/admin/articles`, `/admin/articles/new`, `/admin/articles/:id/edit`
- New API routes: POST/PUT/DELETE for `/api/categories` and `/api/articles`
- New API route: `POST /api/upload`
- Supabase Storage: `thumbnails` bucket (public)
- All admin routes require authentication
