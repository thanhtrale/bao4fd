-- Articles table
CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  thumbnail text,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_art_slug ON articles (slug);
CREATE INDEX idx_art_cat_pub ON articles (category_id, is_published, published_at DESC);
CREATE INDEX idx_art_published ON articles (is_published, published_at DESC);
CREATE INDEX idx_art_created ON articles (created_at DESC);
