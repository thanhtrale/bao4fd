## ADDED Requirements

### Requirement: Article card component
Consistent card design for article listings.

#### Scenario: Card displays article info
- **WHEN** ArticleCard renders
- **THEN** it shows: thumbnail (aspect-video, rounded-lg), category pill (colored by category), title (font-semibold, max 2 lines), excerpt (max 2 lines, text-slate-600), relative time

#### Scenario: Card hover effect
- **WHEN** user hovers over a card
- **THEN** card scales to 1.02, shadow increases, transition is smooth (200ms ease-out)

#### Scenario: Relative time display
- **WHEN** article was published < 1 hour ago → "X phút trước"
- **WHEN** article was published < 24 hours ago → "X giờ trước"
- **WHEN** article was published < 7 days ago → "X ngày trước"
- **WHEN** article was published >= 7 days ago → formatted date "dd/MM/yyyy"

#### Scenario: Category color badge
- **WHEN** article belongs to a category
- **THEN** a small pill/badge with the category name is shown in the category's assigned color (bg + text)

### Requirement: Most Viewed widget
Sidebar widget showing trending articles.

#### Scenario: Numbered list with view counts
- **WHEN** MostViewed renders
- **THEN** articles are shown as a numbered list (1-5) with large number, title, and view count badge

#### Scenario: Visual hierarchy of numbers
- **WHEN** displaying rank numbers
- **THEN** #1 has accent color, #2-3 are darker, #4-5 are muted — creating visual hierarchy

### Requirement: Home category sections
Each category shows a grid of article cards.

#### Scenario: Section with header and view-all link
- **WHEN** a category section renders on home
- **THEN** it shows: category name (with colored left border), grid of 4 cards (responsive columns), "Xem tất cả →" link

### Requirement: Category list page layout
Horizontal list for category archive pages.

#### Scenario: Article row with thumbnail
- **WHEN** category page renders article list
- **THEN** each article shows as horizontal row: thumbnail (left, fixed width), title + excerpt + meta (right)

#### Scenario: Styled pagination
- **WHEN** pagination renders (desktop)
- **THEN** shows: Prev/Next buttons, page numbers with active state (bg-accent text-white rounded), ellipsis for large ranges
