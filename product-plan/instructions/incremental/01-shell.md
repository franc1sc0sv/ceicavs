# Milestone 1: Application Shell

Provide alongside: `product-overview.md`

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Set up the design tokens, application shell, and navigation infrastructure that every subsequent section will render inside. By the end of this milestone the user should be able to log in, see a sidebar with role-appropriate nav items, toggle dark/light mode, switch language (ES/EN), and navigate between placeholder pages.

## Overview

The CEICAVS shell is a sidebar-based layout with role-aware navigation, a top header bar, dark/light mode toggle, and a language switcher. The sidebar adapts its visible items based on the authenticated user's role (admin, teacher, student) and responsively collapses on smaller screens. Internationalization uses `react-i18next` with namespaced JSON locale files.

## Key Functionality

- **Design tokens** configured: indigo primary, amber secondary, slate neutral palette; Inter for headings and body, JetBrains Mono for monospace
- **Light mode**: slate-50 background, white surfaces, slate-200 borders, indigo-600 accent
- **Dark mode**: slate-950 background, slate-900 surfaces, slate-800 borders, indigo-400 accent
- **Sidebar navigation** with 6 items:
  - Dashboard (LayoutDashboard icon)
  - Asistencia (ClipboardCheck icon)
  - Personas (Users icon)
  - Blog (PenSquare icon)
  - Herramientas (Wrench icon)
  - Transcripcion IA (AudioLines icon)
- **Role-based visibility**: Students only see Dashboard, Asistencia, Blog, Herramientas (Personas and Transcripcion IA are hidden)
- **Active nav item**: indigo-600 text + indigo-50 bg (light), indigo-400 text + indigo-500/10 bg (dark)
- **User menu** at sidebar bottom: avatar with initials, name, role badge (Admin = indigo, Docente = amber, Estudiante = emerald), dropdown with language switcher, theme toggle, logout
- **Top header bar**: breadcrumb/section title (left), dark/light toggle, ES/EN switcher, notification bell placeholder (right); hamburger on mobile
- **Responsive**: full sidebar (256px) on desktop, icon-only (72px) on tablet, hidden drawer on mobile
- **i18n**: `react-i18next` with namespace-per-section JSON files (`common`, `attendance`, `blog`, `people`, `tools`, `transcription`), Spanish default, lazy-loaded section namespaces

## Components Provided

| File | Description |
|------|-------------|
| `shell/components/AppShell.tsx` | Root layout: sidebar + header + content area |
| `shell/components/MainNav.tsx` | Sidebar navigation with role filtering |
| `shell/components/UserMenu.tsx` | User avatar, name, role badge, dropdown actions |
| `shell/components/index.ts` | Barrel exports |

## Props Reference

### AppShell

| Prop | Type | Description |
|------|------|-------------|
| `role` | `'admin' \| 'teacher' \| 'student'` | Current user role, controls nav visibility |
| `userName` | `string` | Display name for UserMenu |
| `userRole` | `string` | Role label (Admin / Docente / Estudiante) |
| `children` | `ReactNode` | Page content rendered in the main area |
| `onNavigate` | `(path: string) => void` | Called when a nav item is clicked |
| `onLogout` | `() => void` | Called when logout is selected |
| `onToggleTheme` | `() => void` | Called when dark/light toggle is clicked |
| `onLanguageChange` | `(lang: string) => void` | Called when language is switched |

### MainNav

| Prop | Type | Description |
|------|------|-------------|
| `role` | `'admin' \| 'teacher' \| 'student'` | Filters visible nav items |
| `activePath` | `string` | Current route path for highlighting |
| `onNavigate` | `(path: string) => void` | Navigation callback |

### UserMenu

| Prop | Type | Description |
|------|------|-------------|
| `userName` | `string` | User's display name |
| `userRole` | `'admin' \| 'teacher' \| 'student'` | Role for badge color |
| `onLogout` | `() => void` | Logout action |
| `onToggleTheme` | `() => void` | Theme toggle action |
| `onLanguageChange` | `(lang: string) => void` | Language switch action |

## Expected User Flows

### Flow 1: Admin navigates the shell
1. Admin logs in and sees the full sidebar with all 6 nav items
2. Admin clicks "Asistencia" — the nav item highlights, content area loads the Attendance page
3. Admin clicks the dark mode toggle in the header — the entire UI switches to dark theme
4. Admin opens the user menu and clicks "Logout"

### Flow 2: Student sees restricted navigation
1. Student logs in and sees only 4 nav items (Dashboard, Asistencia, Blog, Herramientas)
2. Student cannot see or access Personas or Transcripcion IA in the sidebar
3. Student switches language from ES to EN — all shell labels update

### Flow 3: Mobile responsive behavior
1. User opens the app on a phone — sidebar is hidden, header shows hamburger icon
2. User taps hamburger — sidebar slides in as a drawer with overlay backdrop
3. User selects a nav item — drawer closes, content updates
4. User taps outside the drawer — drawer closes

## Empty States

- No specific empty states for the shell itself. Each section handles its own empty states.
- If the user has no role assigned, show an access-denied message in the content area.

## Testing

Refer to `sections/shell/tests.md` for detailed test specs covering:
- Nav items rendered per role
- Active item highlighting
- Dark/light mode persistence
- Language switching
- Responsive breakpoints

## Files to Reference

| File | Purpose |
|------|---------|
| `product/shell/spec.md` | Full shell specification |
| `product/design-system/colors.json` | Color token definitions |
| `product/design-system/typography.json` | Font family definitions |
| `product/product-overview.md` | Role definitions and sidebar visibility rules |
| `shell/components/AppShell.tsx` | Shell layout component |
| `shell/components/MainNav.tsx` | Navigation component |
| `shell/components/UserMenu.tsx` | User menu component |
| `data-shapes/shell/types.ts` | Shell type definitions (if exported) |

## Done When

- [ ] Design tokens are configured (indigo/amber/slate palette, Inter + JetBrains Mono fonts)
- [ ] Dark and light mode toggle works and persists preference
- [ ] AppShell renders with sidebar, header, and content area
- [ ] All 6 nav items display for admin and teacher roles
- [ ] Student sees only 4 nav items (Personas and Transcripcion IA hidden)
- [ ] Active nav item is visually highlighted
- [ ] User menu shows name, role badge with correct color, and dropdown actions
- [ ] Language switcher toggles between ES and EN and updates shell labels
- [ ] `react-i18next` is configured with namespaced JSON locale files
- [ ] Sidebar collapses to icon-only on tablet (md breakpoint)
- [ ] Sidebar is fully hidden on mobile with hamburger-triggered drawer
- [ ] Navigation callbacks fire correctly and update the active route
- [ ] Logout callback fires from user menu
