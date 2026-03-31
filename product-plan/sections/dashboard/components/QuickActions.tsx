import {
  Users,
  FileCheck,
  ClipboardCheck,
  PenSquare,
  type LucideIcon,
} from 'lucide-react'
import type { QuickAction } from '../types'

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  'file-check': FileCheck,
  'clipboard-check': ClipboardCheck,
  'pen-square': PenSquare,
}

interface QuickActionsProps {
  actions: QuickAction[]
  onAction?: (href: string) => void
}

export function QuickActions({ actions, onAction }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => {
        const Icon = iconMap[action.icon] ?? ClipboardCheck
        return (
          <button
            key={action.id}
            onClick={() => onAction?.(action.href)}
            className="group flex items-center gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-all duration-150 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-sm active:scale-[0.98] dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/15"
          >
            <Icon className="h-4 w-4 transition-transform duration-150 group-hover:scale-110" />
            {action.label}
          </button>
        )
      })}
    </div>
  )
}
