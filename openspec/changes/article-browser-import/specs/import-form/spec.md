## MODIFIED Requirements

### Requirement: Import form page
The import form page SHALL include an article browser section that allows users to fetch, preview, and select articles from a VNExpress URL before importing.

#### Scenario: Enter category URL and fetch articles
- **WHEN** user enters a VNExpress category URL and clicks "Fetch"
- **THEN** system fetches article listing and displays articles with checkboxes, titles, and category badges

#### Scenario: Enter homepage URL
- **WHEN** user enters a VNExpress homepage URL and clicks "Fetch"
- **THEN** system shows a list of categories with checkboxes for user to select, then a "Fetch Articles" button

#### Scenario: Select all articles
- **WHEN** articles are displayed and user clicks "Select All"
- **THEN** all article checkboxes are checked

#### Scenario: Deselect all articles
- **WHEN** all articles are selected and user clicks "Deselect All"
- **THEN** all article checkboxes are unchecked

#### Scenario: Add selected articles to import
- **WHEN** user selects articles and clicks "Add to Import"
- **THEN** selected article URLs are appended to the URL textarea

#### Scenario: Configurable article limit
- **WHEN** user sets the limit input to a value (default 10)
- **THEN** the fetch request uses that limit to control how many articles are returned

#### Scenario: Manual URL entry preserved
- **WHEN** user prefers to paste URLs directly
- **THEN** the URL textarea remains available and functional without using the browser
