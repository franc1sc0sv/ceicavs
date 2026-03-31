# People Management

## Overview

Centralized hub for managing all platform users and groups. Admins can create, edit, and delete users with role assignments, while both admins and teachers can create and manage groups. Includes search, filtering, bulk operations, and role-based permissions configuration.

## Components Provided

- `PeopleList` — Main view with a searchable, filterable table of users, a groups sub-view, bulk operations toolbar, and permissions panel. Teachers see a restricted view showing only their own groups.
- `UserTableRow` — A single row in the users table displaying name, role badge, and group tags. Includes edit and delete action buttons.
- `AddUserModal` — Modal form for creating a new user with fields for name, email, role selection, and group assignment.

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onCreateUser(user)` | Admin submits the "Add User" modal form |
| `onUpdateUser(userId, updates)` | Admin saves changes to a user's profile, role, or group memberships |
| `onDeleteUser(userId)` | Admin confirms deletion of a user |
| `onCreateGroup(group)` | Admin or teacher creates a new group |
| `onUpdateGroup(groupId, updates)` | Admin or teacher saves changes to a group |
| `onDeleteGroup(groupId)` | Admin or teacher confirms deletion of a group |
| `onBulkImportUsers(users)` | Admin submits a bulk user import |
| `onBulkDeleteUsers(userIds)` | Admin confirms bulk deletion of selected users |
| `onBulkUpdateUsers(userIds, updates)` | Admin applies role or group changes to multiple selected users |
| `onUpdatePermissions(roleId, permissionIds)` | Admin updates permission assignments for a role |

## Data Shapes

**`User`** — A platform user: `id`, `name`, `email`, `role` (admin/teacher/student), `roleId`, `groups` (array of `GroupSummary`), `createdAt`.

**`Group`** — A user group: `id`, `name`, `description`, `memberCount`, `createdBy`, `createdAt`.

**`GroupSummary`** — Lightweight group reference: `id`, `name`.

**`Role`** — A platform role: `id`, `name` (admin/teacher/student), `description`, `userCount`.

**`Permission`** — A permission entry: `id`, `key`, `label`, `roles` (array of role IDs).

**`PeopleManagementProps`** — Top-level: `users`, `groups`, `roles`, `permissions`, plus all callbacks.

See `types.ts` for full interface definitions.
