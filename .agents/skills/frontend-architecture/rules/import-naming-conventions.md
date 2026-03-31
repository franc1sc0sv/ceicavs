---
title: File and Export Naming Conventions
impact: MEDIUM
tags: naming, exports, conventions
---

## Rule

- **Files**: always `kebab-case` with lowercase (`group-card.tsx`, `use-attendance-groups.ts`).
- **Component exports**: `PascalCase` (`GroupCard`, `AttendanceTable`).
- **Hook exports**: `camelCase` with `use` prefix (`useAttendanceGroups`, `useBlogFeed`).
- **GraphQL constants**: `SCREAMING_SNAKE_CASE` (`GET_ATTENDANCE_GROUPS`, `CREATE_POST`).
- **Page files**: end with `-page.tsx` suffix (`blog-page.tsx`, `grades-page.tsx`).
- **Exports**: always named exports. Default exports only for `React.lazy` page components.

## File to Export Mapping

### Components

```tsx
// features/attendance/components/group-card.tsx
export function GroupCard({ group }: GroupCardProps) { ... }

// features/blog/components/post-list.tsx
export function PostList({ posts }: PostListProps) { ... }

// features/grades/components/grade-entry-form.tsx
export function GradeEntryForm({ studentId }: GradeEntryFormProps) { ... }
```

### Hooks

```tsx
// features/attendance/hooks/use-attendance-groups.ts
export function useAttendanceGroups(sectionId: string) { ... }

// features/blog/hooks/use-blog-feed.ts
export function useBlogFeed(sectionId: string) { ... }

// features/grades/hooks/use-grade-submission.ts
export function useGradeSubmission() { ... }
```

### GraphQL

```tsx
// features/attendance/graphql/attendance.queries.ts
export const GET_ATTENDANCE_GROUPS = gql`
  query GetAttendanceGroups($sectionId: ID!) {
    attendanceGroups(sectionId: $sectionId) {
      id
      name
      students { id firstName lastName }
    }
  }
`;

// features/blog/graphql/blog.mutations.ts
export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) { id title }
  }
`;
```

### Pages

```tsx
// features/attendance/pages/attendance-page.tsx
// Named export for direct use
export function AttendancePage() { ... }

// Default export ONLY for React.lazy
export default AttendancePage;
```

```tsx
// router.tsx
const AttendancePage = lazy(() => import("@/features/attendance/pages/attendance-page"));
const BlogPage = lazy(() => import("@/features/blog/pages/blog-page"));
const GradesPage = lazy(() => import("@/features/grades/pages/grades-page"));
```

### Types

```tsx
// features/attendance/types/attendance.types.ts
export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
}

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
```

## Quick Reference

| Category | File Name | Export Name | Export Style |
|----------|-----------|-------------|-------------|
| Component | `group-card.tsx` | `GroupCard` | `export function` |
| Hook | `use-blog-feed.ts` | `useBlogFeed` | `export function` |
| GraphQL query | `attendance.queries.ts` | `GET_ATTENDANCE_GROUPS` | `export const` |
| GraphQL mutation | `blog.mutations.ts` | `CREATE_POST` | `export const` |
| Page | `grades-page.tsx` | `GradesPage` | named + default |
| Type | `attendance.types.ts` | `AttendanceRecord` | `export interface` |
| Utility | `format-grade.ts` | `formatGrade` | `export function` |
