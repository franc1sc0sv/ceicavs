import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'

export const UserRole = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const Action = {
  MANAGE: 'manage',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  PUBLISH: 'publish',
  APPROVE: 'approve',
  REJECT: 'reject',
  SUBMIT: 'submit',
  EXPORT: 'export',
  TRANSCRIBE: 'transcribe',
} as const

export type Action = (typeof Action)[keyof typeof Action]

export const Subject = {
  USER: 'User',
  GROUP: 'Group',
  ATTENDANCE_RECORD: 'AttendanceRecord',
  ATTENDANCE_SUBMISSION: 'AttendanceSubmission',
  POST: 'Post',
  CATEGORY: 'Category',
  COMMENT: 'Comment',
  REACTION: 'Reaction',
  TOOL: 'Tool',
  FAVORITE: 'Favorite',
  FOLDER: 'Folder',
  RECORDING: 'Recording',
  TRANSCRIPTION: 'Transcription',
  ACTIVITY: 'Activity',
  ALL: 'all',
} as const

export type Subject = (typeof Subject)[keyof typeof Subject]

export type AppAbility = MongoAbility<[Action, Subject]>

export function defineAbilityFor(role: UserRole): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility,
  )

  if (role === UserRole.ADMIN) {
    can(Action.MANAGE, Subject.ALL)
  }

  if (role === UserRole.TEACHER) {
    can(Action.READ, Subject.USER)
    cannot(Action.CREATE, Subject.USER)
    cannot(Action.DELETE, Subject.USER)
    cannot(Action.UPDATE, Subject.USER)

    can(Action.READ, Subject.GROUP)
    can(Action.CREATE, Subject.GROUP)
    can(Action.UPDATE, Subject.GROUP)
    can(Action.DELETE, Subject.GROUP)

    can(Action.MANAGE, Subject.ATTENDANCE_RECORD)
    can(Action.MANAGE, Subject.ATTENDANCE_SUBMISSION)
    can(Action.EXPORT, Subject.ATTENDANCE_RECORD)

    can(Action.READ, Subject.POST)
    can(Action.CREATE, Subject.POST)
    can(Action.UPDATE, Subject.POST)
    can(Action.DELETE, Subject.POST)
    can(Action.PUBLISH, Subject.POST)
    can(Action.APPROVE, Subject.POST)
    can(Action.REJECT, Subject.POST)

    can(Action.MANAGE, Subject.CATEGORY)

    can(Action.MANAGE, Subject.COMMENT)
    can(Action.MANAGE, Subject.REACTION)

    can(Action.READ, Subject.TOOL)
    can(Action.MANAGE, Subject.FAVORITE)

    can(Action.MANAGE, Subject.FOLDER)
    can(Action.MANAGE, Subject.RECORDING)
    can(Action.TRANSCRIBE, Subject.RECORDING)
    can(Action.READ, Subject.TRANSCRIPTION)

    can(Action.READ, Subject.ACTIVITY)
  }

  if (role === UserRole.STUDENT) {
    can(Action.READ, Subject.USER)

    can(Action.READ, Subject.GROUP)

    can(Action.READ, Subject.ATTENDANCE_RECORD)

    can(Action.READ, Subject.POST)
    can(Action.CREATE, Subject.POST)
    can(Action.SUBMIT, Subject.POST)
    can(Action.UPDATE, Subject.POST)
    can(Action.DELETE, Subject.POST)

    can(Action.CREATE, Subject.COMMENT)
    can(Action.UPDATE, Subject.COMMENT)
    can(Action.DELETE, Subject.COMMENT)
    can(Action.MANAGE, Subject.REACTION)

    can(Action.READ, Subject.TOOL)
    can(Action.MANAGE, Subject.FAVORITE)

    can(Action.READ, Subject.ACTIVITY)
  }

  return build()
}
