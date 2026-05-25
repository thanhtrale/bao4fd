-- Import jobs table
CREATE TABLE import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  url text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'published', 'failed')),
  article_id uuid REFERENCES articles(id) ON DELETE SET NULL,
  error_message text,
  retry_count int NOT NULL DEFAULT 0,
  retry_after timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for job queue queries: find pending jobs ready to process
CREATE INDEX idx_import_jobs_queue ON import_jobs (status, retry_after)
  WHERE status = 'pending';

-- Index for dashboard: get all jobs in a batch
CREATE INDEX idx_import_jobs_batch ON import_jobs (batch_id);

-- Reuse existing updated_at trigger
CREATE TRIGGER trg_import_jobs_updated_at
  BEFORE UPDATE ON import_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
