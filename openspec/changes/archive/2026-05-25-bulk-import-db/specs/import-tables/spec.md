## ADDED Requirements

### Requirement: Import batches table
The system SHALL have an `import_batches` table that stores metadata for each batch of URLs submitted for import. The table SHALL include: id (uuid PK), category_id (FK to categories), total_urls (int), status (text: pending/processing/completed/partial_failure), invocation_count (int default 0), created_by (uuid FK to profiles), created_at (timestamptz), completed_at (timestamptz nullable).

#### Scenario: Batch record created
- **WHEN** a new batch is inserted with category_id, total_urls, and created_by
- **THEN** the record SHALL have status 'pending', invocation_count 0, created_at set to now(), and completed_at NULL

### Requirement: Import jobs table
The system SHALL have an `import_jobs` table that tracks individual URL processing status within a batch. The table SHALL include: id (uuid PK), batch_id (FK to import_batches ON DELETE CASCADE), url (text), status (text: pending/processing/published/failed), article_id (uuid FK to articles nullable), error_message (text nullable), retry_count (int default 0), retry_after (timestamptz nullable), created_at (timestamptz), updated_at (timestamptz).

#### Scenario: Job record created
- **WHEN** a new import job is inserted with batch_id and url
- **THEN** the record SHALL have status 'pending', retry_count 0, retry_after NULL, article_id NULL, error_message NULL

#### Scenario: Job status updated
- **WHEN** a job's status is updated
- **THEN** the updated_at column SHALL be automatically set to now() via the existing trigger

### Requirement: Job queue query support
The system SHALL have indexes that support efficient job queue queries: selecting pending jobs filtered by retry_after timestamp, and querying jobs by batch_id.

#### Scenario: Query pending jobs for processing
- **WHEN** the worker queries for pending jobs with `status = 'pending' AND (retry_after IS NULL OR retry_after <= now())`
- **THEN** the query SHALL use an index and support `FOR UPDATE SKIP LOCKED` for concurrent access

#### Scenario: Query jobs by batch
- **WHEN** the dashboard queries all jobs for a specific batch_id
- **THEN** the query SHALL use an index on batch_id

### Requirement: Realtime enabled for import_jobs
The system SHALL enable Supabase Realtime on the `import_jobs` table so that admin clients can subscribe to status changes.

#### Scenario: Job status change broadcasted
- **WHEN** a job's status changes in the database
- **THEN** Supabase Realtime SHALL broadcast the change to subscribed clients
