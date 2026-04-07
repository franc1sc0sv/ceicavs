# Teaching Tools — Component Tree & File Structure

## File Structure

```
packages/db/prisma/
└── schema.prisma                        ← ADD Note + TaskItem models

packages/shared/src/
└── casl.ts                              ← ADD NOTE + TASK_ITEM subjects

apps/api/src/modules/tools/
├── tools.module.ts                              (MODIFY — wire all providers)
├── interfaces/
│   ├── note.interfaces.ts                       (NEW)
│   ├── note.repository.ts                       (NEW)
│   ├── task-item.interfaces.ts                  (NEW)
│   └── task-item.repository.ts                  (NEW)
├── repositories/
│   ├── note.repository.ts                       (NEW)
│   └── task-item.repository.ts                  (NEW)
├── resolvers/
│   └── tools.resolver.ts                        (NEW — notes + task items operations)
├── commands/
│   ├── create-note/                             (NEW)
│   ├── update-note/                             (NEW)
│   ├── delete-note/                             (NEW)
│   ├── create-task-item/                        (NEW)
│   ├── update-task-item/                        (NEW)
│   ├── delete-task-item/                        (NEW)
│   └── reorder-task-items/                      (NEW)
├── queries/
│   ├── get-notes/                               (NEW)
│   └── get-task-items/                          (NEW)
└── types/
    ├── note.type.ts                             (NEW)
    └── task-item.type.ts                        (NEW)

apps/web/src/features/tools/
├── ToolsPage.tsx                        ← Grid page (MODIFY)
├── tool-registry.ts                     ← ID → lazy component map (NEW)
├── data/
│   └── tools-data.ts                   ← Static 13 tools + 4 categories (NEW)
├── graphql/
│   ├── notes.queries.ts                 ← GET_NOTES (NEW)
│   ├── notes.mutations.ts              ← CREATE/UPDATE/DELETE_NOTE (NEW)
│   ├── task-items.queries.ts           ← GET_TASK_ITEMS (NEW)
│   └── task-items.mutations.ts         ← CREATE/UPDATE/DELETE/REORDER (NEW)
├── hooks/
│   ├── use-tools.ts                     ← Static data + search + localStorage favorites (NEW)
│   ├── use-toggle-favorite.ts           ← localStorage favorite toggle (NEW)
│   ├── use-notes.ts                     ← Apollo Client for notes (NEW)
│   └── use-task-items.ts               ← Apollo Client for tasks (NEW)
├── components/
│   ├── tool-card.tsx                    ← shadcn Card (NEW)
│   └── favorite-pill.tsx               ← shadcn Badge pill (NEW)
├── pages/
│   └── tool-detail-page.tsx            ← Breadcrumb + tool renderer (NEW)
└── implementations/
    ├── coming-soon.tsx                  ← "Proximamente" placeholder (NEW)
    ├── password-generator.tsx           (NEW)
    ├── scientific-calculator.tsx         (NEW)
    ├── quick-notes.tsx                  ← FULLSTACK: Apollo Client (NEW)
    ├── task-organizer.tsx               ← FULLSTACK: Apollo Client (NEW)
    ├── countdown-timer.tsx              (NEW)
    ├── qr-code-generator.tsx            (NEW)
    ├── image-compressor.tsx             (NEW)
    ├── image-format-converter.tsx       (NEW)
    ├── random-student-picker.tsx        (NEW)
    └── ruleta.tsx                       (NEW)

apps/web/src/i18n/
├── es/tools.json                        (NEW)
├── en/tools.json                        (NEW)
└── index.ts                             ← Add tools namespace (MODIFY)

apps/web/src/router/
└── routes.tsx                           ← Add /tools/:toolId (MODIFY)
```

## React Component Hierarchy

```
<AppShell>
└── <Routes>
    ├── path="/tools"
    │   └── <ToolsPage>                              ← useTools() (static) + useToggleFavorite() (localStorage)
    │       ├── <header>
    │       │   ├── <h1> t('title') </h1>
    │       │   └── <p> t('subtitle', { count }) </p>
    │       ├── <Input>                               ← shadcn Input (search)
    │       ├── <FavoritesRow>                        ← hidden when empty
    │       │   └── <FavoritePill> ×N                 ← shadcn Badge
    │       ├── <CategorySection> ×4                  ← sorted by category.order
    │       │   ├── <h2> category.name </h2>
    │       │   └── <Grid 4|2|1 cols>
    │       │       └── <ToolCard> ×N                 ← shadcn Card
    │       │           ├── <StarButton>              ← toggleFavorite (localStorage)
    │       │           ├── <IconChip>                ← color-coded icon
    │       │           ├── <p> tool.name </p>
    │       │           └── <p> tool.description </p>
    │       └── <EmptyState>                          ← "No se encontraron herramientas"
    │
    └── path="/tools/:toolId"
        └── <ToolDetailPage>                          ← useParams(), breadcrumb
            ├── <Breadcrumb>
            │   ├── "Herramientas" → /tools
            │   └── tool.name (current)
            └── <Suspense>
                └── <ToolComponent>                   ← from tool-registry.ts (lazy)
                    │
                    │── FULLSTACK (Apollo Client):
                    │   ├── <QuickNotes>              ← useNotes() → GET_NOTES, CREATE/UPDATE/DELETE
                    │   └── <TaskOrganizer>           ← useTaskItems() → GET_TASK_ITEMS, CRUD + REORDER
                    │
                    │── CLIENT-ONLY (localStorage / in-memory):
                    │   ├── <PasswordGenerator>       ← Slider, Checkbox, crypto.getRandomValues()
                    │   ├── <ScientificCalculator>    ← Button grid, safe parser
                    │   ├── <CountdownTimer>          ← Presets, large digits, Start/Pause/Reset
                    │   ├── <QrCodeGenerator>         ← qrcode.react, download PNG
                    │   ├── <ImageCompressor>         ← Canvas API, quality slider
                    │   ├── <ImageFormatConverter>    ← Canvas API, format select
                    │   ├── <RandomStudentPicker>     ← Shuffle animation, localStorage names
                    │   └── <Ruleta>                  ← Spinning wheel, localStorage options
                    │
                    └── PLACEHOLDER:
                        └── <ComingSoon>              ← Word/PDF, YouTube, OCR
```

## Data Flow

```
┌───────────────────────────────────┐
│  GraphQL API (NestJS)             │
│  ── Notes + TaskItems only ──     │
├───────────────────────────────────┤
│ Q: notes              → GetNotesHandler → INoteRepository          │
│ M: createNote         → CreateNoteHandler → INoteRepository        │
│ M: updateNote         → UpdateNoteHandler → INoteRepository        │
│ M: deleteNote         → DeleteNoteHandler → INoteRepository        │
│ Q: taskItems          → GetTaskItemsHandler → ITaskItemRepository  │
│ M: createTaskItem     → CreateTaskItemHandler → ITaskItemRepository│
│ M: updateTaskItem     → UpdateTaskItemHandler → ITaskItemRepository│
│ M: deleteTaskItem     → DeleteTaskItemHandler → ITaskItemRepository│
│ M: reorderTaskItems   → ReorderTaskItemsHandler → ITaskItemRepo   │
└──────────────┬────────────────────┘
               │
┌──────────────▼────────────────────┐
│  Apollo Client (Quick Notes +     │
│  Task Organizer only)             │
│  useNotes() / useTaskItems()      │
└──────────────┬────────────────────┘
               │
┌──────────────▼────────────────────┐
│  Static Data (tools-data.ts)      │   ← Grid, search, categories
│  localStorage                     │   ← Favorites, student names, roulette options
└──────────────┬────────────────────┘
               │
┌──────────────▼────────────────────┐
│  ToolsPage (grid)                 │
│  ToolDetailPage → tool-registry   │
│  → lazy tool component            │
└───────────────────────────────────┘
```

## Tool Categories & IDs (13 tools)

```
Teaching & Classroom (order: 1) — 3 tools
  ├── 905e288c  Random Student Picker   [lime]    ← random-student-picker.tsx
  ├── dc3e3796  Countdown Timer         [amber]   ← countdown-timer.tsx
  └── 2b415492  Task Organizer          [sky]     ← task-organizer.tsx ★ FULLSTACK

File Converters (order: 2) — 2 tools
  ├── 21781fa3  Word/PDF Converter      [rose]    ← coming-soon.tsx (PLACEHOLDER)
  └── ed9ea594  Image Format Converter  [violet]  ← image-format-converter.tsx

Media Tools (order: 3) — 4 tools
  ├── ca48be9f  YouTube Downloader      [red]     ← coming-soon.tsx (PLACEHOLDER)
  ├── febbfeb4  Image Compressor        [orange]  ← image-compressor.tsx
  ├── 44284731  QR Code Generator       [stone]   ← qr-code-generator.tsx
  └── 9705a1c2  Screenshot to Text      [cyan]    ← coming-soon.tsx (PLACEHOLDER)

Productivity (order: 4) — 4 tools
  ├── 8a7088d7  Quick Notes             [yellow]  ← quick-notes.tsx ★ FULLSTACK
  ├── 43873f40  Scientific Calculator   [indigo]  ← scientific-calculator.tsx
  ├── ccecb121  Password Generator      [fuchsia] ← password-generator.tsx
  └── NEW-UUID  Ruleta                  [emerald] ← ruleta.tsx (NEW)
```

**Removed:** Noise Level Monitor (5f582538), CSV/JSON Converter (bd98503c), Text Diff Comparator (86a135cc)
**Added:** Ruleta (new UUID, emerald, Productivity category)
**Fullstack:** Quick Notes + Task Organizer (database-backed via CQRS)
