## ADDED Requirements

### Requirement: Image upload for article thumbnails
The system SHALL allow uploading images to Supabase Storage for article thumbnails.

#### Scenario: Upload valid image
- **WHEN** admin selects an image file (jpg, png, webp) under 2MB
- **THEN** the image is uploaded to Supabase Storage and the public URL is returned

#### Scenario: Upload file exceeding size limit
- **WHEN** admin selects a file larger than 2MB
- **THEN** the system SHALL reject the upload with an error message

#### Scenario: Upload non-image file
- **WHEN** admin selects a non-image file type
- **THEN** the system SHALL reject the upload with an error message
