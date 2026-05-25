-- Add notify_email flag to import_batches
ALTER TABLE import_batches ADD COLUMN notify_email boolean NOT NULL DEFAULT false;
