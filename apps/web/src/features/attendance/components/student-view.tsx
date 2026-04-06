import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from './empty-state'
import { useStudentSummary } from '../hooks/use-student-summary'
import { useStudentHistory } from '../hooks/use-student-history'

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

interface AttendanceRecord {
  id: string
  date: string
  status: string
  groupName: string
}

const STATUS_BADGE_CLASS: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  absent: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  late: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  excused: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

function isAttendanceStatus(value: string): value is AttendanceStatus {
  return ['present', 'absent', 'late', 'excused'].includes(value)
}

interface SummaryRingProps {
  rate: number
}

function SummaryRing({ rate }: SummaryRingProps) {
  const size = 64
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (rate / 100) * circumference
  const color = rate >= 90 ? '#10b981' : rate >= 75 ? '#f59e0b' : '#ef4444'

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${rate}%`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums" style={{ color }}>
        {rate}%
      </span>
    </div>
  )
}

export function StudentView() {
  const { t } = useTranslation('attendance')
  const { summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useStudentSummary()
  const { history, loading: historyLoading, error: historyError } = useStudentHistory()

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

  if (summaryLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (summaryError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm font-medium text-foreground">{t('error.title')}</p>
        <button
          type="button"
          onClick={() => refetchSummary()}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          {t('error.retry')}
        </button>
      </div>
    )
  }

  const typedHistory = (history as AttendanceRecord[])
  const grouped = typedHistory.reduce<Record<string, AttendanceRecord[]>>((acc: Record<string, AttendanceRecord[]>, r: AttendanceRecord) => {
    if (!acc[r.date]) acc[r.date] = []
    acc[r.date].push(r)
    return acc
  }, {})

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 rounded-2xl p-6 mb-6 text-white shadow-lg shadow-indigo-500/20">
        <p className="text-xs font-semibold text-indigo-200 uppercase tracking-widest mb-5">
          {t('student.title')}
        </p>
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center gap-2">
            <SummaryRing rate={summary?.overallRate ?? 0} />
            <span className="text-xs text-indigo-200">{t('student.generalLabel')}</span>
          </div>
          <div className="w-px h-12 bg-indigo-500" aria-hidden="true" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tabular-nums">{summary?.currentStreak ?? 0}</span>
            </div>
            <span className="text-xs text-indigo-200">{t('student.streakLabel')}</span>
          </div>
          <div className="w-px h-12 bg-indigo-500" aria-hidden="true" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-bold tabular-nums">{summary?.groupCount ?? 0}</span>
            <span className="text-xs text-indigo-200">{t('student.groupsLabel')}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          {t('student.historyLabel')}
        </p>

        {historyLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : historyError || Object.keys(grouped).length === 0 ? (
          <EmptyState message={t('empty.noHistory')} />
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([date, records]: [string, AttendanceRecord[]]) => (
              <div key={date}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide capitalize mb-2">
                  {formatDate(date)}
                </p>
                <div className="space-y-2">
                  {records.map((r: AttendanceRecord) => {
                    const statusClass = isAttendanceStatus(r.status)
                      ? STATUS_BADGE_CLASS[r.status]
                      : 'bg-muted text-muted-foreground'
                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between bg-card dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl px-4 py-3"
                      >
                        <span className="text-sm font-medium text-foreground">{r.groupName}</span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass}`}>
                          {isAttendanceStatus(r.status) ? t(`status.${r.status}`) : r.status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
