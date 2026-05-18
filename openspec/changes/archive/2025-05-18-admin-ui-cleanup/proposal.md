## Why

Admin panel currently uses raw inline styles and looks inconsistent. Apply basic Tailwind styling to make it clean and usable — not a full redesign, just a cleanup pass for consistency with the new design system.

## What Changes

- Restyle admin layout header with Tailwind (simple, functional)
- Clean up admin pages: consistent spacing, table styling, form inputs, buttons
- Add proper button styles (primary/danger variants)
- Style login page to look presentable
- Replace all inline styles with Tailwind utility classes

## Capabilities

### New Capabilities
- `admin-styles`: Basic Tailwind styling for admin layout, tables, forms, buttons, login page

### Modified Capabilities

## Impact

- `app/layouts/admin.vue`: Restyle with Tailwind classes
- `app/pages/admin/login.vue`: Style login form
- `app/pages/admin/index.vue`: Style dashboard
- `app/pages/admin/articles/index.vue`: Style table
- `app/pages/admin/articles/[id].vue`: Style form
- `app/pages/admin/categories/index.vue`: Style table + inline form
