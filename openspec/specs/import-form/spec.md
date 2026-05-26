## Requirements

### Requirement: Multi-source article browser
The import form SHALL provide pill-based source selection (VNExpress, Tuổi Trẻ) to browse and select articles for import.

#### Scenario: Select source
- **WHEN** admin clicks a source pill (e.g., "VNExpress" or "Tuổi Trẻ")
- **THEN** system fetches categories from that source and displays them as checkboxes

#### Scenario: Fetch articles from categories
- **WHEN** admin selects categories, sets a per-category limit, and clicks "Fetch bài viết"
- **THEN** system fetches articles from each selected category and displays them with checkboxes, titles, and category badges

#### Scenario: Add articles to import queue
- **WHEN** admin selects articles and clicks "Thêm vào import"
- **THEN** system auto-maps categories (find-or-create by name) and adds articles to the import queue with per-article category IDs

### Requirement: Import queue with per-article categories
The import form SHALL maintain an import queue where each article has its own category assignment.

#### Scenario: Queue display
- **WHEN** articles are in the import queue
- **THEN** each article shows its title, URL, category badge, and a remove button

#### Scenario: Submit import
- **WHEN** admin clicks "Submit Import"
- **THEN** system sends `{ articles: [{ url, categoryId }] }` to the bulk-import API

### Requirement: Manual URL entry
The import form SHALL provide a textarea for pasting URLs manually (one per line) with a category dropdown.

#### Scenario: Add manual URLs
- **WHEN** admin pastes multiple URLs and selects a category and clicks "Thêm"
- **THEN** all valid URLs are added to the import queue with the selected category

### Requirement: Auto-category mapping
The system SHALL automatically find or create categories by name when adding browsed articles to the import queue.

#### Scenario: Category exists
- **WHEN** a source category name matches an existing DB category (case-insensitive)
- **THEN** system uses the existing category ID

#### Scenario: Category does not exist
- **WHEN** a source category name has no match in DB
- **THEN** system creates a new category with auto-generated slug and uses its ID
