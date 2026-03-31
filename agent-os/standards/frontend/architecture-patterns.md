# Frontend Architecture Patterns

## 1. Feature-First Folders

Each feature has exactly 4 subdirectories:

```
features/[section]/
  pages/          # Route-level components (lazy-loaded)
  components/     # Feature-local UI
  hooks/          # Feature-local data/logic hooks
  graphql/        # Co-located queries + mutations
```

- Feature-local types go in `features/[section]/types.ts`.
- **Promotion rule:** Code stays feature-local until a **second feature** needs it. Exception: cross-cutting components (`PageLoader`, `ErrorState`, `EmptyState`, shell components) go to `src/components/` from the start.
- No barrel files. Import directly from the file that defines the export.

## 2. Apollo vs Context State Split

| What | Where |
|---|---|
| Server data (GraphQL) | Apollo Client hooks (`useQuery`, `useMutation`) |
| UI state (theme, sidebar, locale) | React Context |
| Auth state (user, token) | React Context (`auth.context.tsx`) |
| Permissions | React Context (`ability.context.tsx`) |
| Form fields, modal open/close | Local `useState` |

- Never mix Apollo cache with React context state.
- Never store server data in context.

## 3. Four-State Rendering (Mandatory)

Every data-fetching component handles all 4 states in this order:

```typescript
const { data, loading, error } = useQuery(GET_ITEMS)

if (loading) return <PageLoader />
if (error) return <ErrorState error={error} onRetry={() => refetch()} />
if (!data?.items?.length) return <EmptyState />

return <ItemList items={data.items} />
```

- Order: loading -> error -> empty -> success. Always.
- Use shared `PageLoader`, `ErrorState`, `EmptyState` components for consistency.

## 4. CASL Permission Patterns

Two ways to check permissions — both use the same CASL source:

```typescript
// Programmatic (in hooks/logic)
const ability = useAbility()
if (!ability.can('create', 'Post')) return null

// Declarative (in JSX)
<Can I="delete" a="Group">
  <DeleteGroupButton />
</Can>
```

- Never hardcode role strings (`role === 'admin'`). Always use CASL.
- `useAbility()` and `<Can>` from `context/ability.context.tsx`.

## 5. Named Exports Everywhere

```typescript
// Good
export function AttendanceCard() { ... }
export function useAttendanceGroups() { ... }

// Bad
export default function AttendanceCard() { ... }
```

- Only exception: lazy-loaded page components (`React.lazy()` requires default export).
- Named exports are searchable and refactor-friendly.
