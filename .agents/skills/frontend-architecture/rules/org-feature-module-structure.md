---
title: Feature Modules Are Self-Contained
impact: CRITICAL
tags: organization, architecture, feature
---

## Rule

Every feature in `src/features/<feature>/` has exactly **4 subdirectories**:

```
src/features/<feature>/
  pages/          # Route entry points
  components/     # Feature-scoped UI components
  hooks/          # Feature-scoped data/logic hooks
  graphql/        # Co-located queries, mutations, fragments
```

No `utils/`, `types/`, `services/`, or other subdirectories inside a feature.

**Types placement**: Feature-local types go in the file that uses them. If a type is shared across multiple files within the same feature, place it in a `types.ts` at the feature root (`src/features/attendance/types.ts`).

---

## Incorrect: Type-first / global-first organization

```
src/
  components/
    attendance/
      AttendanceGroupCard.tsx    # WRONG: feature component in global dir
  hooks/
    useAttendanceGroups.ts       # WRONG: feature hook in global dir
  types/
    attendance.ts                # WRONG: feature types in global dir
```

This scatters attendance logic across the entire `src/` tree. Finding all attendance code requires searching everywhere.

---

## Correct: Feature-first organization

```
src/features/attendance/
  pages/
    attendance-page.tsx
    group-detail-page.tsx
  components/
    group-card.tsx
    student-row.tsx
    mark-attendance-dialog.tsx
  hooks/
    use-attendance-groups.ts
    use-mark-attendance.ts
  graphql/
    attendance-queries.ts
    attendance-mutations.ts
  types.ts                       # shared within this feature only
```

---

## Incorrect: Global hooks for feature logic

```tsx
// src/hooks/useAttendanceGroups.ts  -- WRONG location
import { useQuery } from "@apollo/client";
import { GET_ATTENDANCE_GROUPS } from "../graphql/attendance-queries";

export function useAttendanceGroups(sectionId: string) {
  return useQuery(GET_ATTENDANCE_GROUPS, { variables: { sectionId } });
}
```

---

## Correct: Feature-scoped hook

```tsx
// src/features/attendance/hooks/use-attendance-groups.ts
import { useQuery } from "@apollo/client";
import { GET_ATTENDANCE_GROUPS } from "../graphql/attendance-queries";
import type { AttendanceGroup } from "../types";

export function useAttendanceGroups(sectionId: string) {
  const { data, loading, error } = useQuery(GET_ATTENDANCE_GROUPS, {
    variables: { sectionId },
  });

  const groups: AttendanceGroup[] = data?.attendanceGroups ?? [];

  return { groups, loading, error };
}
```

---

## All 6 features follow this pattern

| Feature            | Path                              |
| ------------------ | --------------------------------- |
| Dashboard          | `src/features/dashboard/`         |
| Attendance         | `src/features/attendance/`        |
| People             | `src/features/people/`            |
| Blog               | `src/features/blog/`              |
| Teaching Tools     | `src/features/teaching-tools/`    |
| AI Transcription   | `src/features/ai-transcription/`  |
