## ADDED Requirements

### Requirement: Admin can monitor import progress in real-time
The system SHALL provide a page at `/admin/imports` showing all import batches with their progress. Each batch SHALL display total URLs, and counts by status (pending, processing, published, failed). Status updates SHALL appear in real-time via Supabase Realtime.

#### Scenario: View batch list
- **WHEN** admin navigates to the import dashboard
- **THEN** the system SHALL display batches ordered by newest first, each with a progress bar and status counts

#### Scenario: Real-time status update
- **WHEN** a job status changes in the database
- **THEN** the dashboard SHALL update the corresponding batch's counts without page refresh

#### Scenario: Navigate to new import
- **WHEN** admin clicks the "New Import" button on the dashboard
- **THEN** the system SHALL navigate to `/admin/imports/new`
