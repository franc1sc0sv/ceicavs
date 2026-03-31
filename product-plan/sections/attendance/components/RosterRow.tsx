import type { AttendanceStatus, RosterStudent } from '../types'

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; short: string; activeClass: string }[] = [
  { value: 'present',  label: 'Presente',    short: 'P', activeClass: 'bg-emerald-500 text-white border-emerald-500' },
  { value: 'absent',   label: 'Ausente',     short: 'A', activeClass: 'bg-red-500 text-white border-red-500' },
  { value: 'late',     label: 'Tarde',       short: 'T', activeClass: 'bg-amber-500 text-white border-amber-500' },
  { value: 'excused',  label: 'Justificado', short: 'J', activeClass: 'bg-slate-500 text-white border-slate-500' },
]

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
]

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

interface RosterRowProps {
  student: RosterStudent
  onStatusChange?: (studentId: string, status: AttendanceStatus) => void
}

export function RosterRow({ student, onStatusChange }: RosterRowProps) {
  const colorClass = AVATAR_COLORS[student.name.charCodeAt(0) % AVATAR_COLORS.length]

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${colorClass}`}>
        {initials(student.name)}
      </div>

      {/* Name */}
      <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200 min-w-0 truncate">
        {student.name}
      </span>

      {/* Segmented status control */}
      <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0">
        {STATUS_OPTIONS.map((opt, i) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange?.(student.id, opt.value)}
            title={opt.label}
            className={[
              'px-2 sm:px-3 py-1.5 text-xs font-semibold transition-colors',
              i > 0 ? 'border-l border-slate-200 dark:border-slate-700' : '',
              student.status === opt.value
                ? opt.activeClass
                : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300',
            ].join(' ')}
          >
            <span className="sm:hidden">{opt.short}</span>
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
