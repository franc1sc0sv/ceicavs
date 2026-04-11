# References for YouTube Downloader & Word/PDF Converter

## Similar Implementations

### Image Compressor (drag-and-drop + blob download)

- **Location:** `apps/web/src/features/tools/implementations/image-compressor.tsx`
- **Relevance:** Shows the exact pattern for file upload UI (drag-and-drop zone), processing state, and triggering a browser download from a Blob URL. The Word/PDF Converter frontend should mirror this structure.
- **Key patterns:** `useState` for file/dragging state, `FileReader` or direct buffer handling, `URL.createObjectURL(blob)` + programmatic `<a>` click, `URL.revokeObjectURL` cleanup.

### Image Format Converter (client-side processing pattern)

- **Location:** `apps/web/src/features/tools/implementations/image-format-converter.tsx`
- **Relevance:** Shows how a conversion tool is structured — format select, quality slider, before/after display. The Word/PDF Converter can follow the same UX layout.

### Blog Upload Controller (REST controller in NestJS)

- **Location:** `apps/api/src/modules/blog/controllers/upload.controller.ts`
- **Relevance:** The only existing REST controller in the codebase. Shows how to register a `@Controller` with `@UseGuards(JwtAuthGuard)` within a NestJS module, and how to wire it into the module's `controllers` array.
- **Key patterns:** `@Controller('upload')`, `@UseGuards(JwtAuthGuard)`, `@Post('sign')`, inject config via abstract class DI token.

### Tool Registry

- **Location:** `apps/web/src/features/tools/tool-registry.ts`
- **Relevance:** All 10 existing tool registrations use `lazy()` with a named export `.then(m => ({ default: m.ComponentName }))`. New tools follow the same UUID-keyed Map entry.

### Tools Data

- **Location:** `apps/web/src/features/tools/data/tools-data.ts`
- **Relevance:** Contains the UUIDs for YouTube Downloader and Word/PDF Converter (currently "Coming Soon"). Read this file to get the exact UUIDs before writing tool-registry entries.
