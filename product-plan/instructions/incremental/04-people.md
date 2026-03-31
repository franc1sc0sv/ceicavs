# Milestone 4: People

Provide alongside: `product-overview.md`

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Build a centralized hub for managing all platform users and groups. Admins have full CRUD access to users, groups, roles, and permissions. Teachers see a restricted view limited to their own groups. Students do not have access to this section at all (it is hidden from their sidebar).

## Overview

The People section contains a user list with search and filters, modal forms for creating and editing users, a groups sub-view for managing group membership, a permissions configuration panel, and support for bulk operations. The teacher's view is scoped: they can only see and manage their own groups and the students within them, never the full user list or other teachers' groups.

## Key Functionality

- **User list (admin)**: searchable, filterable table with columns for name, role, and groups; text search bar with dropdown filters for role and group
- **Add user (admin)**: modal form with fields for name, email, role selector, and group assignment
- **Edit user (admin)**: same modal pre-filled with user data; can update profile, role, or group memberships
- **Delete user (admin)**: confirmation dialog before removal
- **User detail**: profile page showing basic info, role, and list of groups the user belongs to
- **Groups sub-view**: dedicated tab/sub-page listing all groups with member counts; group detail shows group info and member list
- **Group CRUD**: admin can create, edit, or delete any group; teacher can create, edit, or delete only their own groups
- **Bulk operations (admin)**: checkboxes on table rows enable a bulk toolbar for import, delete, and mass role/group changes
- **Permissions config (admin)**: panel to view and edit which permissions are assigned to each role
- **Teacher restriction**: teachers only see groups they created or are assigned to; they cannot see the full user list, other teachers' groups, or the permissions panel

## Components Provided

| File | Description |
|------|-------------|
| `sections/people/components/PeopleList.tsx` | User list with search, filters, table, and bulk toolbar |
| `sections/people/components/UserTableRow.tsx` | Single row in the user table |
| `sections/people/components/AddUserModal.tsx` | Modal form for creating/editing a user |
| `sections/people/components/index.ts` | Barrel exports |

## Props Reference

### PeopleManagementProps (top-level)

| Prop | Type | Description |
|------|------|-------------|
| `users` | `User[]` | List of all users (admin) or scoped users (teacher) |
| `groups` | `Group[]` | List of all groups (admin) or own groups (teacher) |
| `roles` | `Role[]` | Available roles with descriptions and user counts |
| `permissions` | `Permission[]` | Permission definitions with role assignments |
| `onCreateUser` | `(user: Omit<User, 'id' \| 'createdAt'>) => void` | Create a new user |
| `onUpdateUser` | `(userId: string, updates: Partial<User>) => void` | Update user profile/role/groups |
| `onDeleteUser` | `(userId: string) => void` | Delete a user |
| `onBulkImportUsers` | `(users: Omit<User, 'id' \| 'createdAt'>[]) => void` | Bulk import users |
| `onBulkDeleteUsers` | `(userIds: string[]) => void` | Bulk delete selected users |
| `onBulkUpdateUsers` | `(userIds: string[], updates: Partial<Pick<User, 'roleId' \| 'role' \| 'groups'>>) => void` | Bulk update role/group |
| `onCreateGroup` | `(group: Omit<Group, 'id' \| 'createdAt' \| 'memberCount'>) => void` | Create a group |
| `onUpdateGroup` | `(groupId: string, updates: Partial<Group>) => void` | Update a group |
| `onDeleteGroup` | `(groupId: string) => void` | Delete a group |
| `onUpdatePermissions` | `(roleId: string, permissionIds: string[]) => void` | Update role permissions |

### User data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | User identifier |
| `name` | `string` | Full name |
| `email` | `string` | Email address |
| `role` | `UserRole` | `'admin' \| 'teacher' \| 'student'` |
| `roleId` | `string` | Role record identifier |
| `groups` | `GroupSummary[]` | Groups the user belongs to (`{ id, name }`) |
| `createdAt` | `string` | ISO timestamp |

### Group data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Group identifier |
| `name` | `string` | Group display name |
| `description` | `string` | Group description |
| `memberCount` | `number` | Number of members |
| `createdBy` | `string` | Creator user ID |
| `createdAt` | `string` | ISO timestamp |

### Permission data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Permission identifier |
| `key` | `string` | Permission key (e.g., `'users.create'`, `'blog.publish'`) |
| `label` | `string` | Human-readable label |
| `roles` | `string[]` | Role IDs that have this permission |

## Expected User Flows

### Flow 1: Admin creates a new user
1. Admin opens People and sees the full user list with search bar and role/group filters
2. Admin clicks "Add User" button — the AddUserModal opens
3. Admin fills in name, email, selects a role, and assigns one or more groups
4. Admin clicks "Save" — `onCreateUser` fires, modal closes, user appears in the list

### Flow 2: Admin manages groups
1. Admin switches to the Groups sub-view and sees all groups with member counts
2. Admin clicks a group to see its detail view with the member list
3. Admin clicks "Create Group" and fills in name and description
4. Admin assigns members to the group and saves

### Flow 3: Teacher manages own group
1. Teacher opens People and sees only their own groups (not the full user list)
2. Teacher clicks on their group to view its members
3. Teacher clicks "Create Group" to add a new group and assigns students from their roster
4. Teacher cannot see other teachers' groups or the permissions panel

### Flow 4: Admin configures permissions
1. Admin navigates to the Permissions configuration panel
2. Admin sees a matrix of roles and permissions (e.g., `users.create`, `blog.publish`)
3. Admin toggles a permission for a role — `onUpdatePermissions` fires
4. Changes take effect for all users with that role

## Empty States

- **No users found (search/filter)**: "No se encontraron usuarios" / "No users found" with a suggestion to adjust filters
- **No groups yet**: "No hay grupos creados" / "No groups created yet" with a CTA to create one
- **Empty group (no members)**: "Este grupo no tiene miembros" / "This group has no members" with a CTA to add members
- **Teacher with no groups**: "No tienes grupos asignados" / "You don't have any groups yet" with a CTA to create one

## Testing

Refer to `sections/people/tests.md` for detailed test specs covering:
- User list renders with correct columns
- Search and filter functionality
- Create/edit/delete user flows
- Group CRUD operations
- Bulk operations toolbar
- Teacher scoped view restrictions
- Permission configuration changes
- Confirmation dialogs for destructive actions

## Files to Reference

| File | Purpose |
|------|---------|
| `product/sections/people/spec.md` | Full section specification |
| `product/sections/people/types.ts` | TypeScript interfaces |
| `product/sections/people/data.json` | Sample data |
| `sections/people/components/PeopleList.tsx` | User list component |
| `sections/people/components/UserTableRow.tsx` | Table row component |
| `sections/people/components/AddUserModal.tsx` | Create/edit user modal |

## Done When

- [ ] People section renders inside the AppShell (hidden from student sidebar)
- [ ] Admin sees the full user list with name, role, and groups columns
- [ ] Search bar filters users by name or email
- [ ] Role and group dropdown filters work correctly
- [ ] "Add User" modal opens with fields for name, email, role, and group assignment
- [ ] Creating a user fires `onCreateUser` and updates the list
- [ ] Editing a user pre-fills the modal and fires `onUpdateUser`
- [ ] Deleting a user shows a confirmation dialog and fires `onDeleteUser`
- [ ] Groups sub-view lists all groups with member counts
- [ ] Group detail view shows group info and member list
- [ ] Group CRUD (create, edit, delete) works for both admin and teacher
- [ ] Bulk operations toolbar appears when checkboxes are selected (admin only)
- [ ] Bulk import, delete, and role/group update callbacks fire correctly
- [ ] Permissions configuration panel displays role-permission matrix (admin only)
- [ ] Teacher only sees their own groups and cannot access the full user list
- [ ] Teacher cannot see the permissions panel
- [ ] Confirmation dialogs display for all destructive actions
- [ ] Empty states show for no results, no groups, and empty groups
