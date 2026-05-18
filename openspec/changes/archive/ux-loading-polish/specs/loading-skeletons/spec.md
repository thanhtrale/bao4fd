## ADDED Requirements

### Requirement: Blur-up image loading
The system SHALL provide an AppImage component that shows a skeleton shimmer, then reveals the image with a blur-to-sharp transition on load.

#### Scenario: Image loading state
- **WHEN** an image has not yet loaded
- **THEN** a pulsing skeleton placeholder SHALL be visible in its place

#### Scenario: Image loaded with blur-up
- **WHEN** the image finishes loading
- **THEN** it SHALL transition from blurred (filter: blur) to sharp over 300ms

#### Scenario: Lazy loading
- **WHEN** the image is below the viewport fold
- **THEN** it SHALL use native loading="lazy" to defer loading

#### Scenario: Above-fold images skip lazy
- **WHEN** the eager prop is set to true
- **THEN** the image SHALL NOT use loading="lazy"

### Requirement: Page skeleton placeholders
The system SHALL show skeleton UI during client-side page navigation while data is loading.

#### Scenario: Home page skeleton
- **WHEN** navigating to home page and data is not yet available
- **THEN** skeleton placeholders for hero area and card grid SHALL be displayed

#### Scenario: Category page skeleton
- **WHEN** navigating to a category page and data is loading
- **THEN** skeleton rows matching the article list layout SHALL be displayed

#### Scenario: Article detail skeleton
- **WHEN** navigating to an article detail and data is loading
- **THEN** skeleton blocks for title, meta, image, and content SHALL be displayed

### Requirement: Loading indicator
The system SHALL display a subtle top progress bar during route navigation as a fallback.

#### Scenario: Progress bar on navigation
- **WHEN** a route navigation begins and takes more than 200ms
- **THEN** a thin progress bar SHALL appear at the top of the page
