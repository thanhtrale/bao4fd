## ADDED Requirements

### Requirement: JWT verification on protected API routes
The server SHALL verify Supabase JWT tokens on all protected API routes (POST/PUT/DELETE on admin resources).

#### Scenario: Request with valid JWT and admin email
- **WHEN** a request includes a valid Authorization Bearer token with an email in ADMIN_EMAILS
- **THEN** the request proceeds to the handler

#### Scenario: Request with missing token
- **WHEN** a request to a protected route has no Authorization header
- **THEN** the server SHALL respond with HTTP 401 Unauthorized

#### Scenario: Request with invalid or expired token
- **WHEN** a request includes an invalid or expired JWT
- **THEN** the server SHALL respond with HTTP 401 Unauthorized

#### Scenario: Request with valid JWT but non-admin email
- **WHEN** a request includes a valid JWT but the email is NOT in ADMIN_EMAILS
- **THEN** the server SHALL respond with HTTP 403 Forbidden
