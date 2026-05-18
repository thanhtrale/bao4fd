## ADDED Requirements

### Requirement: NuxtJS 3 project initialization
The system SHALL be a NuxtJS 3 project with TypeScript enabled and Vue 3 Composition API.

#### Scenario: Project runs in development mode
- **WHEN** developer runs `npm run dev`
- **THEN** Nuxt dev server starts successfully on localhost

#### Scenario: Project builds for production
- **WHEN** developer runs `npm run build`
- **THEN** Nuxt builds successfully with Vercel preset

### Requirement: Layered folder structure
The project SHALL follow a layered architecture with Transport (`server/api/`), Service (`server/services/`), and Utility (`server/utils/`) layers.

#### Scenario: API route accesses service layer
- **WHEN** an API route handler needs business logic
- **THEN** it imports and calls a function from `server/services/`

#### Scenario: Service layer accesses Supabase
- **WHEN** a service function needs database access
- **THEN** it uses the Supabase client from `server/utils/supabase.ts`
