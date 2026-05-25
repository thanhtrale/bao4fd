## ADDED Requirements

### Requirement: Admin can paste URLs into a bulk import form
The system SHALL provide a page at `/admin/imports/new` with a textarea for pasting URLs (one per line, max 100) and a dropdown to select a target category.

#### Scenario: Submit valid URLs
- **WHEN** admin pastes valid VNExpress URLs and selects a category and clicks Submit
- **THEN** the system SHALL call POST /api/admin/bulk-import, show a success notification, and redirect to the import dashboard

#### Scenario: Validation errors
- **WHEN** admin submits with empty textarea or no category selected
- **THEN** the system SHALL show inline validation errors without submitting

#### Scenario: Too many URLs
- **WHEN** admin pastes more than 100 URLs
- **THEN** the system SHALL show a validation error indicating the maximum
