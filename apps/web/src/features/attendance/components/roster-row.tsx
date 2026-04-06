import { useTranslation } from 'react-i18next'

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

interface RosterStudent {
  id: string
  name: string
  avatarUrl: string | null
  status: string | null
}

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
]

const STATUS_ACTIVE_CLASS: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-500 text-white border-emerald-500',
  absent: 'bg-red-500 text-white border-red-500',
  late: 'bg-amber-500 text-white border-amber-500',
  excused: 'bg-slate-500 text-white border-slate-500',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

interface RosterRowProps {
  student: RosterStudent
  onStatusChange: (studentId: string, status: AttendanceStatus) => void
}

export function RosterRow({ student, onStatusChange }: RosterRowProps) {
  const { t } = useTranslation('attendance')
  const colorClass = AVATAR_COLORS[student.name.charCodeAt(0) % AVATAR_COLORS.length]

  const statusOptions: { value: AttendanceStatus; labelKey: string; short: string }[] = [
    { value: 'present', labelKey: 'status.present', short: 'P' },
    { value: 'absent', labelKey: 'status.absent', short: 'A' },
    { value: 'late', labelKey: 'status.late', short: 'T' },
    { value: 'excused', labelKey: 'status.excused', short: 'J' },
  ]

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/60 last:border-0">
      {student.avatarUrl ? (
        <img
          src={student.avatarUrl}
          alt={student.name}
          className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
        />
      ) : (
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${colorClass}`}
          aria-hidden="true"
        >
          {getInitials(student.name)}
        </div>
      )}

      <span className="flex-1 text-sm font-medium text-foreground min-w-0 truncate">
        {student.name}
      </span>

      <div
        className="flex rounded-lg border border-border overflow-hidden flex-shrink-0"
        role="group"
        aria-label={student.name}
      >
        {statusOptions.map((opt, i) => {
          const isActive = student.status === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(student.id, opt.value)}
              aria-pressed={isActive}
              aria-label={t(opt.labelKey)}
              className={[
                'px-2 sm:px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                i > 0 ? 'border-l border-border' : '',
                isActive
                  ? STATUS_ACTIVE_CLASS[opt.value]
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              ].join(' ')}
            >
              <span className="sm:hidden" aria-hidden="true">{opt.short}</span>
              <span className="hidden sm:inline">{t(opt.labelKey)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
