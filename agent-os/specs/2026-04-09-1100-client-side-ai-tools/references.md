# References for Client-Side AI Tools

## Similar Implementations

### Quick Notes Tool

- **Location:** `apps/web/src/features/tools/implementations/quick-notes.tsx`
- **Relevance:** Most complete tool implementation — shows four-state rendering, Apollo hooks, shadcn/ui usage
- **Key patterns:** useState for local UI state, useQuery/useMutation for data, Card + Textarea + Button layout

### Tool Registry

- **Location:** `apps/web/src/features/tools/tool-registry.ts`
- **Relevance:** How tools are registered — UUID → lazy-loaded React component
- **Key patterns:** `new Map<string, LazyExoticComponent>`, `lazy(() => import(...))`

### Tools Data

- **Location:** `apps/web/src/features/tools/data/tools-data.ts`
- **Relevance:** Where tool metadata lives (name, description, categoryId, icon, color)
- **Key patterns:** Static array, CATEGORY constants, UUID IDs

### Transcription Page (placeholder)

- **Location:** `apps/web/src/features/transcription/TranscriptionPage.tsx`
- **Relevance:** The file to replace — currently `<main></main>`
- **Key patterns:** Route is already protected with `RequireAbility action={Action.CREATE} subject={Subject.RECORDING}`

### Router

- **Location:** `apps/web/src/router/routes.tsx`
- **Relevance:** Transcription route + tools routes already exist — no changes needed
