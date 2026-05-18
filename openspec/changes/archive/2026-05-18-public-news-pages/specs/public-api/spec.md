## ADDED Requirements

### Requirement: Articles listing API with pagination
The API SHALL provide `GET /api/articles` with query params: page (default 1), limit (default 20), category (optional slug filter).

#### Scenario: Fetch articles with default pagination
- **WHEN** client calls `GET /api/articles`
- **THEN** the API returns first 20 published articles ordered by published_at DESC with meta: { page, limit, total, totalPages, hasMore }

#### Scenario: Fetch articles filtered by category
- **WHEN** client calls `GET /api/articles?category=tech`
- **THEN** the API returns only published articles in the "tech" category

### Requirement: Single article API
The API SHALL provide `GET /api/articles/:slug` returning a single published article with newer/older navigation data.

#### Scenario: Fetch existing published article
- **WHEN** client calls `GET /api/articles/my-article`
- **THEN** the API returns the article data plus `newerPost` and `olderPost` objects (slug + title) or null

#### Scenario: Fetch non-existent article
- **WHEN** client calls `GET /api/articles/invalid-slug`
- **THEN** the API returns HTTP 404

### Requirement: Categories listing API
The API SHALL provide `GET /api/categories` returning all categories ordered by sort_order.

#### Scenario: Fetch all categories
- **WHEN** client calls `GET /api/categories`
- **THEN** the API returns all categories ordered by sort_order ASC

### Requirement: Most viewed today API
The API SHALL provide `GET /api/articles/most-viewed` returning the top 5 most viewed articles today.

#### Scenario: Articles have views today
- **WHEN** client calls `GET /api/articles/most-viewed` and articles have been viewed today
- **THEN** the API returns up to 5 articles ordered by today's view_count DESC

#### Scenario: No views today
- **WHEN** client calls `GET /api/articles/most-viewed` and no views exist for today
- **THEN** the API returns the 5 latest published articles as fallback
