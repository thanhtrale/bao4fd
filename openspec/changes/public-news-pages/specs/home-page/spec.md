## ADDED Requirements

### Requirement: Home page displays latest articles by category
The home page SHALL display the latest published articles grouped by category, with each category showing up to 4 articles ordered by published_at DESC.

#### Scenario: Home page with articles in multiple categories
- **WHEN** a visitor loads the home page
- **THEN** the page displays categories ordered by sort_order, each showing up to 4 latest published articles

#### Scenario: Home page with empty category
- **WHEN** a category has no published articles
- **THEN** that category section SHALL NOT be displayed on the home page

### Requirement: Home page displays most viewed today
The home page SHALL display a "Most Viewed Today" section with up to 5 articles ranked by daily view count.

#### Scenario: Articles have views today
- **WHEN** articles have been viewed today
- **THEN** the top 5 most viewed articles are displayed in the "Most Viewed Today" section

#### Scenario: No views today
- **WHEN** no articles have been viewed today
- **THEN** the "Most Viewed Today" section SHALL display the 5 latest published articles as fallback
