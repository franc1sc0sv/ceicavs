import type { DashboardProps } from '../types'
import { StatCardGrid } from './StatCardGrid'
import { ActivityFeed } from './ActivityFeed'
import { QuickActions } from './QuickActions'
import { WelcomeBanner } from './WelcomeBanner'
import { DraftTracker } from './DraftTracker'
import { RecentPosts } from './RecentPosts'

export function Dashboard({
  role,
  adminData,
  teacherData,
  studentData,
  onQuickAction,
  onActivityClick,
  onDraftClick,
  onPostClick,
}: DashboardProps) {
  // ── Admin Dashboard ──
  if (role === 'admin' && adminData) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Vista general del sistema
          </p>
        </div>

        <QuickActions actions={adminData.quickActions} onAction={onQuickAction} />
        <StatCardGrid stats={adminData.stats} />
        <ActivityFeed items={adminData.activityFeed} onItemClick={onActivityClick} />
      </div>
    )
  }

  // ── Teacher Dashboard ──
  if (role === 'teacher' && teacherData) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Resumen de tus grupos y contenido
          </p>
        </div>

        <QuickActions actions={teacherData.quickActions} onAction={onQuickAction} />
        <StatCardGrid stats={teacherData.stats} />
        <ActivityFeed items={teacherData.activityFeed} onItemClick={onActivityClick} />
      </div>
    )
  }

  // ── Student Dashboard ──
  if (role === 'student' && studentData) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        <WelcomeBanner welcome={studentData.welcome} />

        <QuickActions actions={studentData.quickActions} onAction={onQuickAction} />
        <StatCardGrid stats={studentData.stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentPosts posts={studentData.recentPosts} onPostClick={onPostClick} />
          <DraftTracker drafts={studentData.draftStatuses} onDraftClick={onDraftClick} />
        </div>
      </div>
    )
  }

  return null
}
