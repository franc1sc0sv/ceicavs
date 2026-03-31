# Application Shell

The shell provides the persistent navigation and layout that wraps every section of the CEICAVS platform.

## Layout

- **Sidebar:** Fixed left, 256px wide on desktop. Contains brand area, navigation items, and user menu.
- **Header bar:** Fixed top of the content area, 64px tall. Shows breadcrumb/section title (left) and action buttons (right).
- **Content area:** Scrollable, fills remaining width. Section components render here.

## Navigation Structure

### Admin & Teacher (6 items)

| Item                | Icon (lucide-react)  | Route              |
|---------------------|----------------------|--------------------|
| Dashboard           | `LayoutDashboard`    | `/`                |
| Asistencia          | `ClipboardCheck`     | `/attendance`      |
| Personas            | `Users`              | `/people`          |
| Blog                | `PenSquare`          | `/blog`            |
| Herramientas        | `Wrench`             | `/teaching-tools`  |
| Transcripcion IA    | `AudioLines`         | `/ai-transcription`|

### Student (4 items)

Students see only: Dashboard, Asistencia, Blog, Herramientas. The Personas and Transcripcion IA items are completely hidden.

## User Menu

Located at the bottom of the sidebar:

- **Avatar:** User initials with indigo tint background
- **Name and role badge:** Role badge colors -- Admin (indigo), Teacher/Docente (amber), Student/Estudiante (emerald)
- **Dropdown menu:** Language switcher (ES/EN), Dark/Light mode toggle, Logout

## Header Bar

- **Left:** Breadcrumb or current section title
- **Right:** Dark/light mode toggle (icon button), language switcher (ES/EN button), notification bell placeholder
- **Mobile only:** Hamburger menu trigger on the left

## Responsive Behavior

| Breakpoint    | Sidebar                                 | Header                          |
|---------------|-----------------------------------------|---------------------------------|
| Desktop (lg+) | Full sidebar with icons and labels, always visible | Above content area    |
| Tablet (md)   | Collapsed to 72px (icons only), expands on hover/click | Above content area |
| Mobile (< md) | Fully hidden, opens as slide-over drawer with backdrop | Shows hamburger + brand + actions |

## Internationalization (i18n)

- **Library:** react-i18next with namespaced JSON locale files
- **Default language:** Spanish (es), secondary: English (en)
- **Namespaces:** `common`, `attendance`, `blog`, `people`, `tools`, `transcription`
- **Lazy loading:** Only the active section's namespace is loaded
- **Adding a language:** Create a new folder under `locales/[lang-code]/` with the same JSON files, then register the language code

## Dark / Light Mode

| Element          | Light                          | Dark                            |
|------------------|--------------------------------|---------------------------------|
| Sidebar          | `white` + `slate-200` border   | `slate-900` + `slate-800` border |
| Background       | `slate-50`                     | `slate-950`                     |
| Surface          | `white`                        | `slate-900`                     |
| Primary accent   | `indigo-600`                   | `indigo-400`                    |
| Active nav item  | `indigo-600` text + `indigo-50` bg | `indigo-400` text + `indigo-500/10` bg |
| Hover            | `slate-100` bg                 | `slate-800` bg                  |

Toggle is accessible from both the header bar (icon button) and the user menu dropdown.

## Components

| File              | Purpose                                              |
|-------------------|------------------------------------------------------|
| `AppShell.tsx`    | Root layout: sidebar + header + content slot          |
| `MainNav.tsx`     | Navigation items with role-based filtering            |
| `UserMenu.tsx`    | User avatar, name, role badge, and dropdown actions   |
| `index.ts`        | Barrel export for all shell components                |

## Design Notes

- **Font:** Inter for all shell text
- **Icons:** lucide-react
- **Transitions:** 200ms ease for sidebar expand/collapse and drawer open/close
- **Active state:** indigo-600 text with indigo-50 background (light), indigo-400 text with indigo-500/10 background (dark)
- **Role badge colors:** Admin = indigo, Teacher = amber, Student = emerald
