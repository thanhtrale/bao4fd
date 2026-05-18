## Context

Tailwind is installed. Public pages have been redesigned. Admin panel needs a basic cleanup pass to look consistent and professional without over-investing in admin UI.

## Goals / Non-Goals

**Goals:**
- Replace all inline styles with Tailwind classes
- Consistent button styles (primary blue, danger red, ghost)
- Clean table styling with hover rows
- Proper form input styling
- Presentable login page
- Responsive enough for desktop use (admin is desktop-primary)

**Non-Goals:**
- Full admin redesign or dashboard widgets
- Dark mode for admin
- Fancy animations or interactions
- Mobile-optimized admin

## Decisions

1. **Minimal approach** — Use Tailwind utilities directly, no custom admin components. Just clean up what's there.

2. **Button variants** — Primary (bg-blue-600 text-white), Danger (bg-red-600 text-white), Ghost (border text-gray-700). Consistent padding/rounding.

3. **Tables** — Full width, striped rows (even:bg-gray-50), header bg-gray-100, hover highlight.

4. **Forms** — Inputs: border rounded px-3 py-2, focus ring blue. Labels: font-medium text-sm.

5. **Admin header** — White bg, subtle bottom border, nav links with active state. Simple.

## Risks / Trade-offs

- **No component extraction** — repeating utility classes across admin pages. Acceptable for small admin with 5 pages.
- **Desktop-only** — admin on mobile will be usable but not optimized. OK for internal tool.
