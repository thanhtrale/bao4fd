## Why

All 222 articles in the database have NULL thumbnails, making the entire site show placeholder icons/gradients. This looks unfinished and defeats the purpose of the redesigned UI. Additionally, the hero slider lacks prev/next chevron navigation that appears on hover, which is standard UX for image carousels.

## What Changes

- Create a script to download category-relevant stock images from Picsum/Lorem Photos and upload them to Supabase Storage via the existing upload API
- Update all articles' `thumbnail` field with the uploaded image URLs
- Add left/right chevron navigation buttons to the HeroSlider component that appear on hover

## Capabilities

### New Capabilities
- `seed-thumbnails`: Script to bulk-download and upload thumbnail images to Supabase Storage, then update article records

### Modified Capabilities
- `hero-slider`: Add prev/next chevron buttons visible on hover, maintain auto-rotate behavior

## Impact

- New script: `scripts/seed-thumbnails.ts`
- Modified component: `app/components/HeroSlider.vue`
- Supabase Storage: ~222 images uploaded to `thumbnails` bucket (~800x450 each, ~50-100KB = ~15-20MB total, well within 1GB free tier)
- No API changes, no breaking changes
