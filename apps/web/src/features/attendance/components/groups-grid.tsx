import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { GroupCard } from './group-card'
import { EmptyState } from './empty-state'

interface AttendanceGroup {
  id: string
  name: string
  memberCount: number
  todayRate: number | null
  todaySubmitted: boolean
}

interface GroupsGridProps {
  groups: AttendanceGroup[]
  loading: boolean
  error: Error | undefined
  onGroupSelect: (groupId: string) => void
  onRetry: () => void
}

export function GroupsGrid({ groups, loading, error, onGroupSelect, onRetry }: GroupsGridProps) {
  const { t } = useTranslation('attendance')

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="size-6 text-destructive" />
        </div>
        <p className="text-sm font-medium text-foreground">{t('error.title')}</p>
        <button
          type="button"
          onClick={onRetry}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          {t('error.retry')}
        </button>
      </div>
    )
  }

  if (groups.length === 0) {
    return <EmptyState message={t('empty.noGroups')} />
  }

  const pendingCount = groups.filter((g) => !g.todaySubmitted).length

  return (
    <div className="space-y-4">
      {pendingCount > 0 && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-3"
        >
          <AlertTriangle className="size-4 flex-shrink-0" aria-hidden="true" />
          <span>{t('pending', { count: pendingCount })}</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} onClick={() => onGroupSelect(group.id)} />
        ))}
      </div>
    </div>
  )
}
