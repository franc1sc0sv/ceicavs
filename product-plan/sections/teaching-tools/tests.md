# Teaching Tools Tests

## Overview

Tests verify that the Teaching Tools section renders the category-grouped tool grid correctly, manages favorites with pinning/unpinning, handles search filtering, navigates between the grid and full-page tool views via breadcrumbs, and fires all callbacks with the correct arguments.

---

## User Flow Tests

### Flow 1: User browses tools and opens one

**Success Path**

1. Render `TeachingTools` with 15 tools across 4 categories and 2 favorites
2. - [ ] A "Favorites" row appears at the top showing 2 `FavoritePill` components
3. - [ ] Below favorites, tools are grouped by category with section headings: "Teaching & Classroom", "File Converters", "Media Tools", "Productivity"
4. - [ ] Each category group contains the correct number of `ToolCard` components
5. - [ ] Each card shows an icon, title, short description, and color accent matching the tool's `color` prop
6. - [ ] Each card has a star/heart toggle icon
7. Click on the "QR Code Generator" tool card
8. - [ ] `onSelectTool` is called with the QR Code Generator's `toolId`
9. Re-render showing the tool's full-page interface
10. - [ ] The grid is replaced by the tool's full-page UI
11. - [ ] A breadcrumb shows "Teaching Tools > QR Code Generator"
12. Click "Teaching Tools" in the breadcrumb
13. - [ ] `onBackToGrid` is called
14. - [ ] The grid view is restored

**Failure Path**

1. Render `TeachingTools` with an empty `tools` array
2. - [ ] An empty state is shown (e.g., "No tools available")
3. - [ ] The search bar is still visible

### Flow 2: User manages favorites

**Success Path**

1. Render the grid with 15 tools and 0 favorites
2. - [ ] The "Favorites" row is hidden (no favorites yet)
3. Click the star icon on the "Countdown Timer" tool card
4. - [ ] `onToggleFavorite` is called with the Countdown Timer's `toolId`
5. Re-render with the Countdown Timer in the `favorites` array
6. - [ ] The "Favorites" row now appears with 1 `FavoritePill` showing "Countdown Timer"
7. - [ ] The star icon on the Countdown Timer card is filled/highlighted
8. Click the star icon on the same card again (unfavorite)
9. - [ ] `onToggleFavorite` is called again with the same `toolId`
10. Re-render with an empty `favorites` array
11. - [ ] The "Favorites" row is hidden again
12. - [ ] The star icon on the card returns to its unfilled/default state

**Failure Path**

1. Click a `FavoritePill` in the favorites row
2. - [ ] `onSelectTool` is called (favorites row serves as quick access, not just display)

### Flow 3: User searches for a tool

**Success Path**

1. Render the grid with 15 tools
2. Type "PDF" into the search bar
3. - [ ] `onSearch` is called with `"PDF"`
4. Re-render with filtered tools (only those matching "PDF" in the name)
5. - [ ] Only matching tool cards are visible (e.g., "PDF to Word / Word to PDF")
6. - [ ] Category headings with no matching tools are hidden
7. Clear the search bar
8. - [ ] `onSearch` is called with `""`
9. - [ ] All 15 tools are visible again with full category groupings

**Failure Path**

1. Type "xyznonexistent" into the search bar
2. - [ ] No tool cards are visible
3. - [ ] An empty state message is shown (e.g., "No tools match your search")

---

## Empty State Tests

- [ ] When `tools` is empty, a friendly empty state message is displayed
- [ ] When `favorites` is empty, the favorites row is hidden (not shown with an empty label)
- [ ] When search returns no results, a clear "no results" message is shown
- [ ] When a category has 0 tools after filtering, its heading is hidden

---

## Component Interaction Tests

- [ ] Tool grid renders 4 columns on desktop (1024px+), 2 on tablet (640-1023px), 1 on mobile (<640px)
- [ ] `ToolCard` color accent matches the tool's `color` prop (e.g., lime card for a lime tool)
- [ ] Star/heart toggle on `ToolCard` visually changes state for favorited vs. unfavorited tools
- [ ] `FavoritePill` components in the favorites row are clickable and open the corresponding tool
- [ ] Category section headings are correctly ordered by the `order` field on `ToolCategory`
- [ ] Breadcrumb navigation in the full-page tool view shows the correct tool name
- [ ] Search filtering is case-insensitive

---

## Edge Cases

- [ ] A tool with a very long name wraps or truncates properly on the card
- [ ] A tool with a very long description truncates with ellipsis on the card
- [ ] Favoriting all 15 tools renders a scrollable favorites row without layout issues
- [ ] Rapidly clicking the favorite toggle does not cause duplicate callbacks
- [ ] Search with special characters (e.g., "/", "&") does not crash
- [ ] Category with only 1 tool still renders with its heading
- [ ] All 14 possible `ToolColor` values render with visible, distinct color accents

---

## Accessibility Checks

- [ ] Tool cards are keyboard-focusable and activatable with Enter or Space
- [ ] The favorite toggle button has an accessible label (e.g., "Add to favorites" / "Remove from favorites")
- [ ] Category group headings use proper heading levels (e.g., `<h2>` or `role="heading"`)
- [ ] The search bar has a visible label or placeholder text and is keyboard-accessible
- [ ] Breadcrumb navigation uses proper `<nav>` landmark with `aria-label="Breadcrumb"`
- [ ] `FavoritePill` components are keyboard-navigable
- [ ] Color accents on cards are not the sole means of conveying information (icons and text also present)

---

## Sample Test Data

```typescript
import type { Tool, ToolCategory, Favorite } from "./types";

const mockCategories: ToolCategory[] = [
  { id: "cat-1", name: "Teaching & Classroom", slug: "teaching-classroom", order: 1 },
  { id: "cat-2", name: "File Converters", slug: "file-converters", order: 2 },
  { id: "cat-3", name: "Media Tools", slug: "media-tools", order: 3 },
  { id: "cat-4", name: "Productivity", slug: "productivity", order: 4 },
];

const mockTools: Tool[] = [
  { id: "t1", name: "Random Student Picker", description: "Spin wheel or shuffle animation to pick a random student", categoryId: "cat-1", icon: "shuffle", color: "lime" },
  { id: "t2", name: "Countdown Timer / Stopwatch", description: "Configurable countdown timer and stopwatch for class activities", categoryId: "cat-1", icon: "clock", color: "amber" },
  { id: "t3", name: "Noise Level Monitor", description: "Visual meter using microphone input to monitor classroom noise", categoryId: "cat-1", icon: "volume", color: "red" },
  { id: "t4", name: "Task Organizer / Checklist", description: "Create and manage task checklists for classroom activities", categoryId: "cat-1", icon: "check-square", color: "emerald" },
  { id: "t5", name: "PDF to Word / Word to PDF", description: "Convert documents between PDF and Word formats", categoryId: "cat-2", icon: "file-text", color: "sky" },
  { id: "t6", name: "Image Format Converter", description: "Convert images between PNG, JPG, and WebP formats", categoryId: "cat-2", icon: "image", color: "rose" },
  { id: "t7", name: "CSV to JSON / JSON to CSV", description: "Convert data between CSV and JSON formats", categoryId: "cat-2", icon: "database", color: "violet" },
  { id: "t8", name: "YouTube Video Downloader", description: "Paste a URL, select quality, and download YouTube videos", categoryId: "cat-3", icon: "video", color: "red" },
  { id: "t9", name: "Image Compressor / Resizer", description: "Compress and resize images for web or sharing", categoryId: "cat-3", icon: "minimize", color: "orange" },
  { id: "t10", name: "QR Code Generator", description: "Generate QR codes from text or URL input", categoryId: "cat-3", icon: "qr-code", color: "stone" },
  { id: "t11", name: "Screenshot to Text (OCR)", description: "Extract text from screenshots and images using OCR", categoryId: "cat-3", icon: "scan", color: "cyan" },
  { id: "t12", name: "Quick Notes / Scratchpad", description: "Lightweight notepad for quick notes and ideas", categoryId: "cat-4", icon: "edit-3", color: "yellow" },
  { id: "t13", name: "Scientific Calculator", description: "Full-featured scientific calculator with history", categoryId: "cat-4", icon: "calculator", color: "indigo" },
  { id: "t14", name: "Text Diff Comparator", description: "Compare two text blocks and highlight differences", categoryId: "cat-4", icon: "columns", color: "teal" },
  { id: "t15", name: "Password Generator", description: "Generate secure random passwords with custom rules", categoryId: "cat-4", icon: "key", color: "fuchsia" },
];

const mockFavorites: Favorite[] = [
  { userId: "user-1", toolId: "t2" },
  { userId: "user-1", toolId: "t10" },
];
```
