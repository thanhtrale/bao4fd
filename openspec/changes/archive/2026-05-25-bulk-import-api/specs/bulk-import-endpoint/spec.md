## ADDED Requirements

### Requirement: Admin can submit bulk URLs for import
The system SHALL provide `POST /api/admin/bulk-import` that accepts a JSON body with `urls` (array of strings, max 100) and `categoryId` (uuid). The endpoint SHALL require admin authentication.

#### Scenario: Valid submission
- **WHEN** admin submits valid URLs and categoryId
- **THEN** the system SHALL create an import_batch and import_jobs records, return HTTP 202 with `{ batchId }`, and trigger background processing

#### Scenario: Too many URLs
- **WHEN** the submission contains more than 100 URLs
- **THEN** the system SHALL return HTTP 400 with error message

#### Scenario: Invalid URL format
- **WHEN** any URL is not a valid HTTP/HTTPS URL
- **THEN** the system SHALL return HTTP 400 listing the invalid URLs

#### Scenario: Unsupported domain
- **WHEN** any URL is from a domain not supported by the scraper
- **THEN** the system SHALL return HTTP 400 listing the unsupported URLs

#### Scenario: Duplicate URL detected
- **WHEN** a URL already exists in import_jobs or matches an existing article
- **THEN** the system SHALL skip that URL and include it in the response's `skipped` list

### Requirement: Admin can list import batches
The system SHALL provide `GET /api/admin/import-batches` that returns all import batches with their job counts grouped by status. The endpoint SHALL require admin authentication.

#### Scenario: List batches
- **WHEN** admin requests the batch list
- **THEN** the system SHALL return batches ordered by created_at desc, each with total/pending/processing/published/failed counts
