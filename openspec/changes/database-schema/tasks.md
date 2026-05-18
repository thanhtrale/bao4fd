## 1. Database Migration Files

- [ ] 1.1 Create `supabase/migrations/001_categories.sql` — categories table with all columns, constraints, and indexes
- [ ] 1.2 Create `supabase/migrations/002_articles.sql` — articles table with FK to categories, all constraints, and indexes
- [ ] 1.3 Create `supabase/migrations/003_article_daily_views.sql` — daily views table with UNIQUE constraint and indexes
- [ ] 1.4 Create `supabase/migrations/004_increment_view_function.sql` — RPC function for atomic view counting
- [ ] 1.5 Create `supabase/migrations/005_updated_at_trigger.sql` — auto-update `updated_at` trigger for categories and articles
