## Context

Admin panel needs CRUD for categories and articles with image upload. All routes protected by auth middleware. SPA mode (no SSR needed).

## Goals / Non-Goals

**Goals:**
- Categories CRUD (list, create, edit, delete)
- Articles CRUD (list, create, edit, delete) with rich content editing
- Image upload for thumbnails via Supabase Storage
- Protected API endpoints for all write operations
- Simple, functional admin UI

**Non-Goals:**
- No WYSIWYG editor (use textarea/markdown for MVP)
- No bulk operations
- No article preview
- No drag-and-drop reordering

## Decisions

**Decision 1: Supabase Storage public bucket for thumbnails**
- Upload path: `articles/{slug}/{filename}`
- Returns public URL stored in articles.thumbnail column
- Max file size: 2MB (enforced on client and server)

**Decision 2: Simple form-based UI**
- No complex UI framework for admin. Use basic HTML forms with Vue reactivity.
- Tables for list views, forms for create/edit.

**Decision 3: Soft delete consideration — NO, hard delete for MVP**
- Rationale: MVP simplicity. Category delete blocked by FK RESTRICT if articles exist.

## Risks / Trade-offs

- [Supabase Storage 1GB free limit] → 2MB per image ≈ 500 images, sufficient for MVP
- [No rich text editor] → Users write HTML/markdown in textarea. Acceptable for MVP admin.
