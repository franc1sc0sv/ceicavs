---
title: Route Guards Use CASL Abilities, Not Role Strings
impact: HIGH
tags: routing, permissions, casl, guards
---

## Rule

`protected-route.tsx` checks authentication (is the user logged in?). `role-route.tsx` checks CASL abilities, never role name strings. Use `ability.can(action, subject)` to gate routes. The CASL ability definitions from `@ceicavs/shared` define:

- **admin** can `manage` all subjects
- **teacher** can `manage` Attendance, Group, and `approve` Post
- **student** can `read` published Post and `create` draft Post

## Incorrect - Checking role strings directly

```typescript
// BAD: brittle role string checks, breaks when permissions change
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

function AITranscriptionPage() {
  const { user } = useAuth();

  if (user.role !== 'admin' && user.role !== 'teacher') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <TranscriptionList />;
}
```

```typescript
// BAD: role-based guard component using string comparison
interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}

// Usage:
<RoleGuard allowedRoles={['admin', 'teacher']}>
  <AttendancePage />
</RoleGuard>
```

## Correct - CASL ability checks

### `protected-route.tsx` (authentication only)

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { ROUTES } from '../lib/routes';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children ?? <Outlet />;
}
```

### `role-route.tsx` (CASL ability check)

```typescript
import { Navigate } from 'react-router-dom';
import { useAbility } from '../hooks/use-ability';
import { ROUTES } from '../lib/routes';

interface RoleRouteProps {
  action: string;
  subject: string;
  children: React.ReactNode;
}

export function RoleRoute({ action, subject, children }: RoleRouteProps) {
  const ability = useAbility();

  if (!ability.can(action, subject)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
```

### Usage in route config

```typescript
import { RoleRoute } from '../components/role-route';

// AI Transcription - only users who can read Recording
{
  path: ROUTES.AI_TRANSCRIPTION,
  element: (
    <RoleRoute action="read" subject="Recording">
      <Suspense fallback={<PageSkeleton />}>
        <AITranscriptionPage />
      </Suspense>
    </RoleRoute>
  ),
}

// Attendance - only users who can manage Attendance
{
  path: ROUTES.ATTENDANCE,
  element: (
    <RoleRoute action="manage" subject="Attendance">
      <Suspense fallback={<PageSkeleton />}>
        <AttendancePage />
      </Suspense>
    </RoleRoute>
  ),
}

// Blog - all authenticated users can read Post (no RoleRoute needed)
{
  path: ROUTES.BLOG,
  element: (
    <Suspense fallback={<PageSkeleton />}>
      <BlogPage />
    </Suspense>
  ),
}
```

### CASL ability definitions (`@ceicavs/shared`)

```typescript
import { AbilityBuilder, PureAbility } from '@casl/ability';

type AppAbility = PureAbility<[string, string]>;

export function defineAbilitiesFor(role: string): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

  switch (role) {
    case 'admin':
      can('manage', 'all');
      break;

    case 'teacher':
      can('manage', 'Attendance');
      can('manage', 'Group');
      can('approve', 'Post');
      can('read', 'Post');
      can('create', 'Post');
      can('read', 'Recording');
      can('create', 'Recording');
      break;

    case 'student':
      can('read', 'Post');
      can('create', 'Post'); // drafts only, enforced server-side
      break;
  }

  return build();
}
```

### Conditional UI based on abilities

```typescript
import { useAbility } from '../hooks/use-ability';

export function BlogPostActions({ post }: { post: BlogPost }) {
  const ability = useAbility();

  return (
    <div>
      {ability.can('approve', 'Post') && post.status === 'draft' && (
        <Button onClick={() => approvePost(post.id)}>Aprobar</Button>
      )}
      {ability.can('manage', 'Post') && (
        <Button variant="destructive" onClick={() => deletePost(post.id)}>
          Eliminar
        </Button>
      )}
    </div>
  );
}
```
