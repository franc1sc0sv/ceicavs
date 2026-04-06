import { useTranslation } from 'react-i18next'

interface AttendanceGroup {
  id: string
  name: string
  memberCount: number
  todayRate: number | null
  todaySubmitted: boolean
}

interface RateRingProps {
  rate: number | null
}

function RateRing({ rate }: RateRingProps) {
  const size = 52
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = rate !== null ? circumference - (rate / 100) * circumference : circumference
  const color = rate === null ? '#94a3b8' : rate >= 90 ? '#10b981' : rate >= 75 ? '#f59e0b' : '#ef4444'

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={rate !== null ? `${rate}%` : '—'}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span className="absolute text-xs font-bold tabular-nums" style={{ color }}>
        {rate !== null ? `${rate}%` : '—'}
      </span>
    </div>
  )
}

interface GroupCardProps {
  group: AttendanceGroup
  onClick: () => void
}

export function GroupCard({ group, onClick }: GroupCardProps) {
  const { t } = useTranslation('attendance')

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-card dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
            {group.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t('members', { count: group.memberCount })}
          </p>
          <div className="mt-3">
            {group.todaySubmitted ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t('status.submitted')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('status.pending')}
              </span>
            )}
          </div>
        </div>
        <RateRing rate={group.todayRate} />
      </div>
    </button>
  )
}
