import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { Action, Subject } from '@ceicavs/shared'
import { useAbility } from '@/context/ability.context'
import { buttonVariants } from '@/components/ui/button'
import { GroupsGrid } from './components/groups-grid'
import { StudentView } from './components/student-view'
import { useAttendanceGroups } from './hooks/use-attendance-groups'

export default function AttendancePage() {
  const { t } = useTranslation('attendance')
  const navigate = useNavigate()
  const ability = useAbility()

  const { groups, loading, error, refetch } = useAttendanceGroups()

  const canManage = ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)
  const canRead = ability.can(Action.READ, Subject.ATTENDANCE_RECORD)

  if (canManage) {
    return (
      <main className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div />
          <Link to="/attendance/reports" className={buttonVariants({ variant: 'outline' })}>
            {t('reports.title')}
          </Link>
        </div>
        <GroupsGrid
          groups={groups}
          loading={loading}
          error={error}
          onGroupSelect={(groupId) => navigate(`/attendance/${groupId}`)}
          onRetry={refetch}
        />
      </main>
    )
  }

  if (canRead) {
    return (
      <main>
        <StudentView />
      </main>
    )
  }

  return null
}
