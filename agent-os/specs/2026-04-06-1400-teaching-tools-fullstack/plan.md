# Teaching Tools (Milestone 6) — Implementation Plan

## Context

The CEICAVS school platform needs its Teaching Tools utility hub (Wave 6). The database schema exists for tools/categories/favorites but **Quick Notes and Task Organizer need new tables** (Note, TaskItem). Product-plan components (TeachingTools grid, ToolCard, FavoritePill) are the authoritative UI reference. The existing stubs (`tools.module.ts`, `ToolsPage.tsx`) are empty.

**Scope:** 13 tools across 4 categories. 10 client-side tools (8 frontend-only + 2 fullstack with backend), 3 as "Proximamente" placeholders. All UI built with **shadcn/ui** via MCP server. Grid uses static data + localStorage favorites. Quick Notes and Task Organizer get **full backend CQRS** (migration, handlers, GraphQL, Apollo Client).

**Tool changes from original product-plan:**
- Removed: Noise Level Monitor, CSV/JSON Converter, Text Diff Comparator
- Added: Ruleta (general-purpose roulette wheel picker)
- Clarified: PDF Converter = Word <-> PDF; Video Downloader = YouTube-based
- Upgraded: Quick Notes + Task Organizer = full backend persistence

---

## Task 1: Save Spec Documentation (DONE)

---

## Task 2: Database — Migration for Note & TaskItem

**Agent:** `database`

Add two new models to `packages/db/prisma/schema.prisma`:

```prisma
model Note {
  id        String    @id @default(cuid())
  content   String
  userId    String    @map("user_id")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([deletedAt])
  @@index([userId])
  @@map("notes")
}

model TaskItem {
  id        String    @id @default(cuid())
  text      String
  completed Boolean   @default(false)
  order     Int       @default(0)
  userId    String    @map("user_id")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([deletedAt])
  @@index([userId])
  @@map("task_items")
}
```

Add relations to `User` model:
```prisma
notes     Note[]
taskItems TaskItem[]
```

Run: `prisma migrate dev --name add_notes_and_task_items` then `prisma generate`

---

## Task 3: Shared — CASL Permissions for Note & TaskItem

**Agent:** `backend`

**Modify:** `packages/shared/src/casl.ts`

Add to `Subject` enum:
```typescript
NOTE: 'Note',
TASK_ITEM: 'TaskItem',
```

Add permissions for all roles (personal data — ownership enforced in handlers):
- Admin: already has `can(Action.MANAGE, Subject.ALL)`
- Teacher: add `can(Action.MANAGE, Subject.NOTE)` and `can(Action.MANAGE, Subject.TASK_ITEM)`
- Student: add `can(Action.MANAGE, Subject.NOTE)` and `can(Action.MANAGE, Subject.TASK_ITEM)`

---

## Task 4: Backend — Notes CQRS (Quick Notes tool)

**Agent:** `backend`

All within `apps/api/src/modules/tools/` (sub-slice for notes):

**Interfaces:**
- `interfaces/note.interfaces.ts` — `INote { id, content, userId, createdAt, updatedAt, deletedAt }`
- `interfaces/note.repository.ts` — abstract `INoteRepository`:
  - `findByUserId: RepositoryMethod<[userId: string], INote[]>` (ordered by updatedAt desc, soft delete filtered)
  - `findById: RepositoryMethod<[id: string], INote | null>`
  - `create: RepositoryMethod<[userId: string, content: string], INote>`
  - `update: RepositoryMethod<[id: string, content: string], INote>`
  - `softDelete: RepositoryMethod<[id: string], void>`

**Repository:** `repositories/note.repository.ts` — Prisma implementation with `where: { deletedAt: null }`

**Types:** `types/note.type.ts` — `@ObjectType NoteType { id, content, createdAt, updatedAt }`

**Queries:**
- `queries/get-notes/` — `GetNotesQuery(userId, role)` -> `INoteRepository.findByUserId` | CASL: `Action.READ, Subject.NOTE`

**Commands:**
- `commands/create-note/` — `CreateNoteCommand(userId, content, role)` -> `INoteRepository.create` | CASL: `Action.CREATE, Subject.NOTE`
- `commands/update-note/` — `UpdateNoteCommand(noteId, content, userId, role)` -> verify ownership -> `INoteRepository.update` | CASL: `Action.UPDATE, Subject.NOTE`
- `commands/delete-note/` — `DeleteNoteCommand(noteId, userId, role)` -> verify ownership -> `INoteRepository.softDelete` | CASL: `Action.DELETE, Subject.NOTE`

**Input types** (co-located in command folders):
- `CreateNoteInput` — `@InputType` with `@IsString() @IsNotEmpty() content: string`
- `UpdateNoteInput` — `@InputType` with `@IsString() @IsNotEmpty() content: string`

---

## Task 5: Backend — TaskItem CQRS (Task Organizer tool)

**Agent:** `backend`

All within `apps/api/src/modules/tools/` (sub-slice for task items):

**Interfaces:**
- `interfaces/task-item.interfaces.ts` — `ITaskItem { id, text, completed, order, userId, createdAt, updatedAt, deletedAt }`
- `interfaces/task-item.repository.ts` — abstract `ITaskItemRepository`:
  - `findByUserId: RepositoryMethod<[userId: string], ITaskItem[]>` (ordered by order asc, soft delete filtered)
  - `findById: RepositoryMethod<[id: string], ITaskItem | null>`
  - `create: RepositoryMethod<[userId: string, text: string, order: number], ITaskItem>`
  - `update: RepositoryMethod<[id: string, data: IUpdateTaskItemData], ITaskItem>`
  - `softDelete: RepositoryMethod<[id: string], void>`
  - `reorder: RepositoryMethod<[items: Array<{ id: string; order: number }>], void>`

**Repository:** `repositories/task-item.repository.ts` — Prisma implementation. `reorder` uses `tx.$transaction()` with multiple updates.

**Types:** `types/task-item.type.ts` — `@ObjectType TaskItemType { id, text, completed, order, createdAt, updatedAt }`

**Queries:**
- `queries/get-task-items/` — `GetTaskItemsQuery(userId, role)` -> `ITaskItemRepository.findByUserId` | CASL: `Action.READ, Subject.TASK_ITEM`

**Commands:**
- `commands/create-task-item/` — `CreateTaskItemCommand(userId, text, role)` -> auto-assign order (max + 1) -> `ITaskItemRepository.create` | CASL: `Action.CREATE, Subject.TASK_ITEM`
- `commands/update-task-item/` — `UpdateTaskItemCommand(id, data: { text?, completed? }, userId, role)` -> verify ownership -> update | CASL: `Action.UPDATE, Subject.TASK_ITEM`
- `commands/delete-task-item/` — `DeleteTaskItemCommand(id, userId, role)` -> verify ownership -> soft delete | CASL: `Action.DELETE, Subject.TASK_ITEM`
- `commands/reorder-task-items/` — `ReorderTaskItemsCommand(items: [{ id, order }], userId, role)` -> verify all belong to user -> reorder | CASL: `Action.UPDATE, Subject.TASK_ITEM`

**Input types:**
- `CreateTaskItemInput` — `@IsString() @IsNotEmpty() text: string`
- `UpdateTaskItemInput` — `@IsOptional() @IsString() text?: string; @IsOptional() @IsBoolean() completed?: boolean`
- `ReorderTaskItemsInput` — `@ValidateNested({ each: true }) items: ReorderItemInput[]` where `ReorderItemInput { @IsString() id: string; @IsInt() order: number }`

---

## Task 6: Backend — Resolver & Module Wiring

**Agent:** `backend`

**Modify:** `apps/api/src/modules/tools/resolvers/tools.resolver.ts`

Add to existing resolver (alongside tools/categories/favorites queries):

**Notes operations:**
- `@Query notes` -> `GetNotesQuery`
- `@Mutation createNote(input: CreateNoteInput!)` -> `CreateNoteCommand`
- `@Mutation updateNote(id: ID!, input: UpdateNoteInput!)` -> `UpdateNoteCommand`
- `@Mutation deleteNote(id: ID!)` -> `DeleteNoteCommand`

**TaskItem operations:**
- `@Query taskItems` -> `GetTaskItemsQuery`
- `@Mutation createTaskItem(input: CreateTaskItemInput!)` -> `CreateTaskItemCommand`
- `@Mutation updateTaskItem(id: ID!, input: UpdateTaskItemInput!)` -> `UpdateTaskItemCommand`
- `@Mutation deleteTaskItem(id: ID!)` -> `DeleteTaskItemCommand`
- `@Mutation reorderTaskItems(input: ReorderTaskItemsInput!)` -> `ReorderTaskItemsCommand`

**Modify:** `apps/api/src/modules/tools/tools.module.ts` — add all new providers:
- `{ provide: INoteRepository, useClass: NoteRepository }`
- `{ provide: ITaskItemRepository, useClass: TaskItemRepository }`
- All 8 new handlers (4 notes + 4 task items)

---

## Task 7: Frontend — i18n Namespace

**Agent:** `frontend`

**New files:**
- `apps/web/src/i18n/es/tools.json` — Spanish translations for grid UI, 14 tool names/descriptions, 4 categories, empty states, notes UI, task organizer UI
- `apps/web/src/i18n/en/tools.json` — English equivalents

**Modify:** `apps/web/src/i18n/index.ts` — register `tools` namespace

---

## Task 8: Frontend — Static Data & Hooks (Grid)

**Agent:** `frontend`

**New file:** `apps/web/src/features/tools/data/tools-data.ts`
- Static 13 tools + 4 categories (adapted from sample-data.json: remove 3, add Ruleta)

**New file:** `apps/web/src/features/tools/hooks/use-tools.ts`
- Static data, local search, localStorage favorites

**New file:** `apps/web/src/features/tools/hooks/use-toggle-favorite.ts`
- localStorage-based favorite toggle

---

## Task 9: Frontend — GraphQL Operations for Notes & Tasks

**Agent:** `frontend`

**New file:** `apps/web/src/features/tools/graphql/notes.queries.ts`
```typescript
import { graphql } from '@/generated/gql'

export const GET_NOTES = graphql(`
  query GetNotes { notes { id content createdAt updatedAt } }
`)
```

**New file:** `apps/web/src/features/tools/graphql/notes.mutations.ts`
```typescript
export const CREATE_NOTE = graphql(`mutation CreateNote($input: CreateNoteInput!) { createNote(input: $input) { id content createdAt updatedAt } }`)
export const UPDATE_NOTE = graphql(`mutation UpdateNote($id: ID!, $input: UpdateNoteInput!) { updateNote(id: $id, input: $input) { id content updatedAt } }`)
export const DELETE_NOTE = graphql(`mutation DeleteNote($id: ID!) { deleteNote(id: $id) }`)
```

**New file:** `apps/web/src/features/tools/graphql/task-items.queries.ts`
```typescript
export const GET_TASK_ITEMS = graphql(`
  query GetTaskItems { taskItems { id text completed order createdAt updatedAt } }
`)
```

**New file:** `apps/web/src/features/tools/graphql/task-items.mutations.ts`
```typescript
export const CREATE_TASK_ITEM = graphql(`mutation CreateTaskItem($input: CreateTaskItemInput!) { createTaskItem(input: $input) { id text completed order } }`)
export const UPDATE_TASK_ITEM = graphql(`mutation UpdateTaskItem($id: ID!, $input: UpdateTaskItemInput!) { updateTaskItem(id: $id, input: $input) { id text completed } }`)
export const DELETE_TASK_ITEM = graphql(`mutation DeleteTaskItem($id: ID!) { deleteTaskItem(id: $id) }`)
export const REORDER_TASK_ITEMS = graphql(`mutation ReorderTaskItems($input: ReorderTaskItemsInput!) { reorderTaskItems(input: $input) }`)
```

**New hooks:**
- `apps/web/src/features/tools/hooks/use-notes.ts` — `useQuery(GET_NOTES)` + mutations
- `apps/web/src/features/tools/hooks/use-task-items.ts` — `useQuery(GET_TASK_ITEMS)` + mutations + optimistic reorder

Run `pnpm --filter @ceicavs/web generate` after backend schema.gql is available.

---

## Task 10: Frontend — Tools Grid Page (shadcn/ui)

**Agent:** `frontend` (use shadcn MCP server)

**Modify:** `apps/web/src/features/tools/ToolsPage.tsx`
- shadcn `Input`, `Button`, `Badge`, `Card`
- All text via `useTranslation('tools')`
- Static data via `useTools()`, localStorage favorites

**New files:**
- `apps/web/src/features/tools/components/tool-card.tsx` — shadcn Card
- `apps/web/src/features/tools/components/favorite-pill.tsx` — shadcn Badge

---

## Task 11: Frontend — Tool Detail Routing & Registry

**Agent:** `frontend`

**New files:**
- `apps/web/src/features/tools/pages/tool-detail-page.tsx`
- `apps/web/src/features/tools/tool-registry.ts` — maps 13 tool IDs
- `apps/web/src/features/tools/implementations/coming-soon.tsx`

**Modify:** `apps/web/src/router/routes.tsx` — add `/tools/:toolId`

---

## Task 12: Frontend — Quick Notes (fullstack, shadcn/ui)

**Agent:** `frontend` (use shadcn MCP server)

**New file:** `apps/web/src/features/tools/implementations/quick-notes.tsx`

- Uses `useNotes()` hook (Apollo Client, NOT localStorage)
- List of notes with preview, sorted by updatedAt
- Create new note (shadcn Button + Dialog or inline)
- Edit note content (shadcn Textarea, auto-save on blur or debounced)
- Delete note with confirmation (shadcn AlertDialog)
- Word/character count
- Four-state rendering: loading -> error -> empty -> list
- shadcn: Card, Textarea, Button, AlertDialog

---

## Task 13: Frontend — Task Organizer (fullstack, shadcn/ui)

**Agent:** `frontend` (use shadcn MCP server)

**New file:** `apps/web/src/features/tools/implementations/task-organizer.tsx`

- Uses `useTaskItems()` hook (Apollo Client, NOT localStorage)
- Add task input at top (shadcn Input + Button)
- Checklist with shadcn Checkbox, inline text, delete button
- Toggle completed: `useMutation(UPDATE_TASK_ITEM, { variables: { id, input: { completed: !current } } })`
- Delete task: `useMutation(DELETE_TASK_ITEM)` with optimistic update
- Drag-to-reorder: `useMutation(REORDER_TASK_ITEMS)` with optimistic UI
- Completed/total counter
- Four-state rendering
- shadcn: Checkbox, Input, Button, Card

---

## Task 14: Frontend — Simple Tools (4 tools, shadcn/ui)

**Agent:** `frontend` (use shadcn MCP server)

All in `apps/web/src/features/tools/implementations/`:

| Tool | File | Key UI |
|---|---|---|
| Password Generator | `password-generator.tsx` | Slider, Checkbox, Input, Button; `crypto.getRandomValues()` |
| Scientific Calculator | `scientific-calculator.tsx` | Button grid; safe expression parser (no `eval`) |
| Countdown Timer | `countdown-timer.tsx` | Button presets, Input; large digits; Start/Pause/Reset |
| Random Student Picker | `random-student-picker.tsx` | Textarea (names), Button; shuffle animation; localStorage |

---

## Task 15: Frontend — Browser API Tools (shadcn/ui)

**Agent:** `frontend` (use shadcn MCP server)

| Tool | File | Browser API | npm dep |
|---|---|---|---|
| QR Code Generator | `qr-code-generator.tsx` | Canvas | `qrcode.react` |
| Image Compressor | `image-compressor.tsx` | Canvas, File API | — |
| Image Format Converter | `image-format-converter.tsx` | Canvas, File API | — |

**npm dependency to add:** `qrcode.react`

---

## Task 16: Frontend — Ruleta (New Tool, shadcn/ui)

**Agent:** `frontend` (use shadcn MCP server)

**New file:** `apps/web/src/features/tools/implementations/ruleta.tsx`

- Input area to add/remove options
- Visual spinning wheel (canvas or CSS animation)
- "Girar" (Spin) button
- Selected option displayed after spin
- Options persisted in localStorage
- shadcn: Input, Button, Card

---

## Task 17: Frontend — Complex Tool Placeholders

Wire 3 tools to `coming-soon.tsx`:
- Word/PDF Converter (`21781fa3`)
- YouTube Downloader (`ca48be9f`)
- Screenshot to Text (`9705a1c2`)

---

## Execution Order

```
Phase 1 (parallel):  Task 2 (migration) + Task 3 (CASL) + Task 7 (i18n) + Task 8 (static data)
Phase 2 (parallel):  Task 4 (notes backend) + Task 5 (tasks backend)
Phase 3:             Task 6 (resolver + module wiring)
Phase 4:             Task 9 (frontend GraphQL + codegen)
Phase 5:             Task 10 (grid page)
Phase 6:             Task 11 (routing + registry)
Phase 7 (parallel):  Task 12 (quick notes UI) + Task 13 (task organizer UI) + Task 14 (simple tools) + Task 15 (browser API tools) + Task 16 (ruleta)
Phase 8:             Task 17 (placeholders)
```

---

## Deferred to Next Run

- Seed script for tools/categories (grid currently uses static data)
- GraphQL for tools grid (swap static data for `GET_TOOLS`, `GET_TOOL_CATEGORIES`)
- GraphQL for favorites (swap localStorage for `TOGGLE_FAVORITE` mutation)
- Complex tool implementations (Word/PDF, YouTube, OCR)

---

## 13 Tools Summary

| # | Tool | Category | Backend | Status | File |
|---|---|---|---|---|---|
| 1 | Random Student Picker | Teaching & Classroom | No | Build | `random-student-picker.tsx` |
| 2 | Countdown Timer | Teaching & Classroom | No | Build | `countdown-timer.tsx` |
| 3 | Task Organizer | Teaching & Classroom | **Yes (CQRS)** | Build | `task-organizer.tsx` |
| 4 | Word/PDF Converter | File Converters | No | Placeholder | `coming-soon.tsx` |
| 5 | Image Format Converter | File Converters | No | Build | `image-format-converter.tsx` |
| 6 | YouTube Downloader | Media Tools | No | Placeholder | `coming-soon.tsx` |
| 7 | Image Compressor | Media Tools | No | Build | `image-compressor.tsx` |
| 8 | QR Code Generator | Media Tools | No | Build | `qr-code-generator.tsx` |
| 9 | Screenshot to Text | Media Tools | No | Placeholder | `coming-soon.tsx` |
| 10 | Quick Notes | Productivity | **Yes (CQRS)** | Build | `quick-notes.tsx` |
| 11 | Scientific Calculator | Productivity | No | Build | `scientific-calculator.tsx` |
| 12 | Password Generator | Productivity | No | Build | `password-generator.tsx` |
| 13 | Ruleta | Productivity | No | Build (NEW) | `ruleta.tsx` |

---

## Critical Files

| File | Status | Action |
|---|---|---|
| `packages/db/prisma/schema.prisma` | Exists | Add Note + TaskItem models |
| `packages/shared/src/casl.ts` | Exists | Add NOTE + TASK_ITEM subjects + permissions |
| `apps/api/src/modules/tools/tools.module.ts` | Empty stub | Wire all providers |
| `apps/web/src/features/tools/ToolsPage.tsx` | Empty stub | Replace with grid page |
| `apps/web/src/router/routes.tsx` | Exists | Add `/tools/:toolId` route |
| `apps/web/src/i18n/index.ts` | Exists | Add `tools` namespace |
| `apps/api/src/common/cqrs/` | Complete | Extend BaseCommandHandler, BaseQueryHandler |
| `product-plan/sections/teaching-tools/` | Complete | UI reference (adapt to shadcn/ui) |

---

## Verification

1. `prisma migrate dev` — migration applies cleanly
2. `pnpm --filter @ceicavs/api typecheck` — zero errors
3. `pnpm --filter @ceicavs/web generate` — regenerates typed operations
4. `pnpm --filter @ceicavs/web typecheck` — zero errors
5. **E2E flow — Grid:**
   - Navigate to `/tools` — see 4 categories, 13 tools
   - Search "calc" — only Scientific Calculator
   - Favorite toggle persists on refresh (localStorage)
   - Card click navigates to `/tools/{id}` with breadcrumb
6. **E2E flow — Quick Notes (fullstack):**
   - Open Quick Notes tool — create a note with text
   - Refresh page — note persists (from database, not localStorage)
   - Edit note content — updates saved
   - Delete note — soft deleted, disappears from list
7. **E2E flow — Task Organizer (fullstack):**
   - Open Task Organizer — add 3 tasks
   - Check off task — completed state persists on refresh
   - Delete task — removed from list
   - Reorder tasks — new order persists
8. **E2E flow — Other tools:**
   - Password Generator — generates passwords, copy works
   - Ruleta — add options, spin, result displayed
   - Word/PDF Converter — "Proximamente" placeholder
9. GraphQL Playground: `notes`, `taskItems` queries + all mutations
