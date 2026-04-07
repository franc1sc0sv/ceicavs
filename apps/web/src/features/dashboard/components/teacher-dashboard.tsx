import { useTranslation } from 'react-i18next'
import {
  UsersRound,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react'
import { UserRole } from '@ceicavs/shared'
import { ROUTES } from '@/lib/routes'
import { useTeacherDashboard } from '../hooks/use-teacher-dashboard'
import { useRecentActivity } from '../hooks/use-recent-activity'
import { StatCard } from './stat-card'
import { ActivityFeed } from './activity-feed'
import { QuickActionsGrid } from './quick-actions-grid'
import { AttendanceLineChart } from './attendance-line-chart'
import { PostsDonutChart } from './posts-donut-chart'
import { DashboardSkeleton } from './dashboard-skeleton'

function formatPercent(rate: number): string {
  return `${Math.round(rate)}%`
}

export function TeacherDashboard() {
  const { t } = useTranslation('dashboard')
  const { stats, loading, error, refetch } = useTeacherDashboard()
  const { activities, loading: activityLoading } = useRecentActivity(10)

  if (loading) {
    return <DashboardSkeleton chartCount={2} />
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
      <section aria-labelledby="teacher-overview-heading">
        <h2 id="teacher-overview-heading" className="text-lg font-medium mb-4">
          {t('sections.overview')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={UsersRound}
            label={t('cards.myGroups')}
            value={stats.myGroupCount}
            href={ROUTES.PEOPLE}
          />
          <StatCard
            icon={ClipboardCheck}
            label={t('cards.todayRate')}
            value={formatPercent(stats.myGroupsTodayRate)}
            href={ROUTES.ATTENDANCE}
          />
          <StatCard
            icon={FileText}
            label={t('cards.myPosts')}
            value={stats.myPostCount}
            href={ROUTES.BLOG}
          />
          <StatCard
            icon={AlertTriangle}
            label={t('cards.pendingAttendance')}
            value={stats.pendingAttendanceCount}
            href={ROUTES.ATTENDANCE}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} loading={activityLoading} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <section aria-labelledby="teacher-analytics-heading">
            <h2 id="teacher-analytics-heading" className="sr-only">
              {t('sections.analytics')}
            </h2>
            <div className="space-y-4">
              <AttendanceLineChart
                mode="teacher"
                data={stats.myGroupAttendanceTrend}
              />
              <PostsDonutChart data={stats.myPostsByStatus} />
            </div>
          </section>
        </div>
      </div>

      <section aria-labelledby="teacher-actions-heading">
        <h2 id="teacher-actions-heading" className="text-lg font-medium mb-4">
          {t('sections.quickActions')}
        </h2>
        <QuickActionsGrid role={UserRole.TEACHER} />
      </section>
    </div>
  )
}
