---
title: Co-locate GraphQL Documents with Their Feature
impact: HIGH
tags: graphql, apollo, organization
---

## Rule

Each feature has a `graphql/` subdirectory containing `<feature>.queries.ts` and `<feature>.mutations.ts`. These files export `gql` tagged template literals. Hooks in `hooks/` import from these co-located files. There is no global `graphql/` folder at the `src/` level.

## Correct

### `features/attendance/graphql/attendance.queries.ts`

```typescript
import { gql } from "@apollo/client";

export const GET_ATTENDANCE_GROUPS = gql`
  query GetAttendanceGroups($schoolYearId: ID!) {
    attendanceGroups(schoolYearId: $schoolYearId) {
      id
      name
      grade
      section
      studentCount
    }
  }
`;

export const GET_GROUP_DETAIL = gql`
  query GetGroupDetail($groupId: ID!, $date: Date!) {
    attendanceGroup(id: $groupId) {
      id
      name
      grade
      section
      students {
        id
        fullName
        record(date: $date) {
          status
          note
        }
      }
    }
  }
`;
```

### `features/attendance/graphql/attendance.mutations.ts`

```typescript
import { gql } from "@apollo/client";

export const SUBMIT_ATTENDANCE = gql`
  mutation SubmitAttendance($input: SubmitAttendanceInput!) {
    submitAttendance(input: $input) {
      groupId
      date
      entries {
        studentId
        status
      }
    }
  }
`;
```

### Hook importing from co-located graphql directory

```typescript
// features/attendance/hooks/useAttendanceGroups.ts
import { useQuery } from "@apollo/client";
import { GET_ATTENDANCE_GROUPS } from "../graphql/attendance.queries";
import type { AttendanceGroup } from "../types";

export function useAttendanceGroups(schoolYearId: string) {
  const { data, loading, error } = useQuery(GET_ATTENDANCE_GROUPS, {
    variables: { schoolYearId },
  });

  return {
    groups: (data?.attendanceGroups ?? []) as AttendanceGroup[],
    loading,
    error,
  };
}
```

## Incorrect

Centralizing GraphQL documents in a shared top-level folder:

```
src/
  graphql/
    queries/
      attendance.ts    # WRONG: detached from feature
      blog.ts
    mutations/
      attendance.ts
      blog.ts
  features/
    attendance/
      hooks/
        useAttendanceGroups.ts  # imports from ../../graphql/queries/attendance
```

This breaks feature isolation. When you move or delete a feature, orphaned documents remain in the global folder. Co-location keeps each feature self-contained.

## Structure

```
features/
  attendance/
    graphql/
      attendance.queries.ts
      attendance.mutations.ts
    hooks/
      useAttendanceGroups.ts
      useSubmitAttendance.ts
    components/
    pages/
  blog/
    graphql/
      blog.queries.ts
      blog.mutations.ts
    hooks/
    components/
    pages/
```
