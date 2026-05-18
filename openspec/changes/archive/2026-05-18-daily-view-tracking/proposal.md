## Why

The "Most Viewed News of the Day" feature requires tracking article views per day and querying the top viewed articles. This is a separate concern from the basic article display.

## What Changes

- Create API endpoint `POST /api/articles/:slug/view` to increment daily view count
- Call the `increment_view` Supabase RPC function from the view endpoint
- Trigger view increment from article detail page on load
- Add pg_cron cleanup job SQL for old view records (optional, for maintenance)

## Capabilities

### New Capabilities
- `view-tracking`: API endpoint and client-side integration for tracking article views per day

### Modified Capabilities

## Impact

- New API route: `POST /api/articles/:slug/view`
- Client-side: detail page calls view endpoint on mount
- Database: uses `article_daily_views` table and `increment_view` RPC from database-schema change
