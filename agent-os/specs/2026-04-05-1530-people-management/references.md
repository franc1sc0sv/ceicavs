# References for People Management

## Similar Implementations

### Auth Module (only complete backend module)

- **Location:** `apps/api/src/modules/auth/`
- **Relevance:** The only implemented backend module. Use as the canonical pattern for vertical slice structure, command/query organization, resolver shape, and DI wiring.
- **Key patterns:**
  - `commands/login/`, `commands/refresh-token/` — each command in its own subfolder
  - `queries/get-me/` — query subfolder pattern
  - Module DI wiring: `{ provide: IXRepository, useClass: XRepository }`
  - Thin resolvers dispatching to CommandBus/QueryBus

### Product-Plan Component Prototypes

- **Location:** `product-plan/sections/people/components/`
  - `PeopleList.tsx` — full users table with search, role filter, group filter, bulk selection, floating bulk toolbar
  - `AddUserModal.tsx` — create user form with role toggle and group multi-select
  - `UserTableRow.tsx` — row with avatar initials, role badge, group chips, action dropdown
- **Relevance:** These are working UI prototypes with complete logic. Rebuild using shadcn components; preserve all interaction logic and Spanish copy.
- **Key patterns to borrow:**
  - `useMemo` filtering for search + role + group combined (AND logic)
  - `IndeterminateCheckbox` pattern for select-all
  - Floating bulk toolbar fixed at `bottom-6 left-1/2 -translate-x-1/2`
  - Role badge colors: admin=indigo, teacher=amber, student=slate
  - `roleBadge()` / `avatarBg()` helpers
  - `getInitials(name)` for avatar fallback

### People Section Types

- **Location:** `product-plan/sections/people/types.ts`
- **Relevance:** Canonical TypeScript interfaces for `User`, `Group`, `GroupSummary`, `Role`, `Permission`, `PeopleManagementProps`

### People Section Tests

- **Location:** `product-plan/sections/people/tests.md`
- **Relevance:** Defines all test flows, edge cases, and accessibility requirements. Use as the test spec for the testing agent.

### CASL Ability Matrix

- **Location:** `packages/shared/src/casl.ts`
- **Relevance:** Source of truth for what each role can do. Always use enum values (`Action.X`, `Subject.X`) — never magic strings. Key rules for People:
  - Admin: `Action.MANAGE` on `Subject.ALL` — full CRUD on User, Group
  - Teacher: `Action.MANAGE` on `Subject.GROUP` — but only own groups (enforce `group.createdBy === user.id` in handler)
  - Student: cannot access People section at all

### Prisma Schema

- **Location:** `packages/db/prisma/schema.prisma`
- **Key models:** `User` (with `role`, `deletedAt`, `groups` relation), `Group` (with `deletedAt`, `createdBy`, `members` relation via `GroupMembership`), `GroupMembership`
