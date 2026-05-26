## ADDED Requirements

### Requirement: Fetch articles from category URL
The system SHALL accept a VNExpress category URL and return a list of articles with their title, URL, and source category name.

#### Scenario: Fetch from category page
- **WHEN** user provides a VNExpress category URL (e.g., `https://vnexpress.net/thoi-su`)
- **THEN** system returns `{ type: "articles", articles: [{ url, title, categoryName }] }`

#### Scenario: Fetch with limit
- **WHEN** user provides a category URL with `limit=10`
- **THEN** system returns at most 10 articles, fetching additional pages if page 1 has fewer

### Requirement: Multi-page fetching
The system SHALL automatically fetch subsequent pages (using `-p2`, `-p3` suffix) when the first page does not have enough articles to meet the requested limit.

#### Scenario: Pagination across multiple pages
- **WHEN** page 1 has 5 articles and limit is 10
- **THEN** system fetches page 2 (`-p2`) and combines results up to the limit

#### Scenario: Max page cap
- **WHEN** limit requires more than 5 pages
- **THEN** system stops at page 5 and returns whatever articles were collected

### Requirement: Detect homepage URL
The system SHALL detect when the provided URL is a VNExpress homepage and return available categories instead of articles.

#### Scenario: Homepage detection
- **WHEN** user provides `https://vnexpress.net` or `https://vnexpress.net/`
- **THEN** system returns `{ type: "categories", categories: [{ name, url }] }`

#### Scenario: Category extraction from homepage
- **WHEN** homepage is detected
- **THEN** system extracts category names and URLs from the navigation menu

### Requirement: Article title extraction
The system SHALL extract article titles from the category listing page HTML.

#### Scenario: Title from listing
- **WHEN** articles are fetched from a category page
- **THEN** each article includes a human-readable title extracted from the listing HTML

### Requirement: Source category name
The system SHALL include the source VNExpress category name for each fetched article.

#### Scenario: Category name from page
- **WHEN** articles are fetched from a category page
- **THEN** each article includes a `categoryName` field derived from the page heading or breadcrumb
