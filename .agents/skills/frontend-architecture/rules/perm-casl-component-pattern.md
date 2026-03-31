---
title: Use CASL Can Component for Conditional UI
impact: HIGH
tags: permissions, casl, components
---

## Rule

Use `<Can>` from `@/context/ability.context` for declarative show/hide of UI elements based on CASL permissions. Use `useAbility()` for imperative checks inside hooks or event handlers. Never check role strings directly — all permission logic flows through the CASL ability instance so that rules stay centralized and testable.

Subjects: `User`, `Group`, `Post`, `Recording`, `AttendanceRecord`, `Favorite`, `Comment`, etc.
Roles: **admin** (manage all), **teacher** (manage attendance/groups, approve/reject posts), **student** (read published posts, submit drafts, limited comments).

## Incorrect — Hardcoded role string checks

```typescript
import { useAuth } from '@/context/auth.context';

export function PostActions({ post }: { post: Post }) {
  const { user } = useAuth();

  return (
    <div className="flex gap-2">
      {/* BAD: couples UI to role names, breaks when permissions change */}
      {user.role === 'admin' && (
        <Button variant="destructive">Eliminar publicación</Button>
      )}

      {(user.role === 'admin' || user.role === 'teacher') && (
        <Button>Aprobar</Button>
      )}

      {user.role !== 'student' && (
        <Button variant="outline">Editar</Button>
      )}
    </div>
  );
}
```

## Correct — Declarative `<Can>` component

```typescript
import { Can } from '@/context/ability.context';
import { Button } from '@/components/ui/button';
import type { Post } from '@/types';

export function PostActions({ post }: { post: Post }) {
  return (
    <div className="flex gap-2">
      <Can I="delete" a="Post">
        <Button variant="destructive">Eliminar publicación</Button>
      </Can>

      <Can I="update" a="Post">
        <Button variant="outline">Editar</Button>
      </Can>
    </div>
  );
}
```

## Correct — Blog draft approval buttons for teachers/admins

```typescript
import { Can } from '@/context/ability.context';
import { Button } from '@/components/ui/button';
import type { Post } from '@/types';

interface DraftReviewActionsProps {
  post: Post;
  onApprove: (postId: string) => void;
  onReject: (postId: string) => void;
}

export function DraftReviewActions({ post, onApprove, onReject }: DraftReviewActionsProps) {
  return (
    <Can I="approve" a="Post">
      <div className="flex gap-2">
        <Button onClick={() => onApprove(post.id)}>
          Aprobar publicación
        </Button>
        <Button variant="destructive" onClick={() => onReject(post.id)}>
          Rechazar publicación
        </Button>
      </div>
    </Can>
  );
}
```

## Correct — Imperative `useAbility()` check in a hook

```typescript
import { useAbility } from '@/context/ability.context';
import { useCallback } from 'react';

export function useAttendanceExport(groupId: string) {
  const ability = useAbility();

  const canExport = ability.can('export', 'AttendanceRecord');

  const handleExport = useCallback(async () => {
    if (!ability.can('export', 'AttendanceRecord')) return;
    // proceed with CSV/PDF export logic
    const response = await exportAttendanceRecords(groupId);
    downloadFile(response);
  }, [ability, groupId]);

  return { canExport, handleExport };
}
```

Usage in a component:

```typescript
import { useAttendanceExport } from '../hooks/use-attendance-export';
import { Button } from '@/components/ui/button';

export function AttendanceToolbar({ groupId }: { groupId: string }) {
  const { canExport, handleExport } = useAttendanceExport(groupId);

  return (
    <div className="flex items-center gap-2">
      {canExport && (
        <Button variant="outline" onClick={handleExport}>
          Exportar asistencia
        </Button>
      )}
    </div>
  );
}
```

## When to use which

| Approach | Use case |
|---|---|
| `<Can I="action" a="Subject">` | Declarative show/hide of JSX elements |
| `useAbility().can('action', 'Subject')` | Inside hooks, event handlers, or when you need the boolean value |
| **Never** `user.role === '...'` | Role strings couple UI to auth implementation and break when rules change |
