## ADDED Requirements

### Requirement: Articles list in admin
The admin panel SHALL display a paginated list of all articles (published and draft) with title, category, status, published_at, and action buttons.

#### Scenario: Admin views articles
- **WHEN** admin navigates to `/admin/articles`
- **THEN** all articles are displayed in a table ordered by created_at DESC

### Requirement: Create article
The admin panel SHALL allow creating a new article with title, slug, excerpt, content, category, thumbnail upload, and publish status.

#### Scenario: Create article with valid data
- **WHEN** admin fills in all required fields and submits
- **THEN** the article is created and admin is redirected to articles list

#### Scenario: Create article missing required fields
- **WHEN** admin submits without title or content
- **THEN** the system SHALL display validation errors for missing fields

#### Scenario: Publish article
- **WHEN** admin checks "Published" checkbox and submits
- **THEN** the article is_published is set to true and published_at is set to current time

### Requirement: Edit article
The admin panel SHALL allow editing an existing article including changing thumbnail.

#### Scenario: Edit article successfully
- **WHEN** admin updates article fields and submits
- **THEN** the article is updated and admin is redirected to articles list

### Requirement: Delete article
The admin panel SHALL allow deleting an article.

#### Scenario: Delete article
- **WHEN** admin confirms deletion of an article
- **THEN** the article and its daily views are removed (CASCADE)
