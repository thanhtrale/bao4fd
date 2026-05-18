## ADDED Requirements

### Requirement: Admin login with email/password
The system SHALL allow admin users to log in via email and password using Supabase Auth.

#### Scenario: Successful login with valid credentials
- **WHEN** user submits valid email and password on `/admin/login`
- **THEN** the system authenticates via Supabase Auth and redirects to `/admin`

#### Scenario: Login with invalid credentials
- **WHEN** user submits invalid email or password
- **THEN** the system SHALL display an error message and remain on the login page

#### Scenario: Login with non-admin email
- **WHEN** user logs in with valid Supabase credentials but email is NOT in ADMIN_EMAILS allowlist
- **THEN** the system SHALL deny access and display "Unauthorized" message

### Requirement: Admin login with Google OAuth
The system SHALL allow admin users to log in via Google OAuth using Supabase Auth.

#### Scenario: Successful Google OAuth login
- **WHEN** user clicks "Login with Google" and completes OAuth flow
- **THEN** the system authenticates via Supabase Auth and redirects to `/admin` if email is in allowlist

### Requirement: Admin logout
The system SHALL allow admin users to log out.

#### Scenario: User logs out
- **WHEN** admin user clicks logout
- **THEN** the Supabase session is destroyed and user is redirected to `/admin/login`
