/** Predefined platform roles — always lowercase across the system */
export type UserRole = 'admin' | 'teacher' | 'student'

export interface Role {
  id: string;
  name: UserRole;
  description: string;
  userCount: number;
}

export interface Permission {
  id: string;
  key: string;
  label: string;
  /** Role IDs that have this permission */
  roles: string[];
}

export interface GroupSummary {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleId: string;
  groups: GroupSummary[];
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdBy: string;
  createdAt: string;
}

export interface PeopleManagementProps {
  users: User[];
  groups: Group[];
  roles: Role[];
  permissions: Permission[];

  /** Called when admin creates a new user via the modal form */
  onCreateUser?: (user: Omit<User, "id" | "createdAt">) => void;
  /** Called when admin updates an existing user's profile, role, or groups */
  onUpdateUser?: (userId: string, updates: Partial<User>) => void;
  /** Called when admin deletes a user */
  onDeleteUser?: (userId: string) => void;
  /** Called when admin performs a bulk import of users */
  onBulkImportUsers?: (users: Omit<User, "id" | "createdAt">[]) => void;
  /** Called when admin bulk-deletes selected users */
  onBulkDeleteUsers?: (userIds: string[]) => void;
  /** Called when admin bulk-updates role or group for selected users */
  onBulkUpdateUsers?: (userIds: string[], updates: Partial<Pick<User, "roleId" | "role" | "groups">>) => void;
  /** Called when admin or teacher creates a new group */
  onCreateGroup?: (group: Omit<Group, "id" | "createdAt" | "memberCount">) => void;
  /** Called when admin or teacher updates a group */
  onUpdateGroup?: (groupId: string, updates: Partial<Group>) => void;
  /** Called when admin or teacher deletes a group */
  onDeleteGroup?: (groupId: string) => void;
  /** Called when admin updates permission assignments for a role */
  onUpdatePermissions?: (roleId: string, permissionIds: string[]) => void;
}
