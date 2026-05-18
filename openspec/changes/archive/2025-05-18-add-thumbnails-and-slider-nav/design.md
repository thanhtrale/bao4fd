## Context

The site has 222 articles with no thumbnails (all NULL). The upload API (`/api/upload`) exists and works with Supabase Storage bucket `thumbnails`. The HeroSlider component has auto-rotate and dots but lacks chevron navigation.

## Goals / Non-Goals

**Goals:**
- Populate all 222 articles with relevant stock images uploaded to Supabase Storage
- Test the upload API flow end-to-end
- Add prev/next chevron buttons to HeroSlider that appear on hover

**Non-Goals:**
- AI-generated images or paid stock photo services
- Replacing the upload API implementation
- Changing slider timing or transition style

## Decisions

### 1. Image source: Picsum Photos (picsum.photos)

**Choice**: Download from `https://picsum.photos/seed/{unique-key}/800/450` then upload to Supabase Storage.

**Why over alternatives:**
- Unsplash API requires key + 50 req/hour rate limit (would take 4+ hours for 222 images)
- Direct URL linking (no upload) doesn't test the storage flow and depends on external CDN
- Picsum seed-based URLs give deterministic, unique images per article

### 2. Category-aware seed keys

Use `{category_slug}-{article_index}` as seed for Picsum so images within the same category have visual cohesion (same seed prefix → similar style).

### 3. Batch processing with concurrency limit

Download + upload in batches of 5 concurrent requests to avoid overwhelming Supabase Storage API and Picsum rate limits.

### 4. Use service role key directly (bypass auth)

The script runs locally with `SUPABASE_SERVICE_ROLE_KEY`, uploading directly to Storage and updating DB — no need to go through the HTTP upload API since we're seeding data, not testing user flow. However, to also validate the upload endpoint works, we'll upload the first 5 images through the API.

### 5. Slider chevrons: CSS opacity transition on group-hover

Chevrons are always in DOM but `opacity-0 group-hover:opacity-100`. This avoids layout shifts and works well with the existing pause-on-hover behavior.

## Risks / Trade-offs

- **Picsum downtime** → Script has retry logic (3 attempts per image)
- **Storage quota** → ~222 images × 80KB avg = ~17MB, well within 1GB free tier
- **Slow script execution** → Batching 5 at a time, expected ~2-3 minutes total
- **Picsum images not contextual** → Acceptable for MVP/demo, real content would use actual photos
