-- Composite index for efficient offset-based pagination
CREATE INDEX IF NOT EXISTS idx_articles_published_pagination
  ON articles (is_published, published_at DESC)
  WHERE is_published = true AND published_at IS NOT NULL;

-- Index for category + pagination queries
CREATE INDEX IF NOT EXISTS idx_articles_category_pagination
  ON articles (category_id, published_at DESC)
  WHERE is_published = true AND published_at IS NOT NULL;
