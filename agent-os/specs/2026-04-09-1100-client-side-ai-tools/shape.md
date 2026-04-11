# Client-Side AI Tools — Shaping Notes

## Scope

Three features using 100% client-side AI (no backend, no API keys):

1. **AI Transcription page** (Milestone 07) — file upload + live mic recording → Whisper → Chrome Summarizer summary
2. **Screenshot to Text** (tool upgrade) — replace coming-soon placeholder with TrOCR via Transformers.js
3. **Text Simplifier** (new tool) — Chrome Rewriter API to simplify text for students

## Decisions

- All AI is client-side only — Transformers.js + Web Workers for heavy models, Chrome Built-in AI for text tasks
- Whisper Tiny (~75MB) for audio transcription — small enough for school use
- TrOCR Base Printed (~350MB) for OCR — handles printed + handwritten text
- Chrome Summarizer API for summaries (graceful degradation on Firefox/Safari — show raw transcript)
- Chrome Rewriter API for text simplification (show "requires Chrome 138+" banner on other browsers)
- Web Workers are mandatory for Transformers.js — prevents UI freeze during inference
- `useBlocker` (React Router v7) + `beforeunload` to prevent losing transcription progress on navigation
- ModelDownloadProgress goes to `src/components/` — cross-cutting, used by transcription + OCR

## Context

- **Visuals:** None — design from existing tool patterns (quick-notes.tsx, screenshot-to-text existing metadata)
- **References:** `apps/web/src/features/tools/implementations/quick-notes.tsx`, `tool-registry.ts`, `tools-data.ts`
- **Product alignment:** Milestone 07 from roadmap.md — "Audio recorder, file upload, AI transcript + summary + action items". Admin + Teacher only (students excluded per Role Visibility table).

## Standards Applied

- `frontend/architecture-patterns` — feature-first folders, 4-state rendering, named exports
- `frontend/design-system` — shadcn/ui components, Tailwind v4 tokens, dark mode
