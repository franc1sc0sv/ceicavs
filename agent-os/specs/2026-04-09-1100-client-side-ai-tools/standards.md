# Standards for Client-Side AI Tools

## frontend/architecture-patterns

Each feature has exactly 4 subdirectories: pages/, components/, hooks/, graphql/. Workers go in a workers/ subfolder (feature-local extension).

- Feature-local code stays local until a second feature needs it. Exception: ModelDownloadProgress is cross-cutting from day one → goes to src/components/.
- No barrel files. Import directly from the defining file.
- Four-state rendering mandatory: idle/loading → processing → result → error. Always in that order.
- Named exports everywhere. Only lazy-loaded page components use default export.
- CASL via existing RequireAbility on transcription route — no new Subject needed for tools.

## frontend/design-system

- shadcn/ui first — every UI primitive must use shadcn. Install missing ones with `pnpm dlx shadcn@latest add <component>`.
- Tailwind v4 utility classes. Dark mode variants required.
- All user-facing text via `useTranslation()` — `transcription` namespace for transcription page, `tools` namespace for tool components.
