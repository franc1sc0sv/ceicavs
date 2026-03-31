---
title: Routes Use Path Constants and Lazy Loading
impact: HIGH
tags: routing, react-router, lazy-loading
---

## Rule

All route paths are defined as constants in `lib/routes.ts`. The router config in `routes/index.tsx` uses `React.lazy()` for every feature page. Route nesting mirrors the feature structure. The `app-layout` wraps all authenticated routes with `<Outlet />`. This project uses react-router-dom 7 in **library mode** (`createBrowserRouter`), NOT framework/Remix mode.

## Path Constants (`lib/routes.ts`)

```typescript
export const ROUTES = {
  // Auth
  LOGIN: '/login',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Attendance
  ATTENDANCE: '/attendance',
  ATTENDANCE_GROUP_DETAIL: '/attendance/groups/:groupId',

  // People
  PEOPLE: '/people',
  PEOPLE_DETAIL: '/people/:personId',

  // Blog
  BLOG: '/blog',
  BLOG_POST: '/blog/:postId',

  // Teaching Tools
  TEACHING_TOOLS: '/teaching-tools',

  // AI Transcription
  AI_TRANSCRIPTION: '/ai-transcription',
  AI_TRANSCRIPTION_DETAIL: '/ai-transcription/:recordingId',
} as const;
```

## Incorrect - Hardcoded path strings, no lazy loading

```typescript
// BAD: path strings duplicated, no code splitting
import DashboardPage from '../features/dashboard/pages/dashboard-page';
import AttendancePage from '../features/attendance/pages/attendance-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/attendance', element: <AttendancePage /> },
    ],
  },
]);
```

## Correct - ROUTES constants with Suspense and lazy loading

```typescript
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ROUTES } from '../lib/routes';
import { AppLayout } from '../layouts/app-layout';
import { ProtectedRoute } from '../components/protected-route';
import { PageSkeleton } from '../components/page-skeleton';

const DashboardPage = lazy(() => import('../features/dashboard/pages/dashboard-page'));
const AttendancePage = lazy(() => import('../features/attendance/pages/attendance-page'));
const AttendanceGroupDetailPage = lazy(() => import('../features/attendance/pages/attendance-group-detail-page'));
const PeoplePage = lazy(() => import('../features/people/pages/people-page'));
const BlogPage = lazy(() => import('../features/blog/pages/blog-page'));
const TeachingToolsPage = lazy(() => import('../features/teaching-tools/pages/teaching-tools-page'));
const AITranscriptionPage = lazy(() => import('../features/ai-transcription/pages/ai-transcription-page'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.ATTENDANCE,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AttendancePage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.ATTENDANCE_GROUP_DETAIL,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AttendanceGroupDetailPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PEOPLE,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <PeoplePage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.BLOG,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <BlogPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.TEACHING_TOOLS,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <TeachingToolsPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.AI_TRANSCRIPTION,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AITranscriptionPage />
          </Suspense>
        ),
      },
    ],
  },
]);
```

## Route Tree Structure

```
/ (ProtectedRoute + AppLayout with <Outlet />)
  /dashboard              -> DashboardPage (lazy)
  /attendance             -> AttendancePage (lazy)
  /attendance/groups/:groupId -> AttendanceGroupDetailPage (lazy)
  /people                 -> PeoplePage (lazy)
  /people/:personId       -> PeopleDetailPage (lazy)
  /blog                   -> BlogPage (lazy)
  /blog/:postId           -> BlogPostPage (lazy)
  /teaching-tools         -> TeachingToolsPage (lazy)
  /ai-transcription       -> AITranscriptionPage (lazy)
  /ai-transcription/:recordingId -> AITranscriptionDetailPage (lazy)
```

Navigation links also use the constants:

```typescript
import { ROUTES } from '../lib/routes';

<Link to={ROUTES.ATTENDANCE}>Asistencia</Link>

// For parameterized routes, use a helper:
const toGroupDetail = (groupId: string) =>
  ROUTES.ATTENDANCE_GROUP_DETAIL.replace(':groupId', groupId);

<Link to={toGroupDetail(group.id)}>Ver grupo</Link>
```
