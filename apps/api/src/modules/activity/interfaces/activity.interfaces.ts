import type { UserRole } from '@ceicavs/shared'

export const ActivityType = {
  ATTENDANCE_SUBMITTED: 'ATTENDANCE_SUBMITTED',
  POST_CREATED: 'POST_CREATED',
  DRAFT_REVIEWED: 'DRAFT_REVIEWED',
  POST_PUBLISHED: 'POST_PUBLISHED',
  USER_CREATED: 'USER_CREATED',
  USER_DELETED: 'USER_DELETED',
} as const
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType]

export const ActivityEntityType = {
  GROUP: 'GROUP',
  POST: 'POST',
  USER: 'USER',
} as const
export type ActivityEntityType = (typeof ActivityEntityType)[keyof typeof ActivityEntityType]

export interface ICreateActivityData {
  type: ActivityType
  description: string
  actorId: string
  actorRole: UserRole
  entityId?: string
  entityType?: ActivityEntityType
}
