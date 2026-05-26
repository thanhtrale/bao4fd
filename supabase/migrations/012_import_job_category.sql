-- Add per-job category_id to import_jobs (allows different categories per article)
ALTER TABLE import_jobs ADD COLUMN category_id uuid REFERENCES categories(id) ON DELETE SET NULL;
