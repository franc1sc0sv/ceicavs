import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react'
import type { DraftStatus } from '../types'

const statusConfig: Record<
  DraftStatus['status'],
  { label: string; icon: typeof Clock; color: string; bg: string }
> = {
  pending: {
    label: 'Pendiente',
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20',
  },
  approved: {
    label: 'Aprobado',
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20',
  },
  rejected: {
    label: 'Rechazado',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20',
  },
}

interface DraftTrackerProps {
  drafts: DraftStatus[]
  onDraftClick?: (draft: DraftStatus) => void
}

export function DraftTracker({ drafts, onDraftClick }: DraftTrackerProps) {
  if (drafts.length === 0) return null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Mis Borradores
        </h3>
      </div>
      <div className="divide-y divide-slate-100 p-2 dark:divide-slate-800">
        {drafts.map((draft) => {
          const config = statusConfig[draft.status]
          const StatusIcon = config.icon
          return (
            <button
              key={draft.id}
              onClick={() => onDraftClick?.(draft)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                  {draft.title}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.color}`}
              >
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
