-- Atomic view counting RPC function
-- Uses UPSERT to avoid race conditions on concurrent view increments
CREATE OR REPLACE FUNCTION increment_view(p_article_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO article_daily_views (article_id, view_date, view_count)
  VALUES (p_article_id, CURRENT_DATE, 1)
  ON CONFLICT (article_id, view_date)
  DO UPDATE SET view_count = article_daily_views.view_count + 1;
END;
$$;
