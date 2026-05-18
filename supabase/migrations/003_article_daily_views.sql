-- Article daily views table for "Most Viewed Today" feature
CREATE TABLE article_daily_views (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  view_date date NOT NULL DEFAULT CURRENT_DATE,
  view_count int NOT NULL DEFAULT 1,
  CONSTRAINT uq_article_date UNIQUE (article_id, view_date)
);

CREATE INDEX idx_adv_date_views ON article_daily_views (view_date, view_count DESC);
CREATE INDEX idx_adv_article ON article_daily_views (article_id);
