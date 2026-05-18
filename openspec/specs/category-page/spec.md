## ADDED Requirements

### Requirement: Category page displays paginated articles
The category page SHALL display published articles within a specific category, paginated with 20 items per page.

#### Scenario: Desktop pagination
- **WHEN** a visitor loads `/category/:slug` on desktop
- **THEN** the page displays 20 articles with page navigation links (1, 2, 3, ... N)

#### Scenario: Mobile infinite scroll
- **WHEN** a visitor loads `/category/:slug` on mobile and scrolls to the bottom
- **THEN** the next page of articles is automatically loaded and appended

#### Scenario: Infinite scroll depth limit
- **WHEN** a mobile user has scrolled past 50 pages (1000 items)
- **THEN** the infinite scroll SHALL stop and display a "View all articles" link

#### Scenario: Category not found
- **WHEN** a visitor loads `/category/:slug` with an invalid slug
- **THEN** the page SHALL display a 404 error
