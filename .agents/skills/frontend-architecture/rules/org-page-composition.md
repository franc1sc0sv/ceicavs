---
title: Pages Orchestrate, Components Render
impact: HIGH
tags: architecture, pages, components
---

## Rule

Pages (`*-page.tsx`) are **route entry points**. They:

1. Call hooks to fetch data and manage state.
2. Handle the loading / error / empty state switching.
3. Compose feature components, passing data as props.

Pages contain **no complex JSX**. Components receive **data via props**, never call `useQuery` or manage fetching internally.

---

## Incorrect: Monolithic page with inline data fetching

```tsx
// src/features/attendance/pages/attendance-page.tsx -- WRONG
import { useQuery } from "@apollo/client";
import { GET_ATTENDANCE_GROUPS } from "../graphql/attendance-queries";

export function AttendancePage() {
  const { data, loading, error } = useQuery(GET_ATTENDANCE_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState(new Date());
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");

  if (loading) return <div className="animate-spin ...">...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const groups = data?.attendanceGroups ?? [];
  const filtered = groups
    .filter((g) => (showArchived ? true : !g.archived))
    .filter((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (sortBy === "name" ? a.name.localeCompare(b.name) : /* ... */ 0));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Asistencia</h1>
        <div className="flex gap-2">
          <Input placeholder="Buscar grupo..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as "name" | "date")}>
            {/* 20 more lines of select options */}
          </Select>
          <Switch checked={showArchived} onCheckedChange={setShowArchived} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((group) => (
          <div key={group.id} className="rounded-lg border p-4"
            onClick={() => setSelectedGroup(group.id)}>
            <h3 className="font-semibold">{group.name}</h3>
            <p className="text-sm text-muted-foreground">{group.section.name}</p>
            <p className="text-xs">{group.studentCount} estudiantes</p>
            {/* 30 more lines of card content */}
          </div>
        ))}
      </div>
      {/* ... 50 more lines for the detail panel ... */}
    </div>
  );
}
```

This page has 200+ lines, manages 5 state variables, filters and sorts inline, and contains all the JSX. Impossible to test, reuse, or maintain.

---

## Correct: Page orchestrates, components render

```tsx
// src/features/attendance/hooks/use-attendance-groups.ts
import { useQuery } from "@apollo/client";
import { GET_ATTENDANCE_GROUPS } from "../graphql/attendance-queries";
import type { AttendanceGroup } from "../types";

export function useAttendanceGroups() {
  const { data, loading, error } = useQuery(GET_ATTENDANCE_GROUPS);
  const groups: AttendanceGroup[] = data?.attendanceGroups ?? [];
  return { groups, loading, error };
}
```

```tsx
// src/features/attendance/pages/attendance-page.tsx -- CORRECT
import { useAttendanceGroups } from "../hooks/use-attendance-groups";
import { GroupList } from "../components/group-list";
import { PageLoader } from "@/components/feedback/page-loader";
import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/feedback/empty-state";

export function AttendancePage() {
  const { groups, loading, error } = useAttendanceGroups();

  if (loading) return <PageLoader message="Cargando grupos..." />;
  if (error) return <ErrorState error={error} />;
  if (groups.length === 0) {
    return (
      <EmptyState
        title="Sin grupos de asistencia"
        description="Crea un grupo para comenzar a registrar asistencia."
      />
    );
  }

  return <GroupList groups={groups} />;
}
```

```tsx
// src/features/attendance/components/group-list.tsx
import type { AttendanceGroup } from "../types";
import { GroupCard } from "./group-card";

interface GroupListProps {
  groups: AttendanceGroup[];
}

export function GroupList({ groups }: GroupListProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Asistencia</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
```

The page is ~15 lines. It orchestrates the three states and delegates rendering entirely to `GroupList`.

---

## Dashboard example: Role-based composition

```tsx
// src/features/dashboard/hooks/use-dashboard-data.ts
import { useQuery } from "@apollo/client";
import { GET_DASHBOARD } from "../graphql/dashboard-queries";
import type { DashboardData, UserRole } from "../types";

export function useDashboardData(role: UserRole) {
  const { data, loading, error } = useQuery(GET_DASHBOARD, {
    variables: { role },
  });

  const dashboard: DashboardData | null = data?.dashboard ?? null;
  return { dashboard, loading, error };
}
```

```tsx
// src/features/dashboard/pages/dashboard-page.tsx
import { useAuth } from "@/context/auth-context";
import { useDashboardData } from "../hooks/use-dashboard-data";
import { TeacherDashboard } from "../components/teacher-dashboard";
import { AdminDashboard } from "../components/admin-dashboard";
import { PageLoader } from "@/components/feedback/page-loader";
import { ErrorState } from "@/components/feedback/error-state";

const dashboardByRole = {
  teacher: TeacherDashboard,
  admin: AdminDashboard,
} as const;

export function DashboardPage() {
  const { user } = useAuth();
  const { dashboard, loading, error } = useDashboardData(user.role);

  if (loading) return <PageLoader />;
  if (error) return <ErrorState error={error} />;

  const DashboardView = dashboardByRole[user.role];
  return <DashboardView data={dashboard!} />;
}
```

The page picks the right component based on role and passes the fetched data as a prop. Each role-specific component owns its own layout and cards.

---

## Summary

| Concern              | Lives in          | Example                              |
| -------------------- | ----------------- | ------------------------------------ |
| Data fetching        | `hooks/`          | `useAttendanceGroups()`              |
| State orchestration  | `pages/`          | loading/error/empty switching        |
| Visual rendering     | `components/`     | `GroupList`, `GroupCard`             |
| GraphQL definitions  | `graphql/`        | `GET_ATTENDANCE_GROUPS`              |
| Shared feedback UI   | `src/components/` | `PageLoader`, `ErrorState`           |
