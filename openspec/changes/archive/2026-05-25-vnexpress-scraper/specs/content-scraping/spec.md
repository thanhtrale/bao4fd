## ADDED Requirements

### Requirement: Scraper extracts structured content from VNExpress URLs
The scraper service SHALL fetch a VNExpress article URL and extract: title (from `h1.title-detail`), content HTML (from `article.fck_detail`), thumbnail URL (from `meta[property="og:image"]`), and description (from `meta[property="og:description"]`).

#### Scenario: Successful scrape of a valid VNExpress article
- **WHEN** the scraper receives a valid VNExpress article URL
- **THEN** it SHALL return an object with title, content, thumbnail, and description fields populated

#### Scenario: Article page returns 404
- **WHEN** the scraper fetches a URL that returns HTTP 404
- **THEN** it SHALL throw an error with message containing "404"

#### Scenario: Selector finds no content
- **WHEN** the page loads but expected selectors match no elements
- **THEN** it SHALL throw an error with message "Selector mismatch"

### Requirement: HTML content is sanitized against XSS
The scraper SHALL sanitize all extracted HTML content before returning it. Only safe tags (p, h2, h3, h4, strong, em, a, img, ul, ol, li, blockquote, figure, figcaption, br, table, thead, tbody, tr, th, td) and safe attributes (href, src, alt, title, class) SHALL be allowed. All script tags, event handlers, and data URIs SHALL be stripped.

#### Scenario: Script tags removed
- **WHEN** the extracted content contains `<script>` tags
- **THEN** the sanitized output SHALL NOT contain any script tags

#### Scenario: Event handlers removed
- **WHEN** the extracted content contains `onclick` or `onerror` attributes
- **THEN** the sanitized output SHALL NOT contain those attributes

#### Scenario: Safe tags preserved
- **WHEN** the extracted content contains `<p>`, `<strong>`, `<img>` tags
- **THEN** those tags SHALL be preserved in the sanitized output

### Requirement: Content images with broken URLs replaced with placeholder
The scraper SHALL check each `<img>` in the content. Images with invalid or unreachable `src` URLs SHALL have their `src` replaced with a placeholder image path.

#### Scenario: Image URL unreachable
- **WHEN** a content image's src URL returns a non-2xx response or times out
- **THEN** the img src SHALL be replaced with `/images/placeholder.jpg`

#### Scenario: Image URL valid
- **WHEN** a content image's src URL returns 2xx
- **THEN** the original src SHALL be preserved

### Requirement: Slug generated from Vietnamese title
The scraper SHALL generate a URL-safe slug from the article title by converting Vietnamese diacritics to ASCII, lowercasing, replacing spaces with hyphens, and removing non-alphanumeric characters.

#### Scenario: Vietnamese title slugified
- **WHEN** the title is "Việt Nam vô địch AFF Cup 2024"
- **THEN** the slug SHALL be "viet-nam-vo-dich-aff-cup-2024"

### Requirement: Scraper factory resolves by domain
The system SHALL provide a factory function that accepts a URL and returns the appropriate scraper module based on the URL's domain. Initially only `vnexpress.net` SHALL be supported.

#### Scenario: VNExpress URL resolved
- **WHEN** the factory receives a URL with domain `vnexpress.net`
- **THEN** it SHALL return the VNExpress scraper

#### Scenario: Unsupported domain rejected
- **WHEN** the factory receives a URL with an unsupported domain
- **THEN** it SHALL throw an error with message "Unsupported domain"
