---
title: Use Absolute Imports with the @ Alias
impact: MEDIUM
tags: imports, tooling, vite
---

## Rule

Vite and TypeScript are configured with `@/` as an alias pointing to `apps/web/src/`. All cross-feature imports use the `@/` alias. Relative imports are only acceptable within the same feature subdirectory (sibling or direct child files).

## Incorrect

```tsx
// apps/web/src/features/grades/components/grade-summary.tsx
// BAD: deep relative imports crossing feature boundaries
import { PostCard } from "../../../../features/blog/components/post-card";
import { useAuth } from "../../../contexts/auth-context";
import { Button } from "../../../components/ui/button";
import type { Student } from "../../../../types/student";
```

## Correct

```tsx
// apps/web/src/features/grades/components/grade-summary.tsx
// GOOD: absolute imports for cross-feature and shared code
import { PostCard } from "@/features/blog/components/post-card";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@ceicavs/ui/components/ui/button";
import type { Student } from "@ceicavs/shared";
```

```tsx
// apps/web/src/features/attendance/components/attendance-table.tsx
// GOOD: relative imports within the same feature are acceptable
import { AttendanceRow } from "./attendance-row";
import { useAttendanceGroups } from "../hooks/use-attendance-groups";
import { ATTENDANCE_FIELDS } from "../graphql/attendance.queries";
```

## Configuration

### vite.config.ts

```ts
// apps/web/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### tsconfig.json

```jsonc
// apps/web/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## When to Use Relative vs Absolute

| Scenario | Style | Example |
|----------|-------|---------|
| Same feature, sibling file | Relative | `./attendance-row` |
| Same feature, parent/child directory | Relative | `../hooks/use-attendance-groups` |
| Different feature | Absolute | `@/features/blog/components/post-card` |
| Shared contexts | Absolute | `@/contexts/auth-context` |
| Shared lib utilities | Absolute | `@/lib/apollo-client` |
| Monorepo packages | Package name | `@ceicavs/shared`, `@ceicavs/ui` |
