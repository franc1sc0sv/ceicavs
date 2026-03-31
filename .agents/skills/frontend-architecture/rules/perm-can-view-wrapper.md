---
title: Use CanView for Section-Level Permission Gating
impact: MEDIUM
tags: permissions, components, guard
---

## Rule

`components/permission/can-view.tsx` combines a CASL ability check with fallback UI (access-denied message or redirect). Use `CanView` at the page level — inside route definitions or at the top of page components — to gate entire sections. It differs from `<Can>` which simply hides its children without rendering any fallback.

- `<Can>` = element-level toggle (show/hide a button, link, or section). No fallback.
- `<CanView>` = page/section-level gate. Shows fallback UI when the user lacks permission.

## CanView component implementation

```typescript
// components/permission/can-view.tsx
import type { ReactNode } from 'react';
import { useAbility } from '@/context/ability.context';

interface CanViewProps {
  action: string;
  subject: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function CanView({ action, subject, fallback, children }: CanViewProps) {
  const ability = useAbility();

  if (ability.can(action, subject)) {
    return <>{children}</>;
  }

  return <>{fallback ?? null}</>;
}
```

## AccessDenied fallback component

```typescript
// components/permission/access-denied.tsx
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

export function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <ShieldAlert className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Acceso denegado</h2>
      <p className="text-muted-foreground">
        No tienes permisos para ver esta sección.
      </p>
      <Button variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)}>
        Volver al inicio
      </Button>
    </div>
  );
}
```

## Correct — Gating an entire page with CanView

```typescript
// features/ai-transcription/pages/ai-transcription-page.tsx
import { CanView } from '@/components/permission/can-view';
import { AccessDenied } from '@/components/permission/access-denied';
import { RecordingList } from '../components/recording-list';

export default function AITranscriptionPage() {
  return (
    <CanView action="read" subject="Recording" fallback={<AccessDenied />}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Transcripciones de IA</h1>
        <RecordingList />
      </div>
    </CanView>
  );
}
```

## Correct — Gating a subsection within a page

```typescript
// features/attendance/pages/attendance-page.tsx
import { Can } from '@/context/ability.context';
import { CanView } from '@/components/permission/can-view';
import { AccessDenied } from '@/components/permission/access-denied';
import { AttendanceTable } from '../components/attendance-table';
import { AttendanceExportPanel } from '../components/attendance-export-panel';

export default function AttendancePage() {
  return (
    <CanView action="read" subject="AttendanceRecord" fallback={<AccessDenied />}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Asistencia</h1>
        <AttendanceTable />

        {/* Element-level: export panel only visible to those who can export */}
        <Can I="export" a="AttendanceRecord">
          <AttendanceExportPanel />
        </Can>
      </div>
    </CanView>
  );
}
```

## Incorrect — Using `<Can>` alone for page-level gating

```typescript
// BAD: user with no permission sees a blank page — no feedback
import { Can } from '@/context/ability.context';
import { RecordingList } from '../components/recording-list';

export default function AITranscriptionPage() {
  return (
    <Can I="read" a="Recording">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Transcripciones de IA</h1>
        <RecordingList />
      </div>
    </Can>
  );
}
```

## When to use which

| Component | Scope | Fallback | Typical location |
|---|---|---|---|
| `<Can>` | Element (button, link, card section) | None — children hidden silently | Inside components |
| `<CanView>` | Page or major section | `<AccessDenied />`, redirect, or custom UI | Top of page components, inside route config |
