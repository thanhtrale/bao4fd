## ADDED Requirements

### Requirement: Server-side Supabase client
The system SHALL provide a server-side Supabase client configured with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` environment variables, using the connection pooler.

#### Scenario: Supabase client is available in API routes
- **WHEN** an API route needs to query the database
- **THEN** it uses `useSupabaseAdmin()` from `server/utils/supabase.ts` which returns a configured Supabase client

#### Scenario: Environment variables are missing
- **WHEN** Supabase environment variables are not set
- **THEN** the client creation SHALL throw a clear error message indicating which variable is missing

### Requirement: Environment variable configuration
The system SHALL use environment variables for all third-party service credentials with placeholder values in `.env.example`.

#### Scenario: Developer sets up project
- **WHEN** a new developer clones the repository
- **THEN** they can copy `.env.example` to `.env` and fill in their credentials
