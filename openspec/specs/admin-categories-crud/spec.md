## ADDED Requirements

### Requirement: Categories list in admin
The admin panel SHALL display a list of all categories with name, slug, article count, and action buttons (edit, delete).

#### Scenario: Admin views categories
- **WHEN** admin navigates to `/admin/categories`
- **THEN** all categories are displayed in a table ordered by sort_order

### Requirement: Create category
The admin panel SHALL allow creating a new category with name, slug, description, and sort_order.

#### Scenario: Create category with valid data
- **WHEN** admin submits the create form with name "Technology" and slug "technology"
- **THEN** the category is created and admin is redirected to categories list

#### Scenario: Create category with duplicate slug
- **WHEN** admin submits a slug that already exists
- **THEN** the system SHALL display a validation error

### Requirement: Edit category
The admin panel SHALL allow editing an existing category.

#### Scenario: Edit category successfully
- **WHEN** admin updates category name and submits
- **THEN** the category is updated and admin is redirected to categories list

### Requirement: Delete category
The admin panel SHALL allow deleting a category that has no articles.

#### Scenario: Delete empty category
- **WHEN** admin deletes a category with no articles
- **THEN** the category is removed and list is refreshed

#### Scenario: Delete category with articles
- **WHEN** admin attempts to delete a category that has articles
- **THEN** the system SHALL display an error "Cannot delete category with existing articles"
