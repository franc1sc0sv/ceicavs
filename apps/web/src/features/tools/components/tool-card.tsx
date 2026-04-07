import {
  Users, Clock, CheckSquare, FileText, Image, Download,
  Minimize2, LayoutGrid, Scan, Pencil, Hash, Lock, RotateCw,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Tool, ToolColor } from '../data/tools-data'

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
}

const COLOR_MAP: Record<ToolColor, { iconBg: string; iconText: string; border: string }> = {
  lime:    { iconBg: 'bg-lime-100 dark:bg-lime-500/20',    iconText: 'text-lime-600 dark:text-lime-400',    border: 'hover:border-lime-300 dark:hover:border-lime-700' },
  amber:   { iconBg: 'bg-amber-100 dark:bg-amber-500/20',  iconText: 'text-amber-600 dark:text-amber-400',  border: 'hover:border-amber-300 dark:hover:border-amber-700' },
  sky:     { iconBg: 'bg-sky-100 dark:bg-sky-500/20',      iconText: 'text-sky-600 dark:text-sky-400',      border: 'hover:border-sky-300 dark:hover:border-sky-700' },
  rose:    { iconBg: 'bg-rose-100 dark:bg-rose-500/20',    iconText: 'text-rose-600 dark:text-rose-400',    border: 'hover:border-rose-300 dark:hover:border-rose-700' },
  violet:  { iconBg: 'bg-violet-100 dark:bg-violet-500/20',iconText: 'text-violet-600 dark:text-violet-400',border: 'hover:border-violet-300 dark:hover:border-violet-700' },
  orange:  { iconBg: 'bg-orange-100 dark:bg-orange-500/20',iconText: 'text-orange-600 dark:text-orange-400',border: 'hover:border-orange-300 dark:hover:border-orange-700' },
  stone:   { iconBg: 'bg-stone-100 dark:bg-stone-500/20',  iconText: 'text-stone-600 dark:text-stone-400',  border: 'hover:border-stone-300 dark:hover:border-stone-600' },
  cyan:    { iconBg: 'bg-cyan-100 dark:bg-cyan-500/20',    iconText: 'text-cyan-600 dark:text-cyan-400',    border: 'hover:border-cyan-300 dark:hover:border-cyan-700' },
  yellow:  { iconBg: 'bg-yellow-100 dark:bg-yellow-500/20',iconText: 'text-yellow-600 dark:text-yellow-400',border: 'hover:border-yellow-300 dark:hover:border-yellow-700' },
  indigo:  { iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',iconText: 'text-indigo-600 dark:text-indigo-400',border: 'hover:border-indigo-300 dark:hover:border-indigo-700' },
  fuchsia: { iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-500/20', iconText: 'text-fuchsia-600 dark:text-fuchsia-400', border: 'hover:border-fuchsia-300 dark:hover:border-fuchsia-700' },
  emerald: { iconBg: 'bg-emerald-100 dark:bg-emerald-500/20', iconText: 'text-emerald-600 dark:text-emerald-400', border: 'hover:border-emerald-300 dark:hover:border-emerald-700' },
  red:     { iconBg: 'bg-red-100 dark:bg-red-500/20',      iconText: 'text-red-600 dark:text-red-400',      border: 'hover:border-red-300 dark:hover:border-red-700' },
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        'w-4 h-4 transition-colors',
        filled
          ? 'fill-amber-400 text-amber-400'
          : 'fill-none text-slate-300 dark:text-slate-600 group-hover/star:text-amber-300 dark:group-hover/star:text-amber-500'
      )}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

interface ToolCardProps {
  tool: Tool
  isFavorited: boolean
  onSelect: () => void
  onToggleFavorite: () => void
}

export function ToolCard({ tool, isFavorited, onSelect, onToggleFavorite }: ToolCardProps) {
  const { t } = useTranslation('tools')
  const colors = COLOR_MAP[tool.color] ?? COLOR_MAP.indigo
  const Icon = ICON_MAP[tool.icon] ?? LayoutGrid

  return (
    <Card
      className={cn(
        'group relative cursor-pointer gap-0 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg',
        colors.border
      )}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
        aria-label={isFavorited ? t('removeFavorite') : t('addFavorite')}
        className="group/star absolute top-3.5 right-3.5 z-10 rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <StarIcon filled={isFavorited} />
      </button>

      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      >
        <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-xl', colors.iconBg)}>
          <Icon className={cn('h-5 w-5', colors.iconText)} strokeWidth={1.75} aria-hidden="true" />
        </div>

        <p className="mb-1.5 pr-5 text-sm font-semibold leading-snug text-foreground">
          {tool.name}
        </p>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
      </button>
    </Card>
  )
}
