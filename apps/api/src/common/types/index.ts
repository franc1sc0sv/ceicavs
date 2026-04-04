import type { UserRole } from '@ceicavs/shared'

export interface IJwtUser {
  id: string
  role: UserRole
  email: string
}
