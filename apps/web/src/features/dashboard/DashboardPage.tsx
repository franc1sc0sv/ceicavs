import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  UsersRound,
  ClipboardCheck,
  FileText,
  Wrench,
  AudioLines,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '../../context/auth.context'
import { Can } from '../../context/ability.context'
import { Action, Subject, UserRole } from '@ceicavs/shared'

interface StatCardProps {
  icon: LucideIcon
  titleKey: string
  value: string
  href: string
}

function StatCard({ icon: Icon, titleKey, value, href }: StatCardProps) {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent/50"
      onClick={() => navigate(href)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {t(titleKey)}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

interface QuickActionProps {
  icon: LucideIcon
  labelKey: string
  href: string
  permission?: { action: Action; subject: Subject }
}

function QuickAction({ icon: Icon, labelKey, href, permission }: QuickActionProps) {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()

  const button = (
    <Button
      variant="outline"
      className="justify-start gap-3 h-auto py-3"
      onClick={() => navigate(href)}
    >
      <Icon className="size-4" />
      <span className="flex-1 text-left">{t(labelKey)}</span>
      <ArrowRight className="size-4 text-muted-foreground" />
    </Button>
  )

  if (permission) {
    return (
      <Can I={permission.action} a={permission.subject}>
        {button}
      </Can>
    )
  }

  return button
}

const ADMIN_STATS: StatCardProps[] = [
  { icon: Users, titleKey: 'cards.users', value: '—', href: '/people' },
  { icon: UsersRound, titleKey: 'cards.groups', value: '—', href: '/people' },
  { icon: FileText, titleKey: 'cards.posts', value: '—', href: '/blog' },
  { icon: AudioLines, titleKey: 'cards.recordings', value: '—', href: '/transcription' },
]

const TEACHER_STATS: StatCardProps[] = [
  { icon: UsersRound, titleKey: 'cards.myGroups', value: '—', href: '/people' },
  { icon: ClipboardCheck, titleKey: 'cards.attendance', value: '—', href: '/attendance' },
  { icon: FileText, titleKey: 'cards.posts', value: '—', href: '/blog' },
  { icon: AudioLines, titleKey: 'cards.recordings', value: '—', href: '/transcription' },
]

const STUDENT_STATS: StatCardProps[] = [
  { icon: ClipboardCheck, titleKey: 'cards.myAttendance', value: '—', href: '/attendance' },
  { icon: FileText, titleKey: 'cards.drafts', value: '—', href: '/blog' },
  { icon: Wrench, titleKey: 'cards.tools', value: '—', href: '/tools' },
]

const ADMIN_ACTIONS: QuickActionProps[] = [
  { icon: Users, labelKey: 'actions.manageUsers', href: '/people', permission: { action: Action.CREATE, subject: Subject.USER } },
  { icon: UsersRound, labelKey: 'actions.manageGroups', href: '/people', permission: { action: Action.CREATE, subject: Subject.GROUP } },
  { icon: FileText, labelKey: 'actions.createPost', href: '/blog', permission: { action: Action.PUBLISH, subject: Subject.POST } },
  { icon: AudioLines, labelKey: 'actions.newRecording', href: '/transcription', permission: { action: Action.TRANSCRIBE, subject: Subject.RECORDING } },
]

const TEACHER_ACTIONS: QuickActionProps[] = [
  { icon: ClipboardCheck, labelKey: 'actions.takeAttendance', href: '/attendance', permission: { action: Action.CREATE, subject: Subject.ATTENDANCE_RECORD } },
  { icon: FileText, labelKey: 'actions.createPost', href: '/blog', permission: { action: Action.PUBLISH, subject: Subject.POST } },
  { icon: AudioLines, labelKey: 'actions.newRecording', href: '/transcription', permission: { action: Action.TRANSCRIBE, subject: Subject.RECORDING } },
  { icon: Wrench, labelKey: 'actions.viewTools', href: '/tools' },
]

const STUDENT_ACTIONS: QuickActionProps[] = [
  { icon: ClipboardCheck, labelKey: 'actions.viewAttendance', href: '/attendance' },
  { icon: FileText, labelKey: 'actions.viewBlog', href: '/blog' },
  { icon: Wrench, labelKey: 'actions.viewTools', href: '/tools' },
]

function getStatsForRole(role: UserRole): StatCardProps[] {
  if (role === UserRole.ADMIN) return ADMIN_STATS
  if (role === UserRole.TEACHER) return TEACHER_STATS
  return STUDENT_STATS
}

function getActionsForRole(role: UserRole): QuickActionProps[] {
  if (role === UserRole.ADMIN) return ADMIN_ACTIONS
  if (role === UserRole.TEACHER) return TEACHER_ACTIONS
  return STUDENT_ACTIONS
}

export default function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const { t: tc } = useTranslation('common')
  const { user } = useAuth()

  if (!user) return null

  const stats = getStatsForRole(user.role)
  const actions = getActionsForRole(user.role)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('welcome', { name: user.name })}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t(`role.${user.role}`)}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {tc(`roles.${user.role}`)}
        </Badge>
      </div>

      <section>
        <h2 className="text-lg font-medium mb-4">{t('sections.overview')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.titleKey} {...stat} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-4">{t('sections.quickActions')}</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <QuickAction key={action.labelKey} {...action} />
          ))}
        </div>
      </section>
    </div>
  )
}
