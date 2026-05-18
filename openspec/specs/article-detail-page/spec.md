## ADDED Requirements

### Requirement: Article detail page displays full content
The article detail page SHALL display the full article content including title, thumbnail, content, category, and published date.

#### Scenario: Valid published article
- **WHEN** a visitor loads `/article/:slug` for a published article
- **THEN** the page displays the full article content with SSR

#### Scenario: Unpublished article
- **WHEN** a visitor loads `/article/:slug` for an unpublished article
- **THEN** the page SHALL display a 404 error

#### Scenario: Article not found
- **WHEN** a visitor loads `/article/:slug` with an invalid slug
- **THEN** the page SHALL display a 404 error

### Requirement: Newer/Older article navigation
The article detail page SHALL display links to the newer and older articles within the same category.

#### Scenario: Article has both newer and older
- **WHEN** the current article has both a newer and older published article in the same category
- **THEN** both "Newer Post" and "Older Post" links are displayed with article titles

#### Scenario: Article is the newest in category
- **WHEN** the current article is the most recent in its category
- **THEN** "Newer Post" link SHALL NOT be displayed

#### Scenario: Article is the oldest in category
- **WHEN** the current article is the oldest in its category
- **THEN** "Older Post" link SHALL NOT be displayed
