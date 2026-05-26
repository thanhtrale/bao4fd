## Requirements

### Requirement: Multi-source article fetching
The system SHALL support fetching articles from multiple news sources via a `source` parameter.

#### Scenario: VNExpress source
- **WHEN** `source=vnexpress` is specified
- **THEN** system fetches from vnexpress.net using VNExpress-specific selectors and pagination (`-p{n}`)

#### Scenario: Tuổi Trẻ source
- **WHEN** `source=tuoitre` is specified
- **THEN** system fetches from tuoitre.vn using Tuổi Trẻ-specific selectors and pagination (`-trang-{n}.htm`)

### Requirement: Fetch categories from homepage
The system SHALL return available categories when no URL parameter is provided.

#### Scenario: VNExpress categories
- **WHEN** `source=vnexpress` with no `url` param
- **THEN** system fetches vnexpress.net homepage and returns `{ type: "categories", categories: [{ name, url }] }` from navigation links

#### Scenario: Tuổi Trẻ categories
- **WHEN** `source=tuoitre` with no `url` param
- **THEN** system fetches tuoitre.vn homepage and returns categories from navigation menu

### Requirement: Fetch articles from category URL
The system SHALL accept a category URL and return a list of articles with title, URL, and source category name.

#### Scenario: Fetch with limit
- **WHEN** user provides a category URL with `limit=N`
- **THEN** system returns at most N articles, fetching additional pages if needed (max 5 pages)

#### Scenario: Article data shape
- **WHEN** articles are fetched
- **THEN** each article includes `{ url, title, categoryName }`

### Requirement: Multi-page fetching
The system SHALL automatically paginate when a single page has fewer articles than the requested limit, up to a maximum of 5 pages.

### Requirement: Tuổi Trẻ article scraping
The system SHALL scrape individual Tuổi Trẻ article pages for import.

#### Scenario: Content extraction
- **WHEN** a tuoitre.vn article URL is scraped
- **THEN** system extracts title (`h1`), content (`.detail-content`), thumbnail (`og:image`), and description (`og:description`)

#### Scenario: Image data-original
- **WHEN** images use `data-original` attribute
- **THEN** system resolves `data-original` to `src` for proper display
