## Why

The application needs a PostgreSQL database schema to store categories, articles, and daily view tracking data. Without a well-designed schema with proper indexes, all features are blocked.

## What Changes

- Create Supabase SQL migration for `categories` table
- Create Supabase SQL migration for `articles` table with FK to categories
- Create Supabase SQL migration for `article_daily_views` table
- Create `increment_view` RPC function for atomic view counting
- Add proper indexes for all query patterns (home page listing, category filtering, most viewed today, newer/older navigation)

## Capabilities

### New Capabilities
- `database-tables`: Database schema definition for categories, articles, and article_daily_views tables with constraints and indexes
- `view-counting-rpc`: PostgreSQL RPC function for atomic daily view count increment

### Modified Capabilities

## Impact

- Supabase PostgreSQL database: 3 new tables, 1 RPC function
- All other features depend on this schema
- Migration files stored in `supabase/migrations/`
