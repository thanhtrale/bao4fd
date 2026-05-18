## MODIFIED Requirements

### Requirement: Hero slider navigation
The hero slider SHALL display prev/next chevron buttons that appear on hover, allowing manual slide navigation.

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
