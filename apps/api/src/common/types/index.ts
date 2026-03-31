import type { UserRole } from '@ceicavs/shared'

export interface AuthUser {
  id: string
  role: UserRole
  email: string
}
