## ADDED Requirements

### Requirement: Tailwind CSS 4 installed and configured
The app must use Tailwind CSS 4 via `@nuxtjs/tailwindcss` module with CSS-first configuration.

#### Scenario: Tailwind utilities available in templates
- **WHEN** a `.vue` file uses Tailwind utility classes (e.g., `class="text-lg font-bold"`)
- **THEN** the styles are applied correctly in both dev and production builds

#### Scenario: Theme customization via CSS @theme
- **WHEN** custom theme values are defined in `@theme` block in `app/assets/css/main.css`
- **THEN** they are available as utility classes throughout the app

### Requirement: Design token system
A consistent set of colors, fonts, and spacing values defined as Tailwind theme extensions.

#### Scenario: Color palette available
- **WHEN** a component uses color utilities (e.g., `text-accent`, `bg-header`)
- **THEN** the custom palette colors are applied: accent (#2563eb), header (#0f172a)

#### Scenario: Inter font loaded
- **WHEN** the app renders any page
- **THEN** Inter font is loaded from Google Fonts and applied as the default sans-serif font

#### Scenario: Category colors defined
- **WHEN** a category slug is used (cong-nghe, kinh-doanh, the-thao, giai-tri, suc-khoe)
- **THEN** a corresponding color is available: blue, emerald, orange, pink, teal

### Requirement: Typography plugin for prose content
Article body content must be styled with proper typographic hierarchy.

#### Scenario: Article content renders with prose styling
- **WHEN** article HTML content is wrapped in a container with `prose` class
- **THEN** headings, paragraphs, lists, and links have appropriate sizes, spacing, and colors

### Requirement: Transition and animation defaults
Base transition utilities for hover effects and page interactions.

#### Scenario: Smooth scroll enabled
- **WHEN** the page loads
- **THEN** `scroll-behavior: smooth` is applied to the html element

#### Scenario: Default transition duration
- **WHEN** elements use transition utilities
- **THEN** a consistent 200-300ms duration with ease-out easing is the default
