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

### Requirement: Hero slider chevron navigation
The hero slider displays prev/next chevron buttons that appear on hover, allowing manual slide navigation.

#### Scenario: Chevrons hidden by default
- **WHEN** the user is not hovering over the slider
- **THEN** the left and right chevron buttons SHALL be invisible (opacity 0)

#### Scenario: Chevrons visible on hover
- **WHEN** the user hovers over the slider
- **THEN** the left and right chevron buttons SHALL fade in (opacity transition)

#### Scenario: Navigate to previous slide
- **WHEN** the user clicks the left chevron
- **THEN** the slider SHALL display the previous slide (wrapping to last if on first)

#### Scenario: Navigate to next slide
- **WHEN** the user clicks the right chevron
- **THEN** the slider SHALL display the next slide (wrapping to first if on last)

#### Scenario: Auto-rotate continues after manual navigation
- **WHEN** the user navigates via chevron and then stops hovering
- **THEN** auto-rotate SHALL resume from the current slide after 5 seconds
