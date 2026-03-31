# Milestone 6: Teaching Tools

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

Build a utility hub that presents a grid of interactive tool cards organized by category. All roles (admin, teacher, student) can access every tool. Users can favorite tools to pin them at the top, search by name, and open any tool in a full-page view with breadcrumb navigation back to the grid.

## Overview

The Teaching Tools section has two states: the grid view (default) showing all tools organized by category with a favorites row, and the tool detail view (full-page) showing the selected tool's interface. The grid-to-detail transition replaces the grid entirely, and the breadcrumb provides the path back. There are 15 tools across 4 categories.

## Key Functionality

- **Tool grid by category**: visually rich cards grouped under category headings; responsive layout (4 columns desktop, 2 tablet, 1 mobile)
- **Favorites row**: pinned tools appear at the top of the grid in a horizontal row; hidden when empty
- **Star/heart toggle**: each card has a favorite toggle icon; clicking pins or unpins the tool
- **Search bar**: text filter above the grid to quickly find tools by name
- **Full-page tool view**: clicking a card replaces the grid with the tool's dedicated interface
- **Breadcrumb navigation**: "Herramientas > [Tool Name]" shown at the top of the full-page view; clicking "Herramientas" returns to the grid
- **15 tools across 4 categories**:
  - **Teaching & Classroom** (4): Random Student Picker, Countdown Timer / Stopwatch, Noise Level Monitor, Task Organizer / Checklist
  - **File Converters** (3): PDF to Word / Word to PDF, Image Format Converter, CSV to JSON / JSON to CSV
  - **Media Tools** (4): YouTube Video Downloader, Image Compressor / Resizer, QR Code Generator, Screenshot to Text (OCR)
  - **Productivity** (4): Quick Notes / Scratchpad, Scientific Calculator, Text Diff Comparator, Password Generator

## Components Provided

| File | Description |
|------|-------------|
| `sections/teaching-tools/components/TeachingTools.tsx` | Root component with grid view and full-page tool routing |
| `sections/teaching-tools/components/ToolCard.tsx` | Single tool card with icon, name, description, and favorite toggle |
| `sections/teaching-tools/components/index.ts` | Barrel exports (`TeachingTools`, `ToolCard`, `FavoritePill`) |

## Props Reference

### TeachingToolsProps (top-level)

| Prop | Type | Description |
|------|------|-------------|
| `tools` | `Tool[]` | All available tools |
| `categories` | `ToolCategory[]` | Tool categories with ordering |
| `favorites` | `Favorite[]` | Current user's favorited tool associations |
| `onSelectTool` | `(toolId: string) => void` | Called when a tool card is clicked to open full-page |
| `onBackToGrid` | `() => void` | Called when breadcrumb navigates back to the grid |
| `onToggleFavorite` | `(toolId: string) => void` | Called when favorite toggle is clicked |
| `onSearch` | `(query: string) => void` | Called when search input changes |

### Tool data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Tool identifier |
| `name` | `string` | Tool display name |
| `description` | `string` | Short description |
| `categoryId` | `string` | Parent category identifier |
| `icon` | `string` | Icon name (from lucide-react) |
| `color` | `ToolColor` | Card accent color (lime, amber, red, sky, violet, etc.) |

### ToolCategory data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Category identifier |
| `name` | `string` | Category display name |
| `slug` | `string` | URL-safe slug |
| `order` | `number` | Display order |

### Favorite data shape

| Field | Type | Description |
|-------|------|-------------|
| `userId` | `string` | User identifier |
| `toolId` | `string` | Tool identifier |

## Expected User Flows

### Flow 1: User browses and opens a tool
1. User opens Teaching Tools and sees the grid with tools grouped by category (Teaching & Classroom, File Converters, Media Tools, Productivity)
2. User scrolls through the grid and clicks "QR Code Generator"
3. The grid is replaced by the QR Code Generator's full-page interface
4. User uses the tool, then clicks "Herramientas" in the breadcrumb to return to the grid

### Flow 2: User favorites a tool
1. User sees the grid view with no favorites row (empty)
2. User clicks the star icon on the "Countdown Timer" card — `onToggleFavorite` fires
3. The "Countdown Timer" now appears in the Favorites row at the top of the grid
4. User clicks the star again — the tool is removed from favorites, the row hides if empty

### Flow 3: User searches for a tool
1. User types "calc" in the search bar at the top of the grid
2. The grid filters to show only "Scientific Calculator"
3. User clears the search — all tools reappear grouped by category

## Empty States

- **No search results**: "No se encontraron herramientas" / "No tools found" with a suggestion to adjust the search term
- **No favorites**: The Favorites row is simply hidden (not shown at all)
- **Tool not available**: If a tool's interface is not yet implemented, show a "Proximamente" / "Coming soon" placeholder within the full-page view

## Testing

Refer to `sections/teaching-tools/tests.md` for detailed test specs covering:
- Grid renders all 15 tools across 4 categories
- Categories display in correct order
- Search filtering by tool name
- Favorite toggle adds/removes tools from the favorites row
- Tool card click opens full-page view
- Breadcrumb navigation returns to grid
- Responsive grid columns at each breakpoint

## Files to Reference

| File | Purpose |
|------|---------|
| `product/sections/teaching-tools/spec.md` | Full section specification |
| `product/sections/teaching-tools/types.ts` | TypeScript interfaces |
| `product/sections/teaching-tools/data.json` | Sample data with all 15 tools |
| `sections/teaching-tools/components/TeachingTools.tsx` | Root teaching tools component |
| `sections/teaching-tools/components/ToolCard.tsx` | Tool card + FavoritePill components |

## Done When

- [ ] Teaching Tools section renders inside the AppShell
- [ ] All 15 tools display in a grid grouped by their 4 categories
- [ ] Categories appear in the correct order (Teaching & Classroom, File Converters, Media Tools, Productivity)
- [ ] Each tool card shows icon, name, description, and favorite toggle
- [ ] Cards use their assigned accent colors
- [ ] Grid is responsive: 4 columns on desktop, 2 on tablet, 1 on mobile
- [ ] Search bar filters tools by name in real time
- [ ] Favorite toggle pins/unpins a tool to the Favorites row
- [ ] Favorites row appears at the top when there are favorites, hidden when empty
- [ ] Clicking a tool card replaces the grid with the tool's full-page interface
- [ ] Breadcrumb "Herramientas > [Tool Name]" displays at the top of the full-page view
- [ ] Clicking the breadcrumb returns to the grid
- [ ] Each tool has its own self-contained interface (or "Coming soon" placeholder)
- [ ] Empty state for no search results displays properly
