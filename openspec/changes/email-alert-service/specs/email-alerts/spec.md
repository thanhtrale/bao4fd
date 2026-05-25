## ADDED Requirements

### Requirement: System sends failure digest email on batch completion
When an import batch completes with failed jobs, the system SHALL send an email to the configured ADMIN_EMAIL containing a summary of all failed imports.

#### Scenario: Batch with failures
- **WHEN** a batch finishes processing and has jobs with status 'failed'
- **THEN** the system SHALL send an email listing each failed URL, its error_message, and the timestamp

#### Scenario: Batch with no failures
- **WHEN** a batch finishes processing and all jobs are published
- **THEN** no email SHALL be sent

#### Scenario: SMTP not configured
- **WHEN** SMTP environment variables are missing or empty
- **THEN** the system SHALL skip email sending and log a warning to console
