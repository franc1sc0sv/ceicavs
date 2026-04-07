import { useTranslation } from 'react-i18next'
import {
  ClipboardCheck,
  Flame,
  FileText,
  UsersRound,
  AlertCircle,
} from 'lucide-react'
import { UserRole } from '@ceicavs/shared'
import { ROUTES } from '@/lib/routes'
import { useStudentDashboard } from '../hooks/use-student-dashboard'
import { useRecentActivity } from '../hooks/use-recent-activity'
import { StatCard } from './stat-card'
import { ActivityFeed } from './activity-feed'
import { QuickActionsGrid } from './quick-actions-grid'
import { StudentAttendanceChart } from './student-attendance-chart'
import { DashboardSkeleton } from './dashboard-skeleton'

function formatPercent(rate: number): string {
  return `${Math.round(rate)}%`
}

export function StudentDashboard() {
  const { t } = useTranslation('dashboard')
  const { stats, loading, error, refetch } = useStudentDashboard()
  const { activities, loading: activityLoading } = useRecentActivity(10)

  if (loading) {
    return <DashboardSkeleton chartCount={1} />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <AlertCircle className="size-10 text-destructive" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">{t('error.load')}</p>
        <button
          type="button"
          className="text-sm text-primary underline-offset-4 hover:underline"
          onClick={() => refetch()}
        >
          {t('error.retry')}
        </button>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-8">
      <section aria-labelledby="student-overview-heading">
        <h2 id="student-overview-heading" className="text-lg font-medium mb-4">
          {t('sections.overview')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={ClipboardCheck}
            label={t('cards.myAttendanceRate')}
            value={formatPercent(stats.myAttendanceRate)}
            href={ROUTES.ATTENDANCE}
          />
          <StatCard
            icon={Flame}
            label={t('cards.currentStreak')}
            value={`${stats.myCurrentStreak}d`}
            href={ROUTES.ATTENDANCE}
          />
          <StatCard
            icon={FileText}
            label={t('cards.myDrafts')}
            value={stats.myDraftCount}
            href={ROUTES.BLOG}
          />
          <StatCard
            icon={UsersRound}
            label={t('cards.myGroups')}
            value={stats.myGroupMembershipCount}
            href={ROUTES.ATTENDANCE}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="lg:col-span-1 flex flex-col">
          <ActivityFeed activities={activities} loading={activityLoading} />
        </div>
        <div className="lg:col-span-2">
          <section aria-labelledby="student-analytics-heading">
            <h2 id="student-analytics-heading" className="sr-only">
              {t('sections.analytics')}
            </h2>
            <StudentAttendanceChart data={stats.myAttendanceTrend} />
          </section>
        </div>
      </div>

      <section aria-labelledby="student-actions-heading">
        <h2 id="student-actions-heading" className="text-lg font-medium mb-4">
          {t('sections.quickActions')}
        </h2>
        <QuickActionsGrid role={UserRole.STUDENT} />
      </section>
    </div>
  )
}
