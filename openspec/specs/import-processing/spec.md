## ADDED Requirements

### Requirement: Background processor scrapes and saves articles
The system SHALL provide `POST /api/admin/process-imports` that processes pending import jobs. It SHALL accept either admin auth or an internal API key via `x-internal-key` header.

#### Scenario: Process batch of pending jobs
- **WHEN** the processor is invoked with a batchId
- **THEN** it SHALL select up to 5 pending jobs (where retry_after is null or past), scrape each URL, sanitize content, generate slug, insert article, and update job status to published

#### Scenario: Scraping fails
- **WHEN** scraping a URL fails and retry_count < 3
- **THEN** the job SHALL be set back to pending with retry_count incremented and retry_after set with exponential backoff (10s × 2^retry_count)

#### Scenario: All retries exhausted
- **WHEN** scraping fails and retry_count >= 3
- **THEN** the job SHALL be set to failed with error_message containing the failure reason

### Requirement: Self-chaining continues until batch complete
The processor SHALL use `event.waitUntil()` to trigger the next processing invocation after returning its response. The chain SHALL stop when no more pending/retriable jobs remain or safety limits are reached.

#### Scenario: More jobs remaining
- **WHEN** the processor finishes and pending jobs remain with retry_after in the past or null
- **THEN** it SHALL trigger a new invocation via waitUntil

#### Scenario: Safety limit reached
- **WHEN** invocation_count exceeds ceil(total_urls / 5) × 2
- **THEN** the chain SHALL stop and batch status SHALL be set to partial_failure

#### Scenario: Stale batch
- **WHEN** batch created_at is more than 30 minutes ago and pending jobs remain
- **THEN** the chain SHALL stop and batch status SHALL be set to partial_failure

### Requirement: Batch completion updates status
When all jobs in a batch have terminal status (published or failed), the batch status SHALL be updated accordingly.

#### Scenario: All jobs published
- **WHEN** all jobs reach published status
- **THEN** batch status SHALL be set to completed

#### Scenario: Some jobs failed
- **WHEN** all jobs reach terminal status but some are failed
- **THEN** batch status SHALL be set to partial_failure
