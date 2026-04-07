import {
  Users,
  UsersRound,
  ClipboardCheck,
  FileText,
  AudioLines,
  Wrench,
  BookOpen,
} from 'lucide-react'
import { Action, Subject, UserRole } from '@ceicavs/shared'
import { ROUTES } from '@/lib/routes'
import { QuickAction } from './quick-action'

interface QuickActionsGridProps {
  role: UserRole
}

const ADMIN_ACTIONS = [
  {
    icon: Users,
    labelKey: 'actions.manageUsers',
    href: ROUTES.PEOPLE,
    permission: { action: Action.CREATE, subject: Subject.USER },
  },
  {
    icon: UsersRound,
    labelKey: 'actions.manageGroups',
    href: ROUTES.PEOPLE,
    permission: { action: Action.CREATE, subject: Subject.GROUP },
  },
  {
    icon: FileText,
    labelKey: 'actions.createPost',
    href: ROUTES.BLOG,
    permission: { action: Action.PUBLISH, subject: Subject.POST },
  },
  {
    icon: BookOpen,
    labelKey: 'actions.reviewDrafts',
    href: ROUTES.BLOG,
    permission: { action: Action.APPROVE, subject: Subject.POST },
  },
  {
    icon: AudioLines,
    labelKey: 'actions.newRecording',
    href: ROUTES.TRANSCRIPTION,
    permission: { action: Action.TRANSCRIBE, subject: Subject.RECORDING },
  },
] as const

const TEACHER_ACTIONS = [
  {
    icon: ClipboardCheck,
    labelKey: 'actions.takeAttendance',
    href: ROUTES.ATTENDANCE,
    permission: { action: Action.CREATE, subject: Subject.ATTENDANCE_RECORD },
  },
  {
    icon: FileText,
    labelKey: 'actions.createPost',
    href: ROUTES.BLOG,
    permission: { action: Action.CREATE, subject: Subject.POST },
  },
  {
    icon: BookOpen,
    labelKey: 'actions.reviewDrafts',
    href: ROUTES.BLOG,
    permission: { action: Action.APPROVE, subject: Subject.POST },
  },
  {
    icon: AudioLines,
    labelKey: 'actions.newRecording',
    href: ROUTES.TRANSCRIPTION,
    permission: { action: Action.TRANSCRIBE, subject: Subject.RECORDING },
  },
  {
    icon: Wrench,
    labelKey: 'actions.viewTools',
    href: ROUTES.TOOLS,
  },
] as const

const STUDENT_ACTIONS = [
  {
    icon: ClipboardCheck,
    labelKey: 'actions.viewAttendance',
    href: ROUTES.ATTENDANCE,
  },
  {
    icon: FileText,
    labelKey: 'actions.writePost',
    href: ROUTES.BLOG,
    permission: { action: Action.CREATE, subject: Subject.POST },
  },
  {
    icon: BookOpen,
    labelKey: 'actions.viewBlog',
    href: ROUTES.BLOG,
  },
  {
    icon: Wrench,
    labelKey: 'actions.viewTools',
    href: ROUTES.TOOLS,
  },
] as const

function getActionsForRole(role: UserRole) {
  if (role === UserRole.ADMIN) return ADMIN_ACTIONS
  if (role === UserRole.TEACHER) return TEACHER_ACTIONS
  return STUDENT_ACTIONS
}

export function QuickActionsGrid({ role }: QuickActionsGridProps) {
  const actions = getActionsForRole(role)

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="list">
      {actions.map((action) => (
        <div key={action.labelKey} role="listitem">
          <QuickAction
            icon={action.icon}
            labelKey={action.labelKey}
            href={action.href}
            permission={'permission' in action ? action.permission : undefined}
          />
        </div>
      ))}
    </div>
  )
}
