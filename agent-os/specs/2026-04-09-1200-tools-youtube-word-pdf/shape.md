# YouTube Downloader & Word/PDF Converter — Shaping Notes

## Scope

Implement two "Coming Soon" tools in the tools section:

1. **YouTube Downloader** — paste a YouTube URL, choose MP4 or MP3, click download. Backend streams the file directly.
2. **Word/PDF Converter** — upload a .docx or .pdf, choose direction (Word→PDF or PDF→Word), receive converted file.

Both tools require a NestJS REST backend. Neither stores files server-side (stream only).

## Decisions

- **Pure Node.js packages only** — no system binaries (yt-dlp, LibreOffice, ffmpeg). Everything via npm.
- **YouTube**: `@distube/ytdl-core` for streaming. MP4 = `videoandaudio` filter. MP3 = `audioonly` filter served as audio stream.
- **Word→PDF**: `mammoth` (DOCX→HTML) + `puppeteer` (HTML→PDF). Puppeteer auto-downloads Chromium at install time.
- **PDF→Word**: `pdf-parse` (text extraction) + `docx` (DOCX generation). Produces text-only output — layout is not preserved (inherent pure-Node.js limitation).
- **Streaming only** — no server storage. Files streamed directly from controller to browser.
- **Auth**: `JwtAuthGuard` + CASL `ability.can(Action.USE, Subject.Tool)` on both controllers.
- **Frontend download pattern**: `fetch()` with Authorization header → Blob → object URL → programmatic `<a>` click (same pattern as image tools).

## Context

- **Visuals:** None provided
- **References:** `apps/web/src/features/tools/implementations/image-compressor.tsx` (drag-and-drop + blob download pattern), `apps/api/src/modules/blog/controllers/upload.controller.ts` (REST controller pattern in this codebase)
- **Product alignment:** Both tools are already listed in tools-data.ts and seeded in the DB. No schema changes needed.

## Standards Applied

- `backend/cqrs-patterns` — REST controllers still need CASL checks; no CQRS handlers needed here since these are stateless file operations
- `frontend/architecture-patterns` — feature-first folder, named exports, shadcn/ui first
- `frontend/design-system` — use existing color tokens, shadcn Card/Button/Input/Select
