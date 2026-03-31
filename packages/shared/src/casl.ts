import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import type { UserRole } from './types'

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export type Action =
  | 'manage'   // wildcard — all actions
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'publish'  // post: publish directly (admin/teacher only)
  | 'approve'  // post: approve a student draft
  | 'reject'   // post: reject a student draft
  | 'submit'   // post: submit as draft (student only)
  | 'export'   // attendance: export PDF/Excel
  | 'transcribe' // recording: trigger AI transcription

// ---------------------------------------------------------------------------
// Subjects
// ---------------------------------------------------------------------------
export type Subject =
  | 'User'
  | 'Group'
  | 'AttendanceRecord'
  | 'AttendanceSubmission'
  | 'Post'
  | 'Category'
  | 'Comment'
  | 'Reaction'
  | 'Tool'
  | 'Favorite'
  | 'Folder'
  | 'Recording'
  | 'Transcription'
  | 'Activity'
  | 'all'   // CASL wildcard

export type AppAbility = MongoAbility<[Action, Subject]>

// ---------------------------------------------------------------------------
// Ability factory — call with the authenticated user's role
// ---------------------------------------------------------------------------
export function defineAbilityFor(role: UserRole): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility,
  )

  if (role === 'admin') {
    // Admins can do everything
    can('manage', 'all')
  }

  if (role === 'teacher') {
    // Users
    can('read', 'User')
    cannot('create', 'User')
    cannot('delete', 'User')
    cannot('update', 'User')

    // Groups — teachers manage their own groups
    can('read', 'Group')
    can('create', 'Group')
    can('update', 'Group')
    can('delete', 'Group')

    // Attendance — full control
    can('manage', 'AttendanceRecord')
    can('manage', 'AttendanceSubmission')
    can('export', 'AttendanceRecord')

    // Blog — publish their own, approve/reject student drafts
    can('read', 'Post')
    can('create', 'Post')
    can('update', 'Post')
    can('delete', 'Post')
    can('publish', 'Post')
    can('approve', 'Post')
    can('reject', 'Post')

    // Categories
    can('manage', 'Category')

    // Comments & reactions
    can('manage', 'Comment')
    can('manage', 'Reaction')

    // Tools
    can('read', 'Tool')
    can('manage', 'Favorite')

    // Recordings & transcription — manage their own
    can('manage', 'Folder')
    can('manage', 'Recording')
    can('transcribe', 'Recording')
    can('read', 'Transcription')

    // Activity
    can('read', 'Activity')
  }

  if (role === 'student') {
    // Users — read own profile only (enforced at resolver level with conditions)
    can('read', 'User')

    // Groups — read only
    can('read', 'Group')

    // Attendance — read own records only
    can('read', 'AttendanceRecord')

    // Blog — read published posts, submit drafts, manage own drafts
    can('read', 'Post')
    can('create', 'Post')   // creates as draft
    can('submit', 'Post')
    can('update', 'Post')   // own draft only — enforced at resolver level
    can('delete', 'Post')   // own draft only

    // Comments & reactions
    can('create', 'Comment')
    can('update', 'Comment')  // own only
    can('delete', 'Comment')  // own only
    can('manage', 'Reaction')

    // Tools
    can('read', 'Tool')
    can('manage', 'Favorite')

    // Activity — read own
    can('read', 'Activity')
  }

  return build()
}
