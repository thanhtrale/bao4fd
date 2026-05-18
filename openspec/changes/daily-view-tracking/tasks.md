## 1. View Tracking

- [x] 1.1 Create `server/services/view.service.ts` — service function calling Supabase RPC `increment_view`
- [x] 1.2 Create `POST /api/articles/[slug]/view.post.ts` — endpoint that looks up article by slug and calls view service
- [x] 1.3 Add fire-and-forget view tracking call in `app/pages/article/[slug].vue` onMounted hook
