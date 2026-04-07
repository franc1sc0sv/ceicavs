# Teaching Tools Fullstack — Shaping Notes

## Scope

Utility hub with a grid of 13 interactive tools organized by 4 categories. All roles (admin, teacher, student) access every tool. Users can favorite tools to pin them at the top, search by name, and open any tool in a full-page view with breadcrumb navigation back to the grid.

- 10 tools fully implemented (8 frontend-only + 2 fullstack with backend)
- 3 tools as "Proximamente" placeholders (Word/PDF Converter, YouTube Video Downloader, Screenshot to Text OCR)
- **Quick Notes + Task Organizer:** full backend CQRS (migration, handlers, GraphQL, Apollo Client)
- Grid: static data + localStorage favorites (backend for grid deferred to next run)

## Tool Changes from Original Product-Plan

- **Removed:** Noise Level Monitor (microphone-based, low priority)
- **Removed:** CSV/JSON Converter (low demand for school context)
- **Removed:** Text Diff Comparator
- **Added:** Ruleta (general-purpose roulette wheel to pick randomly from custom options)
- **Clarified:** PDF Converter = Word to PDF and PDF to Word conversion
- **Clarified:** Video Downloader = YouTube video download (requires backend, placeholder for now)
- **Upgraded:** Quick Notes + Task Organizer = full backend persistence (Note + TaskItem tables)

## Decisions

- DB schema exists for tools/categories/favorites; **new Note + TaskItem tables** added via migration
- CASL: new `NOTE` and `TASK_ITEM` subjects with MANAGE for all roles (ownership in handlers)
- Product-plan components (`TeachingTools`, `ToolCard`, `FavoritePill`) are the authoritative grid design reference
- All frontend components built with **shadcn/ui** via the shadcn MCP server
- Complex tools (Word/PDF, YouTube, OCR) ship as placeholders — unblocks milestone faster
- Each tool is a lazy-loaded component in `implementations/` — tool registry maps ID to component
- No `eval()` in Scientific Calculator — use a safe expression parser
- QR Code Generator uses `qrcode.react` (lightweight)
- Quick Notes and Task Organizer use **Apollo Client** (database-backed, not localStorage)
- Other tool UIs use localStorage for persistence where relevant (student names, roulette options)
- Grid favorites managed via localStorage this run (backend toggle deferred)

## Context

- **Visuals:** Product-plan grid components only; individual tool UIs designed from scratch with shadcn/ui
- **References:** Blog module architecture for future backend work; product-plan components for grid UI
- **Product alignment:** Wave 6 of implementation plan; Spanish-first UI, English codebase

## Standards Applied

- `backend/cqrs-patterns` — transaction-first, CASL inside handlers, thin resolvers (for Notes + TaskItems)
- `database/prisma-kysely-patterns` — TxClient contract, snake_case mapping, soft delete (Note + TaskItem models)
- `frontend/architecture-patterns` — feature-first folders, four-state rendering, CASL visibility, named exports
- `frontend/design-system` — shadcn/ui components, Tailwind v4, dark mode, responsive grid
