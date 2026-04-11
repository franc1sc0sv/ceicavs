# Spec: Client-Side AI — Transcription, Screenshot to Text & Text Simplifier

## Context

This implements Milestone 07 (AI Transcription) from the product roadmap, upgrades the existing "Screenshot to Text" placeholder tool (ID `9705a1c2`) to a real implementation, and adds a new "Text Simplifier" tool. All AI runs **100% client-side** via:

- **Transformers.js** (`@huggingface/transformers`) + Web Workers — Whisper for audio, TrOCR for OCR
- **Chrome Built-in AI** — `window.Summarizer` for transcript summaries, `window.Rewriter` for text simplification (with graceful degradation on non-Chrome)

No backend changes. No API keys. No GraphQL. Purely frontend.

---

## Scope

| Feature | Where | Status |
|---|---|---|
| AI Transcription page | `apps/web/src/features/transcription/` | Empty placeholder → full page |
| Screenshot to Text tool | Tool #9 in registry (ID `9705a1c2`) | `coming-soon.tsx` → real implementation |
| Text Simplifier tool | New tool #14 | Does not exist yet |

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-04-09-1100-client-side-ai-tools/` with:
- `plan.md` — this full plan
- `shape.md` — shaping notes and decisions
- `standards.md` — relevant frontend standards
- `references.md` — code references (quick-notes.tsx, existing tools pattern)

---

## Task 2: Install Dependency + Vite Config

**Agent:** `frontend`

```bash
pnpm --filter @ceicavs/web add @huggingface/transformers
```

**Modify:** `apps/web/vite.config.ts`
```ts
// Add inside defineConfig:
worker: {
  format: 'es',
}
```
Required for ESM imports inside Web Workers (Transformers.js uses ESM).

---

## Task 3: Shared Component — Model Download Progress

**Agent:** `frontend`

Cross-cutting component (used by transcription + OCR tool) → goes to `apps/web/src/components/`.

**New file:** `apps/web/src/components/model-download-progress.tsx`

```tsx
// Props: { loaded: number; total: number; status: string }
// Shows: progress bar + "Descargando modelo... 43%" label
// Disappears once status === 'done'
// shadcn: Progress component
```

---

## Task 4: AI Transcription Page (Milestone 07)

**Agent:** `frontend`

**Full scope:** File upload + live microphone recording → Whisper transcription → Chrome Summarizer summary (fixed template) → navigation block while processing.

### Workers

**New file:** `apps/web/src/features/transcription/workers/whisper.worker.ts`
```ts
import { pipeline, env } from '@huggingface/transformers'
env.allowLocalModels = false

let pipe = null

self.onmessage = async (e) => {
  if (e.data.type === 'transcribe') {
    if (!pipe) {
      pipe = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
        progress_callback: (p) => self.postMessage({ type: 'progress', ...p }),
      })
    }
    const result = await pipe(e.data.audio)
    self.postMessage({ type: 'result', text: result.text })
  }
}
```

### Hooks

**New file:** `apps/web/src/features/transcription/hooks/use-whisper-transcription.ts`
- Instantiates `whisper.worker.ts` via `new Worker(new URL(...), { type: 'module' })`
- Returns: `{ transcribe(audioBuffer), transcript, isTranscribing, downloadProgress }`
- Worker ref survives component re-renders (stable `useRef`)

**New file:** `apps/web/src/features/transcription/hooks/use-audio-summary.ts`
- Checks `window.Summarizer?.availability()` on mount
- `summarize(text)`: uses `window.Summarizer.create({ type: 'key-points', format: 'markdown' })` if available
- Falls back to returning raw transcript if unavailable (non-Chrome)
- Returns: `{ summarize, summary, isSummarizing, summarizerAvailable }`

**New file:** `apps/web/src/features/transcription/hooks/use-navigation-blocker.ts`
- Combines `useBlocker(isProcessing)` (React Router v7) + `beforeunload` event listener
- Returns blocker state for rendering confirmation dialog
- Cleans up `beforeunload` listener on unmount

### Components

**New files in** `apps/web/src/features/transcription/components/`:

- `audio-uploader.tsx` — drag-drop zone + file picker (MP3/WAV/M4A/OGG) + microphone record button using `MediaRecorder` API; shadcn `Card`, `Button`
- `transcription-result.tsx` — shows raw transcript text + copy button; shadcn `Textarea` (read-only), `Button`
- `summary-result.tsx` — shows structured markdown summary in sections (Key Points / Topics / Action Items); renders only if `summarizerAvailable === true` or summary is available; shadcn `Card`
- `navigation-block-dialog.tsx` — shown when `blocker.state === 'blocked'`; "Procesando transcripción..." warning with Salir / Quedarme buttons; shadcn `AlertDialog`

### Page

**Modify:** `apps/web/src/features/transcription/TranscriptionPage.tsx` (currently `<main></main>`)

Replace with full implementation:
1. Title + description via `useTranslation('transcription')`
2. `<AudioUploader>` → on audio ready → call `transcribe(audioBuffer)` from `useWhisperTranscription`
3. While `isTranscribing`: show `<ModelDownloadProgress>` (first load) or spinner
4. After transcript: show `<TranscriptionResult>` + auto-trigger `summarize(transcript)`
5. After summary: show `<SummaryResult>`
6. `<NavigationBlockDialog>` connected to blocker

Route already exists and is already protected:
```ts
// apps/web/src/router/routes.tsx — already there, no change needed
{ element: <RequireAbility action={Action.CREATE} subject={Subject.RECORDING} /> ... }
{ path: 'transcription', element: withSuspense(<TranscriptionPage />) }
```

### i18n

**New files:**
- `apps/web/public/locales/es/transcription.json`
- `apps/web/public/locales/en/transcription.json`

Keys: page title, upload prompt, recording button, processing states, transcript label, summary label, copy button, navigation warning dialog.

**Modify:** `apps/web/src/i18n/index.ts` — register `transcription` namespace.

---

## Task 5: Screenshot to Text Tool (Upgrade from Placeholder)

**Agent:** `frontend`

Tool is already registered and routes exist. ID: `9705a1c2`. Just needs the real component.

### Worker

**New file:** `apps/web/src/features/tools/workers/trocr.worker.ts`
```ts
import { pipeline, env } from '@huggingface/transformers'
env.allowLocalModels = false

let pipe = null

self.onmessage = async (e) => {
  if (e.data.type === 'ocr') {
    if (!pipe) {
      pipe = await pipeline('image-to-text', 'Xenova/trocr-base-printed', {
        progress_callback: (p) => self.postMessage({ type: 'progress', ...p }),
      })
    }
    const result = await pipe(e.data.imageData)
    self.postMessage({ type: 'result', text: result[0].generated_text })
  }
}
```

### Hook

**New file:** `apps/web/src/features/tools/hooks/use-image-ocr.ts`
- Instantiates `trocr.worker.ts`
- Returns: `{ extractText(imageUrl), extractedText, isProcessing, downloadProgress }`

### Component

**New file:** `apps/web/src/features/tools/implementations/screenshot-to-text.tsx`

UI flow:
1. `<ImageDropzone>` — drag-drop + file picker (PNG, JPG, WEBP); shows image preview
2. "Extraer texto" button → calls `extractText(imageUrl)`
3. While processing: `<ModelDownloadProgress>` (first load) or spinner  
4. After result: read-only textarea with extracted text + copy button
5. Four-state rendering: idle → processing → result → error

**Modify:** `apps/web/src/features/tools/tool-registry.ts`
```ts
// Replace coming-soon entry for this ID:
['9705a1c2-...', lazy(() => import('./implementations/screenshot-to-text'))]
```

**Modify:** `apps/web/public/locales/es/tools.json` + `en/tools.json` — add keys for OCR UI strings.

---

## Task 6: Text Simplifier Tool (New)

**Agent:** `frontend`

Uses Chrome Built-in `window.Rewriter` API. No model download, no worker — it's a browser API. Degrades gracefully (shows message when not available on non-Chrome).

### New tool entry

**Modify:** `apps/web/src/features/tools/data/tools-data.ts`

Add tool #14:
```ts
{
  id: 'a3f7e291-4b12-4c89-9d01-bc234f567890',  // new UUID
  name: 'Text Simplifier',
  description: 'Simplifica textos complejos para hacerlos más fáciles de entender',
  categoryId: CATEGORY_TEACHING,  // Teaching & Classroom
  icon: 'Sparkles',
  color: 'text-purple-500',
}
```

### Hook

**New file:** `apps/web/src/features/tools/hooks/use-text-simplifier.ts`
```ts
// Checks window.Rewriter?.availability() on mount
// simplify(text, tone: 'as-is' | 'more-casual' | 'more-formal'):
//   → window.Rewriter.create({ tone, length: 'as-is', format: 'plain-text' })
//   → rewriter.rewrite(text)
// Returns: { simplify, result, isSimplifying, isAvailable }
```

### Component

**New file:** `apps/web/src/features/tools/implementations/text-simplifier.tsx`

UI:
1. Textarea for input text (paste or type)
2. Tone selector: "Más simple" / "Formal" / "Casual" — shadcn `SegmentedControl` or `RadioGroup`
3. "Simplificar" button
4. While processing: spinner
5. Result textarea (read-only) + copy button
6. If `!isAvailable`: info banner "Esta función requiere Chrome 138+" with graceful fallback message
7. Four-state rendering: idle → processing → result → error

### Registration

**Modify:** `apps/web/src/features/tools/tool-registry.ts` — add new UUID entry.

**Modify:** `apps/web/public/locales/es/tools.json` + `en/tools.json` — add Text Simplifier strings.

---

## Critical Files

| File | Action |
|---|---|
| `apps/web/vite.config.ts` | Add `worker: { format: 'es' }` |
| `apps/web/package.json` | Add `@huggingface/transformers` |
| `apps/web/src/components/model-download-progress.tsx` | **Create** |
| `apps/web/src/features/transcription/TranscriptionPage.tsx` | Replace placeholder |
| `apps/web/src/features/transcription/workers/whisper.worker.ts` | **Create** |
| `apps/web/src/features/transcription/hooks/use-whisper-transcription.ts` | **Create** |
| `apps/web/src/features/transcription/hooks/use-audio-summary.ts` | **Create** |
| `apps/web/src/features/transcription/hooks/use-navigation-blocker.ts` | **Create** |
| `apps/web/src/features/transcription/components/*.tsx` | **Create** (4 components) |
| `apps/web/src/features/tools/workers/trocr.worker.ts` | **Create** |
| `apps/web/src/features/tools/hooks/use-image-ocr.ts` | **Create** |
| `apps/web/src/features/tools/hooks/use-text-simplifier.ts` | **Create** |
| `apps/web/src/features/tools/implementations/screenshot-to-text.tsx` | **Create** |
| `apps/web/src/features/tools/implementations/text-simplifier.tsx` | **Create** |
| `apps/web/src/features/tools/tool-registry.ts` | Update 1 entry + add 1 entry |
| `apps/web/src/features/tools/data/tools-data.ts` | Add tool #14 |
| `apps/web/src/i18n/index.ts` | Register `transcription` namespace |
| `apps/web/public/locales/es/transcription.json` | **Create** |
| `apps/web/public/locales/en/transcription.json` | **Create** |

---

## Execution Order

```
Task 1: Save spec docs
Task 2: Install dep + vite config       ← unblocks everything
Task 3: ModelDownloadProgress component ← shared, needed by 4 + 5
Task 4: Transcription page (whisper worker, hooks, components, page, i18n)
Task 5: Screenshot to Text (trocr worker, hook, component, registry update)
Task 6: Text Simplifier (hook, component, tools-data update, registry)
```

---

## Standards Applied

- `frontend/architecture-patterns` — feature-first folders, 4-state rendering (idle/processing/result/error), named exports, CASL via existing `RequireAbility` on transcription route
- `frontend/design-system` — shadcn/ui components, Tailwind v4 tokens, dark mode variants

---

## Verification

1. `pnpm --filter @ceicavs/web dev` — no build errors
2. **Transcription:**
   - Navigate to `/transcription` (as Teacher/Admin) — page loads, not empty
   - Upload an MP3 → model download progress bar appears (first time only) → transcript appears → summary sections appear
   - Start upload, then click a nav link → "Procesando…" dialog blocks navigation → click "Quedarme" → stays
   - Refresh during processing → browser "Leave site?" native dialog
   - Open in Firefox → transcript works (Whisper), summary section hidden gracefully (no Summarizer API)
3. **Screenshot to Text:**
   - Navigate to `/tools/9705a1c2-...` → real UI, not "Próximamente"
   - Drop a JPG of a handwritten note → model downloads (first time) → extracted text appears
   - Copy button copies text to clipboard
4. **Text Simplifier:**
   - Navigate to `/tools/a3f7e291-...` → tool appears in grid under Teaching & Classroom
   - Paste a complex paragraph → click "Simplificar" → simplified version appears
   - Open in Firefox → info banner shows "requiere Chrome 138+"
5. `pnpm --filter @ceicavs/web typecheck` — zero errors
