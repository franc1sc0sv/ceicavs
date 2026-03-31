import {
  ClipboardCheck,
  PenSquare,
  FileText,
  UserPlus,
  AudioLines,
  type LucideIcon,
} from 'lucide-react'
import type { ActivityItem } from '../types'

const typeConfig: Record<
  ActivityItem['type'],
  { icon: LucideIcon; color: string; bg: string }
> = {
  attendance: {
    icon: ClipboardCheck,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  post_published: {
    icon: PenSquare,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  draft_submitted: {
    icon: FileText,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
  },
  user_registered: {
    icon: UserPlus,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  recording_created: {
    icon: AudioLines,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
  },
}

const roleColors: Record<ActivityItem['actorRole'], string> = {
  admin: 'text-indigo-600 dark:text-indigo-400',
  teacher: 'text-amber-600 dark:text-amber-400',
  student: 'text-emerald-600 dark:text-emerald-400',
}

function timeAgo(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'ahora'
  if (diffMin < 60) return `hace ${diffMin}m`
  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return `hace ${diffHrs}h`
  const diffDays = Math.floor(diffHrs / 24)
  return `hace ${diffDays}d`
}

interface ActivityFeedProps {
  items: ActivityItem[]
  onItemClick?: (item: ActivityItem) => void
}

export function ActivityFeed({ items, onItemClick }: ActivityFeedProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Actividad Reciente
        </h3>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item) => {
          const config = typeConfig[item.type]
          const Icon = config.icon
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className="flex w-full items-start gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
              >
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className={`font-semibold ${roleColors[item.actorRole]}`}>
                    {item.actorName}
                  </span>{' '}
                  {item.description}
                </p>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {timeAgo(item.timestamp)}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
