# Design System

## 1. Color System

| Role | Color | Usage |
|---|---|---|
| Primary accent | `indigo-600` (light) / `indigo-400` (dark) | Buttons, active nav, links, focus rings |
| Secondary accent | `amber-*` | Warnings, highlights |
| Neutral | `slate-*` | Backgrounds, text, borders |

**Role badge colors (badges only):**
- Admin: `indigo`
- Teacher/Docente: `amber`
- Student/Estudiante: `emerald`

Role colors are for badge/chip components only. Main UI accent is always indigo.

**Light mode:** bg `slate-50`, surface `white`, border `slate-200`, text `slate-900`, active nav `indigo-600` + `indigo-50` bg.
**Dark mode:** bg `slate-950`, surface `slate-900`, border `slate-800`, text `slate-100`, active nav `indigo-400` + `indigo-500/10` bg.

## 2. Typography

```css
@theme {
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

- **Inter** (400, 500, 600, 700): headings, body text, UI labels.
- **JetBrains Mono** (400, 500): code blocks, monospace content.
- Load via Google Fonts in `index.css`.

## 3. Responsive Sidebar

| Breakpoint | Sidebar | Behavior |
|---|---|---|
| Desktop (`lg+`) | 256px, full labels | Always visible |
| Tablet (`md`) | 72px, icons only | Expands on hover/click |
| Mobile (`<md`) | Hidden | Slide-over drawer + backdrop |

- Content area starts at sidebar width offset.
- Mobile drawer triggered by hamburger icon in header.

## 4. Dark Mode

All components use Tailwind `dark:` variants:

```tsx
<div className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
  <p className="text-slate-900 dark:text-slate-100">...</p>
</div>
```

- Theme toggle stored in React context (`theme.context.tsx`).
- Every component must have both light and dark variants.
- Never use hardcoded colors without dark counterparts.

## 5. Tailwind v4 Setup

Tailwind v4 uses CSS-first configuration via `@theme` in `index.css`:

```css
@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");

@theme {
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

- No `tailwind.config.js` — Tailwind v4 uses `@theme` directive.
- Plugin: `@tailwindcss/vite` in `vite.config.ts`.
- Custom tokens defined in `@theme {}` block.
