## ADDED Requirements

### Requirement: Sticky site header
Header stays fixed at top of viewport during scroll.

#### Scenario: Header displays logo and navigation
- **WHEN** any public page loads
- **THEN** a dark (slate-900) sticky header shows: SVG logo + "Mini News Portal" (left), category nav links (center/desktop), Admin button (right)

#### Scenario: Mobile hamburger menu
- **WHEN** viewport < 768px
- **THEN** category links are hidden, hamburger icon shows, clicking it opens a slide-in sidebar with category links stacked vertically

#### Scenario: Active category highlighted
- **WHEN** user is on a category page
- **THEN** the corresponding nav link has a visual active indicator (underline or background)

### Requirement: Site footer
Branded footer at page bottom.

#### Scenario: Footer content
- **WHEN** any public page loads
- **THEN** footer shows: logo, copyright year, category links grid

### Requirement: Page transitions
Smooth transition between pages.

#### Scenario: Page navigation animates
- **WHEN** user navigates between pages (via NuxtLink)
- **THEN** content fades in with a subtle transition (150-200ms)

### Requirement: Responsive content shell
All content is constrained and centered.

#### Scenario: Max width applied
- **WHEN** viewport > 1280px
- **THEN** main content area is max 1280px wide, centered horizontally with padding

### Requirement: SVG brand icon
Custom SVG icon representing a news portal.

#### Scenario: Logo displays correctly
- **WHEN** header renders
- **THEN** a 32x32 SVG icon is shown next to the brand text, renders crisp at all sizes
