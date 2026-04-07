import { useTranslation } from 'react-i18next'
import {
  Users,
  UsersRound,
  FileText,
  ClipboardCheck,
  AlertCircle,
} from 'lucide-react'
import { UserRole } from '@ceicavs/shared'
import { ROUTES } from '@/lib/routes'
import { useAdminDashboard } from '../hooks/use-admin-dashboard'
import { useRecentActivity } from '../hooks/use-recent-activity'
import { StatCard, computeTrend } from './stat-card'
import { ActivityFeed } from './activity-feed'
import { QuickActionsGrid } from './quick-actions-grid'
import { AttendanceLineChart } from './attendance-line-chart'
import { PostsDonutChart } from './posts-donut-chart'
import { UsersBarChart } from './users-bar-chart'
import { DashboardSkeleton } from './dashboard-skeleton'

function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`
}

export function AdminDashboard() {
  const { t } = useTranslation('dashboard')
  const { stats, loading, error, refetch } = useAdminDashboard()
  const { activities, loading: activityLoading } = useRecentActivity(10)

  if (loading) {
    return <DashboardSkeleton chartCount={3} />
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

  const postsTrend = computeTrend(
    stats.publishedPostsThisMonth,
    stats.publishedPostsLastMonth,
  )
  const attendanceTrend = computeTrend(
    stats.globalAttendanceRateThisWeek,
    stats.globalAttendanceRateLastWeek,
  )

  return (
    <div className="space-y-8">
      <section aria-labelledby="admin-overview-heading">
        <h2 id="admin-overview-heading" className="text-lg font-medium mb-4">
          {t('sections.overview')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label={t('cards.users')}
            value={stats.totalUsers}
            href={ROUTES.PEOPLE}
          />
          <StatCard
            icon={UsersRound}
            label={t('cards.groups')}
            value={stats.totalGroups}
            href={ROUTES.PEOPLE}
          />
          <StatCard
            icon={FileText}
            label={t('cards.postsThisMonth')}
            value={stats.publishedPostsThisMonth}
            href={ROUTES.BLOG}
            trend={postsTrend}
          />
          <StatCard
            icon={ClipboardCheck}
            label={t('cards.attendanceThisWeek')}
            value={formatPercent(stats.globalAttendanceRateThisWeek)}
            href={ROUTES.ATTENDANCE}
            trend={attendanceTrend}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} loading={activityLoading} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <section aria-labelledby="admin-analytics-heading">
            <h2 id="admin-analytics-heading" className="sr-only">
              {t('sections.analytics')}
            </h2>
            <div className="space-y-4">
              <AttendanceLineChart mode="admin" data={stats.attendanceTrend} />
              <div className="grid gap-4 sm:grid-cols-2">
                <PostsDonutChart data={stats.postsByStatus} />
                <UsersBarChart data={stats.usersByRole} />
              </div>
            </div>
          </section>
        </div>
      </div>

      <section aria-labelledby="admin-actions-heading">
        <h2 id="admin-actions-heading" className="text-lg font-medium mb-4">
          {t('sections.quickActions')}
        </h2>
        <QuickActionsGrid role={UserRole.ADMIN} />
      </section>
    </div>
  )
}
