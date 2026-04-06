# People Management — Shaping Notes

## Scope

Full-stack implementation of milestone 04 (People). Centralized hub for managing users and groups across the CEICAVS platform.

**Backend** (`feat/04a-people-backend`):
- User CRUD with soft-delete
- Group CRUD with soft-delete
- Member management (add/remove members to groups)
- Role assignment
- Bulk operations: bulk delete, bulk role update
- CSV bulk import (parse rows, validate, create users in one transaction)

**Frontend** (`feat/04b-people-frontend`):
- Two-tab layout: Usuarios / Grupos
- Users tab: searchable + filterable table with row selection, bulk toolbar, add/edit/delete
- Groups tab: card grid with create/edit/delete, member count
- All modals built with shadcn/ui components
- CSV import dialog with preview and validation feedback
- Full i18n (es/en)

## Decisions

- **Permissions panel out of scope** — CASL is code-defined in `packages/shared/src/casl.ts`; no DB-backed permissions mutation
- **CSV import is in scope** — handled via `ImportUsersCommand`; validate rows before insert, skip malformed rows, return counts
- **Teacher view restriction** — Teachers see only the Groups tab (their own groups). They cannot see the Users tab. Enforced via CASL inside handlers and hidden via `<Can>` in frontend.
- **shadcn/ui for all UI** — use shadcn MCP to add: Table, Badge, Button, Input, Select, Checkbox, Sheet, AlertDialog, Form, Card, Tabs, DropdownMenu, Separator
- **Side sheets instead of dialogs** — all create/edit forms (user, group, CSV import) open as side sheets (`Sheet` from shadcn), not centered dialogs. Delete confirmations remain `AlertDialog`.
- **No `AssignRoleCommand` separate handler** — role is updated via `UpdateUserCommand` (role is just a field on User)
- **Groups tab is visible to Teacher** — but Teachers only see groups where `createdBy === currentUser.id`

## Context

- **Visuals:** `visuals/ui-mockup.md` — ASCII mockups generated from product-plan component prototypes
- **References:** `product-plan/sections/people/components/` — full working prototype components (raw Tailwind, not shadcn). Use as logic reference, rebuild with shadcn.
- **Product alignment:** Milestone 04 in the implementation plan. Both branches are Wave 2 parallel work — backend and frontend are independent worktrees.

## Standards Applied

- `backend/cqrs-patterns` — every write in a command, every read in a query, CASL inside handlers, thin resolvers
- `database/prisma-kysely-patterns` — soft delete via `deletedAt`, TxClient contract, snake_case mapping
- `frontend/architecture-patterns` — feature-first folders, Apollo for server data, four-state rendering, CASL via `useAbility()`/`<Can>`
- `frontend/design-system` — Tailwind v4 color tokens, dark mode, responsive layout
