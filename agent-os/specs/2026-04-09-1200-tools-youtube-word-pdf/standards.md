# Standards for YouTube Downloader & Word/PDF Converter

## backend/cqrs-patterns

These tools use REST controllers, not CQRS handlers — file streaming is a stateless I/O operation with no domain state changes. However the CASL enforcement rule still applies: every authenticated endpoint must check `ability.can(Action.X, Subject.Y)` inside the handler. Both controllers must call `defineAbilityFor(user.role)` and throw `ForbiddenException` if the check fails.

No command/query handlers are needed. No domain events are emitted.

## frontend/architecture-patterns

Feature-first folder structure applies:

```
apps/web/src/features/tools/implementations/
├── youtube-downloader/
│   └── youtube-downloader.tsx     ← named export YoutubeDownloader
└── word-pdf-converter/
    └── word-pdf-converter.tsx     ← named export WordPdfConverter
```

- Named exports only (no default exports)
- No inline type declarations — define props/state interfaces in the file or a dedicated types file
- Apollo is not used here (REST, not GraphQL) — use native `fetch` with the JWT token from auth context

## frontend/design-system

- shadcn/ui first: `Card`, `CardContent`, `CardHeader`, `Button`, `Input`, `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `Label`
- Drag-and-drop zone: match the visual style of `image-compressor.tsx` (dashed border, hover state)
- Loading states: use `Button` with `disabled` + spinner icon
- Error states: use `Alert` or inline text with destructive variant
- All text via `useTranslation('tools')` — no hardcoded strings
