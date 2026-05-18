## ADDED Requirements

### Requirement: Auto-rotating hero section
Home page shows a large hero area cycling through latest articles.

#### Scenario: Hero displays latest articles
- **WHEN** home page loads
- **THEN** hero section shows the 5 most recent published articles, one at a time, with large image background, category badge, title, and excerpt

#### Scenario: Auto-rotation
- **WHEN** hero is visible and user is not hovering
- **THEN** slides auto-advance every 5 seconds with a fade/slide transition

#### Scenario: Pause on hover
- **WHEN** user hovers over the hero area
- **THEN** auto-rotation pauses until hover ends

#### Scenario: Navigation dots
- **WHEN** hero renders
- **THEN** dot indicators at the bottom show current position; clicking a dot jumps to that slide

#### Scenario: Responsive hero height
- **WHEN** viewport < 768px
- **THEN** hero height reduces (h-64 vs h-96 on desktop)

#### Scenario: Click navigates to article
- **WHEN** user clicks the hero slide content
- **THEN** navigates to the article detail page
