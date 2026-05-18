## ADDED Requirements

### Requirement: Categories table
The database SHALL have a `categories` table with columns: id (uuid PK), name (text NOT NULL), slug (text UNIQUE NOT NULL), description (text NULL), sort_order (int DEFAULT 0), created_at (timestamptz DEFAULT now()), updated_at (timestamptz DEFAULT now()).

#### Scenario: Category is created with valid data
- **WHEN** a row is inserted with name and slug
- **THEN** id is auto-generated, created_at and updated_at are set to current time

#### Scenario: Duplicate slug is rejected
- **WHEN** a row is inserted with a slug that already exists
- **THEN** the database SHALL reject the insert with a unique constraint violation

### Requirement: Articles table
The database SHALL have an `articles` table with columns: id (uuid PK), title (text NOT NULL), slug (text UNIQUE NOT NULL), excerpt (text NULL), content (text NOT NULL), thumbnail (text NULL), category_id (uuid FK NOT NULL referencing categories ON DELETE RESTRICT), is_published (bool DEFAULT false), published_at (timestamptz NULL), created_at (timestamptz DEFAULT now()), updated_at (timestamptz DEFAULT now()).

#### Scenario: Article references valid category
- **WHEN** an article is inserted with a valid category_id
- **THEN** the article is created successfully

#### Scenario: Article references non-existent category
- **WHEN** an article is inserted with a category_id that does not exist
- **THEN** the database SHALL reject with a foreign key violation

#### Scenario: Category with articles cannot be deleted
- **WHEN** a category is deleted that has articles referencing it
- **THEN** the database SHALL reject with ON DELETE RESTRICT

### Requirement: Article daily views table
The database SHALL have an `article_daily_views` table with columns: id (bigint GENERATED ALWAYS AS IDENTITY PK), article_id (uuid FK NOT NULL referencing articles ON DELETE CASCADE), view_date (date NOT NULL DEFAULT CURRENT_DATE), view_count (int NOT NULL DEFAULT 1), with UNIQUE constraint on (article_id, view_date).

#### Scenario: First view of article today
- **WHEN** a view is recorded for an article with no entry for today
- **THEN** a new row is inserted with view_count = 1

#### Scenario: Subsequent view of article today
- **WHEN** a view is recorded for an article that already has a row for today
- **THEN** the existing row's view_count is incremented by 1

### Requirement: Database indexes
The database SHALL have indexes optimized for: category listing by slug, article listing by published status and date, article lookup by slug, category filtering with published articles, and daily view ranking.

#### Scenario: Home page query performance
- **WHEN** querying published articles ordered by published_at DESC
- **THEN** the query uses idx_art_published index
