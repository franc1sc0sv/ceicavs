# People Management Tests

## Overview

Tests verify that the People section renders user and group lists correctly, enforces role-based access (admin full CRUD vs. teacher own-groups-only), validates form inputs in the add/edit user modal, handles bulk operations, and fires all callbacks with the correct arguments.

---

## User Flow Tests

### Flow 1: Admin creates a new user

**Success Path**

1. Render `PeopleList` with `role="admin"`, an array of users, groups, and roles
2. - [ ] The users table displays all users with columns: Name, Role, Groups
3. - [ ] The "Add User" button is visible
4. Click the "Add User" button
5. - [ ] The `AddUserModal` opens with fields: Name, Email, Role (dropdown), Group (multi-select)
6. Fill in Name: "Ana Torres", Email: "ana@school.edu", Role: "student", Group: "Group 7A"
7. Click "Save" / "Create"
8. - [ ] `onCreateUser` is called with `{ name: "Ana Torres", email: "ana@school.edu", role: "student", roleId: "<student-role-id>", groups: [{ id: "g1", name: "Group 7A" }] }`
9. - [ ] The modal closes

**Failure Path**

1. Open the `AddUserModal` and leave the Name field empty
2. Click "Save"
3. - [ ] A validation error is shown on the Name field (e.g., "Name is required")
4. - [ ] `onCreateUser` is NOT called
5. Enter a name but provide an invalid email format
6. - [ ] A validation error is shown on the Email field (e.g., "Invalid email address")

### Flow 2: Admin performs bulk operations

**Success Path**

1. Render the users table with 10 users
2. - [ ] Each row has a checkbox for selection
3. Select 3 users by clicking their checkboxes
4. - [ ] A bulk operations toolbar appears showing "3 selected"
5. - [ ] Toolbar includes "Delete Selected" and "Update Role/Group" actions
6. Click "Delete Selected"
7. - [ ] A confirmation dialog appears (e.g., "Delete 3 users? This cannot be undone.")
8. Confirm the deletion
9. - [ ] `onBulkDeleteUsers` is called with an array of the 3 selected user IDs

**Failure Path**

1. Select 0 users
2. - [ ] The bulk operations toolbar is hidden
3. - [ ] No bulk actions are available

### Flow 3: Teacher views only their own groups

**Success Path**

1. Render `PeopleList` with `role="teacher"` (the component should restrict the view)
2. - [ ] The full users table is NOT visible to the teacher
3. - [ ] The teacher sees only their own groups in the groups sub-view
4. - [ ] The "Add User" button is NOT visible (only admins can create users)
5. - [ ] The teacher can create a new group (e.g., "Create Group" button is visible)
6. Click "Create Group" and fill in name: "Afternoon Lab" and description: "Tuesday lab section"
7. - [ ] `onCreateGroup` is called with `{ name: "Afternoon Lab", description: "Tuesday lab section", createdBy: "<teacher-id>" }`

**Failure Path**

1. Teacher attempts to edit a group they did not create
2. - [ ] Edit and delete actions are not shown for groups not created by the teacher

### Flow 4: Admin manages permissions

**Success Path**

1. Navigate to the permissions configuration panel
2. - [ ] A matrix or list of permissions is shown with checkboxes per role
3. Toggle a permission for the "teacher" role (e.g., enable "manage_blog_categories")
4. - [ ] `onUpdatePermissions` is called with the teacher's `roleId` and the updated array of `permissionIds`

---

## Empty State Tests

- [ ] When `users` is empty, a message is shown (e.g., "No users found")
- [ ] When `groups` is empty, a message is shown (e.g., "No groups created yet")
- [ ] When search returns no results, a message is shown (e.g., "No users match your search")
- [ ] When a group has 0 members, the member count displays "0 members"

---

## Component Interaction Tests

- [ ] Search bar filters users by name in real-time as the user types
- [ ] Role dropdown filter shows "All", "Admin", "Teacher", "Student" options and filters the table
- [ ] Group dropdown filter shows all groups and filters users by group membership
- [ ] `UserTableRow` displays group names as tags/chips
- [ ] Clicking a user row opens the user detail/edit view
- [ ] Clicking "Delete" on a `UserTableRow` shows a confirmation dialog before calling `onDeleteUser`
- [ ] The `AddUserModal` role dropdown populates from the `roles` prop
- [ ] The `AddUserModal` group multi-select populates from the `groups` prop

---

## Edge Cases

- [ ] Creating a user with an email that already exists shows a validation message
- [ ] Deleting the last admin shows a warning (cannot leave the platform without an admin)
- [ ] Bulk importing users with CSV handles malformed rows gracefully
- [ ] A user belonging to 10+ groups displays all group tags without layout breakage
- [ ] Very long user names truncate with ellipsis in the table
- [ ] Filtering by both role and group simultaneously works correctly (AND logic)
- [ ] Selecting all users via a "select all" checkbox includes only visible (filtered) users

---

## Accessibility Checks

- [ ] The users table uses proper `<table>`, `<thead>`, `<tbody>`, `<th>`, and `<td>` elements
- [ ] Checkbox selection is keyboard-accessible and announces selected state
- [ ] The `AddUserModal` traps focus when open and returns focus to the trigger button on close
- [ ] The confirmation dialog for delete is keyboard-accessible (Escape to cancel, Enter to confirm)
- [ ] Role badges include text labels (not color alone)
- [ ] The bulk operations toolbar is announced to screen readers when it appears
- [ ] All form fields in the modal have associated labels

---

## Sample Test Data

```typescript
import type { User, Group, Role, Permission, GroupSummary } from "./types";

const mockRoles: Role[] = [
  { id: "role-admin", name: "admin", description: "Full platform access", userCount: 2 },
  { id: "role-teacher", name: "teacher", description: "Manage own groups and content", userCount: 8 },
  { id: "role-student", name: "student", description: "Participate in groups and blog", userCount: 120 },
];

const mockGroups: Group[] = [
  { id: "g1", name: "Group 7A", description: "7th grade section A", memberCount: 28, createdBy: "teacher-1", createdAt: "2026-01-15T10:00:00Z" },
  { id: "g2", name: "Group 8B", description: "8th grade section B", memberCount: 25, createdBy: "teacher-2", createdAt: "2026-01-15T10:00:00Z" },
  { id: "g3", name: "Group 9C", description: "9th grade section C", memberCount: 30, createdBy: "teacher-1", createdAt: "2026-02-01T10:00:00Z" },
];

const mockUsers: User[] = [
  {
    id: "u1",
    name: "Admin Rodriguez",
    email: "admin@ceicavs.edu",
    role: "admin",
    roleId: "role-admin",
    groups: [],
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "u2",
    name: "Prof. Ana Lopez",
    email: "ana.lopez@ceicavs.edu",
    role: "teacher",
    roleId: "role-teacher",
    groups: [{ id: "g1", name: "Group 7A" }, { id: "g3", name: "Group 9C" }],
    createdAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "u3",
    name: "Maria Fernandez",
    email: "maria.f@ceicavs.edu",
    role: "student",
    roleId: "role-student",
    groups: [{ id: "g1", name: "Group 7A" }],
    createdAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "u4",
    name: "Carlos Mendez",
    email: "carlos.m@ceicavs.edu",
    role: "student",
    roleId: "role-student",
    groups: [{ id: "g1", name: "Group 7A" }, { id: "g2", name: "Group 8B" }],
    createdAt: "2026-01-20T00:00:00Z",
  },
];

const mockPermissions: Permission[] = [
  { id: "perm-1", key: "manage_users", label: "Manage Users", roles: ["role-admin"] },
  { id: "perm-2", key: "manage_all_groups", label: "Manage All Groups", roles: ["role-admin"] },
  { id: "perm-3", key: "manage_own_groups", label: "Manage Own Groups", roles: ["role-admin", "role-teacher"] },
  { id: "perm-4", key: "manage_blog_categories", label: "Manage Blog Categories", roles: ["role-admin", "role-teacher"] },
  { id: "perm-5", key: "approve_drafts", label: "Approve Blog Drafts", roles: ["role-admin", "role-teacher"] },
  { id: "perm-6", key: "manage_recordings", label: "Manage Recordings", roles: ["role-admin", "role-teacher"] },
];
```
