## ADDED Requirements

### Requirement: View tracking API endpoint
The system SHALL provide `POST /api/articles/:slug/view` to increment the daily view count for an article.

#### Scenario: Track view for existing article
- **WHEN** client calls `POST /api/articles/my-article/view`
- **THEN** the daily view count for that article is incremented by 1 and HTTP 200 is returned

#### Scenario: Track view for non-existent article
- **WHEN** client calls `POST /api/articles/invalid/view`
- **THEN** the API SHALL return HTTP 404

### Requirement: Client-side view tracking integration
The article detail page SHALL call the view tracking endpoint on mount without blocking rendering.

#### Scenario: User views article
- **WHEN** a visitor loads an article detail page
- **THEN** the page calls `POST /api/articles/:slug/view` in the background (fire-and-forget)

#### Scenario: View tracking fails
- **WHEN** the view tracking API call fails
- **THEN** the error SHALL be silently ignored and the page continues to function normally
