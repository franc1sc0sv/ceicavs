import {
  Users, Clock, CheckSquare, FileText, Image, Download,
  Minimize2, LayoutGrid, Scan, Pencil, Hash, Lock, RotateCw, Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { ToolType } from '@/generated/graphql'

const ICON_MAP: Record<string, LucideIcon> = {
  users: Users,
  clock: Clock,
  'check-square': CheckSquare,
  'file-text': FileText,
  image: Image,
  download: Download,
  'minimize-2': Minimize2,
  grid: LayoutGrid,
  scan: Scan,
  'edit-3': Pencil,
  hash: Hash,
  lock: Lock,
  'rotate-cw': RotateCw,
  sparkles: Sparkles,
}

const COLOR_MAP: Record<string, { iconBg: string; iconText: string }> = {
  lime:    { iconBg: 'bg-lime-100 dark:bg-lime-500/20',    iconText: 'text-lime-600 dark:text-lime-400' },
  amber:   { iconBg: 'bg-amber-100 dark:bg-amber-500/20',  iconText: 'text-amber-600 dark:text-amber-400' },
  sky:     { iconBg: 'bg-sky-100 dark:bg-sky-500/20',      iconText: 'text-sky-600 dark:text-sky-400' },
  rose:    { iconBg: 'bg-rose-100 dark:bg-rose-500/20',    iconText: 'text-rose-600 dark:text-rose-400' },
  violet:  { iconBg: 'bg-violet-100 dark:bg-violet-500/20',iconText: 'text-violet-600 dark:text-violet-400' },
  orange:  { iconBg: 'bg-orange-100 dark:bg-orange-500/20',iconText: 'text-orange-600 dark:text-orange-400' },
  stone:   { iconBg: 'bg-stone-100 dark:bg-stone-500/20',  iconText: 'text-stone-600 dark:text-stone-400' },
  cyan:    { iconBg: 'bg-cyan-100 dark:bg-cyan-500/20',    iconText: 'text-cyan-600 dark:text-cyan-400' },
  yellow:  { iconBg: 'bg-yellow-100 dark:bg-yellow-500/20',iconText: 'text-yellow-600 dark:text-yellow-400' },
  indigo:  { iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',iconText: 'text-indigo-600 dark:text-indigo-400' },
  fuchsia: { iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-500/20', iconText: 'text-fuchsia-600 dark:text-fuchsia-400' },
  emerald: { iconBg: 'bg-emerald-100 dark:bg-emerald-500/20', iconText: 'text-emerald-600 dark:text-emerald-400' },
  red:     { iconBg: 'bg-red-100 dark:bg-red-500/20',      iconText: 'text-red-600 dark:text-red-400' },
}

const FALLBACK_COLORS = COLOR_MAP.indigo

interface FavoritePillProps {
  tool: ToolType
  onSelect: () => void
  onRemove: () => void
}

export function FavoritePill({ tool, onSelect, onRemove }: FavoritePillProps) {
  const { t } = useTranslation('tools')
  const colors = COLOR_MAP[tool.color] ?? FALLBACK_COLORS
  const Icon = ICON_MAP[tool.icon] ?? LayoutGrid

  return (
    <div className="group flex items-center gap-1 rounded-xl border border-border bg-card px-2 py-1.5 transition-all duration-200 hover:border-indigo-300 hover:shadow-sm dark:hover:border-indigo-700">
      <button
        type="button"
        onClick={onSelect}
        className="flex items-center gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        <div className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-md', colors.iconBg)}>
          <Icon className={cn('h-3.5 w-3.5', colors.iconText)} strokeWidth={2} aria-hidden="true" />
        </div>
        <span className="whitespace-nowrap text-sm font-medium text-foreground">
          {tool.name}
        </span>
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        aria-label={t('removeFavorite')}
        className="ml-0.5 rounded p-0.5 text-muted-foreground/40 opacity-0 transition-all hover:text-muted-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
