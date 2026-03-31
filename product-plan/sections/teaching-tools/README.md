# Teaching Tools

## Overview

A utility hub presenting a grid of interactive tool cards organized by category. All users (admins, teachers, students) can access any tool. Users can favorite tools to pin them at the top of the grid. Selecting a tool replaces the grid with the tool's full-page interface, with breadcrumb navigation to return.

## Components Provided

- `TeachingTools` — Top-level container managing the grid view and full-page tool view. Displays category-grouped cards with a favorites row at the top and a search bar for filtering.
- `ToolCard` — A visually rich card for a single tool displaying an icon, color accent, title, and short description. Includes a star/heart toggle for favoriting.
- `FavoritePill` — A compact pill/chip shown in the "Favorites" row at the top of the grid, representing a pinned tool for quick access.

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onSelectTool(toolId: string)` | User clicks a tool card to open its full-page interface |
| `onBackToGrid()` | User clicks the breadcrumb to return from a tool's full-page view to the grid |
| `onToggleFavorite(toolId: string)` | User clicks the star/heart icon on a tool card to pin or unpin it |
| `onSearch(query: string)` | User types in the search bar to filter tools by name |

## Tools (15 across 4 categories)

**Teaching & Classroom** — Random Student Picker, Countdown Timer / Stopwatch, Noise Level Monitor, Task Organizer / Checklist

**File Converters** — PDF to Word / Word to PDF, Image Format Converter (PNG, JPG, WebP), CSV to JSON / JSON to CSV

**Media Tools** — YouTube Video Downloader, Image Compressor / Resizer, QR Code Generator, Screenshot to Text (OCR)

**Productivity** — Quick Notes / Scratchpad, Scientific Calculator, Text Diff Comparator, Password Generator

## Data Shapes

**`Tool`** — A tool entry: `id`, `name`, `description`, `categoryId`, `icon`, `color` (ToolColor).

**`ToolCategory`** — A category: `id`, `name`, `slug`, `order`.

**`Favorite`** — A user-tool favorite: `userId`, `toolId`.

**`ToolColor`** — One of: lime, amber, red, sky, rose, violet, emerald, orange, stone, cyan, yellow, indigo, teal, fuchsia.

**`TeachingToolsProps`** — Top-level: `tools`, `categories`, `favorites`, plus all callbacks.

See `types.ts` for full interface definitions.
