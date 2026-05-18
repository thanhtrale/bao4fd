## ADDED Requirements

### Requirement: Bulk download and upload thumbnails
The system SHALL provide a script that downloads stock images and uploads them to Supabase Storage, then updates all articles missing thumbnails.

#### Scenario: Successful bulk upload
- **WHEN** the seed-thumbnails script is executed
- **THEN** it SHALL download images from Picsum Photos using category-aware seed keys
- **THEN** it SHALL upload each image to the Supabase Storage `thumbnails` bucket
- **THEN** it SHALL update each article's `thumbnail` field with the public URL

#### Scenario: Concurrency control
- **WHEN** processing 222 articles
- **THEN** the script SHALL process at most 5 concurrent downloads/uploads to avoid rate limiting

#### Scenario: Retry on failure
- **WHEN** a download or upload fails
- **THEN** the script SHALL retry up to 3 times before skipping that article

#### Scenario: Skip already-populated articles
- **WHEN** an article already has a non-NULL thumbnail
- **THEN** the script SHALL skip that article
