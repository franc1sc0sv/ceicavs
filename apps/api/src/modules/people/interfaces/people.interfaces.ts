import type { UserRole } from '@ceicavs/shared'

export interface IUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl: string | null
  createdAt: Date
  deletedAt: Date | null
  groups?: { id: string; name: string }[]
}

export interface IGroup {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  memberCount?: number
}

export interface IGroupMember {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl: string | null
  joinedAt: Date
}

export interface IUserFilters {
  search?: string
  role?: UserRole
  groupId?: string
  isDeactivated?: boolean
}

export interface IGroupFilters {
  search?: string
  createdBy?: string
}

export interface ICreateUserData {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface IUpdateUserData {
  name?: string
  email?: string
  role?: UserRole
}

export interface ICreateGroupData {
  name: string
  description?: string
}

export interface IUpdateGroupData {
  name?: string
  description?: string
}

export interface IImportUserRow {
  name: string
  email: string
  role: UserRole
}

export interface IImportUsersResult {
  created: number
  skipped: number
  errors: string[]
}
