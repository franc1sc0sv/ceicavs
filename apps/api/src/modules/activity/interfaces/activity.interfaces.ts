import type { UserRole } from '@ceicavs/shared'

export interface ICreateActivityData {
  type: string
  description: string
  actorId: string
  actorRole: UserRole
  entityId?: string
  entityType?: string
}
