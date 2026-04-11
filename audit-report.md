# CEICAVS Architecture & Code Quality Audit

**Date:** 2026-04-11  
**Scope:** Full codebase — Wave 3 additions (activity, transcription, tools REST controllers, frontend)

---

## Critical Issues — Must Fix

### C1. Handlers bypass repository layer by calling `tx.*Model*` directly

Three handlers call Prisma models directly through the `TxClient` instead of routing through an `IUserRepository` abstraction:

- `generate-summary.handler.ts` lines 43–50: `tx.user.findUnique()` to fetch `summaryPrompt`
- `update-summary-prompt.handler.ts` lines 27–30: `tx.user.update()` directly
- `get-summary-prompt.handler.ts` lines 22–26: `tx.user.findUnique()` directly

**Fix:** Add `findSummaryPrompt(userId: string)` and `updateSummaryPrompt(userId: string, prompt: string | null)` to `IUserRepository`. Route through the repository — handlers must never call `tx.*Model*` directly.

---

### C2. Broken `PDFParse` named import — runtime failure

`apps/api/src/modules/tools/controllers/file-convert.controller.ts` line 16:
```ts
import { PDFParse } from 'pdf-parse'  // ❌ named export does not exist
```
`pdf-parse` exports a default function, not a named class. This will throw at runtime.

**Fix:** `import pdf from 'pdf-parse'` then `const result = await pdf(file.buffer)`

---

### C3. Magic strings in `activity.listener.ts` — `type` and `entityType` fields

`apps/api/src/modules/activity/listeners/activity.listener.ts` — every handler uses raw strings:
- `type: 'ATTENDANCE_SUBMITTED'`, `'POST_CREATED'`, `'DRAFT_REVIEWED'`, `'POST_PUBLISHED'`, `'USER_CREATED'`, `'USER_DELETED'`
- `entityType: 'GROUP'`, `'POST'`, `'USER'`

`ICreateActivityData.type` in `activity.interfaces.ts` is typed as `string` — too wide.

**Fix:** Create `ActivityType` and `ActivityEntityType` `as const` enums in the interfaces file. Narrow `ICreateActivityData.type` to `ActivityType`. Use enum values in the listener.

---

### C4. `@OnEvent` decorator strings are magic strings with no compile-time enforcement

`apps/api/src/modules/activity/listeners/activity.listener.ts`:
```ts
@OnEvent('attendance.submitted')  // ❌ magic string duplicated
@OnEvent('post.created')
// etc.
```

These must match the `eventName` on domain event classes. If an event name changes, listeners silently stop receiving events.

**Fix:** Use `static EVENT_NAME = 'attendance.submitted' as const` on each event class and reference it in `@OnEvent(AttendanceSubmittedEvent.EVENT_NAME)`.

---

## Architecture Warnings

### W1. `prompts/` directory is not a canonical vertical slice directory

`apps/api/src/modules/transcription/prompts/generate-summary.prompt.ts` — The vertical slice spec defines `interfaces/`, `repositories/`, `commands/`, `queries/`, `events/`, `types/`. The `prompts/` subdirectory is undocumented. Move prompt constants inline to the handler (single consumer) or document the convention in CLAUDE.md.

---

### W2. `GenerateSummaryHandler` instantiates `Groq` and hardcodes model string

`generate-summary.handler.ts` line 52–54: `new Groq(...)` on every invocation + `model: 'llama-3.3-70b-versatile'` as a bare string. Violates IoC — Groq client should be a provider or module-level singleton. Model name is a magic string.

**Fix:** Module-level `const GROQ_MODEL = 'llama-3.3-70b-versatile' as const`. Consider `ILlmService` abstraction or NestJS injectable `GroqService`.

---

### W3. `TranscriptionStatus` type duplicated as inline union across 3 files

`'none' | 'processing' | 'completed'` appears in `recording.interfaces.ts`, `recording.repository.ts`, and `IUpdateTranscriptionInput`. Define a single `TranscriptionStatus` type in the interfaces file and import everywhere.

---

### W4. `TranscriptSegment` shape duplicated between backend and frontend

`recording.interfaces.ts:ITranscriptSegment` and `apps/web/src/features/transcription/utils.ts:TranscriptSegment` are identical shapes with no shared contract. Document this boundary to prevent silent drift.

---

### W5. REST controllers (tools) have business logic — noted deviation from CQRS

`FileConvertController` and `YoutubeDownloadController` perform authorization and file manipulation inline. This is an accepted tradeoff for streaming endpoints (can't go through Apollo), but the pattern must not be copied for non-streaming operations.

---

## Convention Violations

### CV1. `getApiBase()` and `localStorage.getItem('accessToken')` duplicated in 3+ files

`youtube-downloader.tsx`, `word-pdf-converter.tsx`, and `blog/components/post-form.tsx` all inline identical auth header construction. Extract to `apps/web/src/lib/api-client.ts`.

---

### CV2. `tools-data.ts` has hardcoded English strings — not i18n'd

`apps/web/src/features/tools/data/tools-data.ts`: category names (`'Teaching & Classroom'`, `'File Converters'`, etc.) and tool names/descriptions are English strings. `ToolsPage.tsx` renders `category.name` directly from this data. All user-facing strings must use `t('key')` via `useTranslation()`.

---

### CV3. Duplicate search filtering between `use-tools.ts` and `ToolsPage.tsx`

Search filtering runs twice — once in the hook, once in the page. Consolidate into the hook.

---

## Advisory

### A1. No error handling for malformed Groq JSON in `generate-summary.handler.ts`

`JSON.parse(content) as GroqSummaryResponse` on line 77 silently fails if Groq returns unexpected structure. Add runtime shape validation.

### A2. `YoutubeDownloadController` uses module-level mutable state outside DI

`let ytDlpReady` and `let activeDownloads` are module-level singletons outside the NestJS container. Move to injectable singleton service.

### A3. No test coverage on any new handlers or repositories

All Wave 3 handlers (8 command/query handlers) and repositories have zero test files.

---

## Unused / Orphaned Files

### U1. `/apps/api/.yt-dlp` — binary committed to git

Runtime binary that the controller auto-downloads if absent. Bloats git history and can be stale. Add to `.gitignore`.

### U2. `apps/api/src/modules/transcription/prompts/` — single file, single consumer

Not a canonical directory. Inline the constants or document the convention.

---

## Summary

| Category | Count |
|---|---|
| Critical — must fix | 4 (C1–C4) |
| Architecture warnings | 5 (W1–W5) |
| Convention violations | 3 (CV1–CV3) |
| Advisory | 3 (A1–A3) |
| Unused/orphaned files | 2 (U1–U2) |

**Overall health:** The CQRS spine, IoC wiring, transaction discipline, and CASL authorization are solid across all modules. Every handler extends base classes, uses abstract repository tokens, and calls `defineAbilityFor` with enum constants. The critical issues are localized — three handlers bypass the repository layer, one import is broken and will fail at runtime, and the activity listener uses string literals for domain type values. Fix those four issues and the architecture is sound.

### Files requiring immediate attention

| File | Issue |
|---|---|
| `apps/api/src/modules/transcription/commands/generate-summary/generate-summary.handler.ts` | C1 + W2 + A1 |
| `apps/api/src/modules/transcription/commands/update-summary-prompt/update-summary-prompt.handler.ts` | C1 |
| `apps/api/src/modules/transcription/queries/get-summary-prompt/get-summary-prompt.handler.ts` | C1 |
| `apps/api/src/modules/tools/controllers/file-convert.controller.ts` | C2 |
| `apps/api/src/modules/activity/listeners/activity.listener.ts` | C3 + C4 |
| `apps/api/src/modules/activity/interfaces/activity.interfaces.ts` | C3 |
| `apps/web/src/features/tools/data/tools-data.ts` | CV2 |
