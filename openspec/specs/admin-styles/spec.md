## ADDED Requirements

### Requirement: Admin layout styled
Admin header and shell use Tailwind classes consistently.

#### Scenario: Admin header
- **WHEN** admin layout renders
- **THEN** header has white background, bottom border, nav links (Articles, Categories), logout button, and "← Back to site" link

#### Scenario: Admin content area
- **WHEN** admin page renders
- **THEN** content is in a padded container (max-w-6xl mx-auto px-4 py-6)

### Requirement: Styled tables
Article and category lists use clean table styling.

#### Scenario: Table appearance
- **WHEN** a data table renders
- **THEN** it has: full width, header row (bg-gray-100 font-medium), striped body rows (even:bg-gray-50), hover highlight, proper cell padding

### Requirement: Styled form inputs
Create/edit forms have consistent input styling.

#### Scenario: Input fields
- **WHEN** form inputs render
- **THEN** they have: border, rounded, proper padding, focus ring (blue), label above (font-medium text-sm)

#### Scenario: Submit buttons
- **WHEN** form has action buttons
- **THEN** primary button is blue (bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700), danger is red

### Requirement: Login page styled
Login page looks presentable and centered.

#### Scenario: Login form appearance
- **WHEN** login page renders
- **THEN** shows centered card (max-w-md, shadow, rounded, padding) with logo, email/password inputs, submit button, and Google OAuth button
