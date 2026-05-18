## ADDED Requirements

### Requirement: Atomic view increment function
The database SHALL provide an `increment_view` RPC function that atomically inserts or updates a row in `article_daily_views` for the given article_id and current date.

#### Scenario: Concurrent view increments
- **WHEN** multiple requests call `increment_view` simultaneously for the same article
- **THEN** all increments SHALL be applied without race conditions using UPSERT

#### Scenario: Function called with valid article_id
- **WHEN** `increment_view` is called with an existing article_id
- **THEN** the view_count for today is incremented by 1
