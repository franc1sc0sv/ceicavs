import {
  Users, Clock, Volume2, CheckSquare, FileText, Image, Table, Download,
  Minimize2, LayoutGrid, Scan, Pencil, Hash, Columns2, Lock,
  type LucideIcon,
} from 'lucide-react'
import type { Tool, ToolColor } from '../types'

// ── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  users: Users,
  clock: Clock,
  'volume-2': Volume2,
  'check-square': CheckSquare,
  'file-text': FileText,
  image: Image,
  table: Table,
  download: Download,
  'minimize-2': Minimize2,
  grid: LayoutGrid,
  scan: Scan,
  'edit-3': Pencil,
  hash: Hash,
  columns: Columns2,
  lock: Lock,
}

// ── Color map ─────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<ToolColor, { iconBg: string; iconText: string; border: string }> = {
  lime:    { iconBg: 'bg-lime-100 dark:bg-lime-500/20',    iconText: 'text-lime-600 dark:text-lime-400',    border: 'hover:border-lime-300 dark:hover:border-lime-700' },
  amber:   { iconBg: 'bg-amber-100 dark:bg-amber-500/20',  iconText: 'text-amber-600 dark:text-amber-400',  border: 'hover:border-amber-300 dark:hover:border-amber-700' },
  red:     { iconBg: 'bg-red-100 dark:bg-red-500/20',      iconText: 'text-red-600 dark:text-red-400',      border: 'hover:border-red-300 dark:hover:border-red-700' },
  sky:     { iconBg: 'bg-sky-100 dark:bg-sky-500/20',      iconText: 'text-sky-600 dark:text-sky-400',      border: 'hover:border-sky-300 dark:hover:border-sky-700' },
  rose:    { iconBg: 'bg-rose-100 dark:bg-rose-500/20',    iconText: 'text-rose-600 dark:text-rose-400',    border: 'hover:border-rose-300 dark:hover:border-rose-700' },
  violet:  { iconBg: 'bg-violet-100 dark:bg-violet-500/20',iconText: 'text-violet-600 dark:text-violet-400',border: 'hover:border-violet-300 dark:hover:border-violet-700' },
  emerald: { iconBg: 'bg-emerald-100 dark:bg-emerald-500/20', iconText: 'text-emerald-600 dark:text-emerald-400', border: 'hover:border-emerald-300 dark:hover:border-emerald-700' },
  orange:  { iconBg: 'bg-orange-100 dark:bg-orange-500/20',iconText: 'text-orange-600 dark:text-orange-400',border: 'hover:border-orange-300 dark:hover:border-orange-700' },
  stone:   { iconBg: 'bg-stone-100 dark:bg-stone-500/20',  iconText: 'text-stone-600 dark:text-stone-400',  border: 'hover:border-stone-300 dark:hover:border-stone-600' },
  cyan:    { iconBg: 'bg-cyan-100 dark:bg-cyan-500/20',    iconText: 'text-cyan-600 dark:text-cyan-400',    border: 'hover:border-cyan-300 dark:hover:border-cyan-700' },
  yellow:  { iconBg: 'bg-yellow-100 dark:bg-yellow-500/20',iconText: 'text-yellow-600 dark:text-yellow-400',border: 'hover:border-yellow-300 dark:hover:border-yellow-700' },
  indigo:  { iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',iconText: 'text-indigo-600 dark:text-indigo-400',border: 'hover:border-indigo-300 dark:hover:border-indigo-700' },
  teal:    { iconBg: 'bg-teal-100 dark:bg-teal-500/20',    iconText: 'text-teal-600 dark:text-teal-400',    border: 'hover:border-teal-300 dark:hover:border-teal-700' },
  fuchsia: { iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-500/20', iconText: 'text-fuchsia-600 dark:text-fuchsia-400', border: 'hover:border-fuchsia-300 dark:hover:border-fuchsia-700' },
}

// ── StarIcon ──────────────────────────────────────────────────────────────────

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-4 h-4 transition-colors ${filled ? 'fill-amber-400 text-amber-400' : 'fill-none text-slate-300 dark:text-slate-600 group-hover/star:text-amber-300 dark:group-hover/star:text-amber-500'}`}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

// ── ToolCard ──────────────────────────────────────────────────────────────────

interface ToolCardProps {
  tool: Tool
  isFavorited: boolean
  onSelect?: () => void
  onToggleFavorite?: () => void
}

export function ToolCard({ tool, isFavorited, onSelect, onToggleFavorite }: ToolCardProps) {
  const colors = COLOR_MAP[tool.color] ?? COLOR_MAP.indigo
  const Icon = ICON_MAP[tool.icon] ?? LayoutGrid

  return (
    <div className={`group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all duration-200 ${colors.border}`}>
      {/* Star button */}
      <button
        onClick={e => { e.stopPropagation(); onToggleFavorite?.() }}
        className="group/star absolute top-3.5 right-3.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        title={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <StarIcon filled={isFavorited} />
      </button>

      {/* Clickable area */}
      <button onClick={onSelect} className="w-full text-left focus:outline-none">
        {/* Icon chip */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors.iconBg}`}>
          <Icon className={`w-5 h-5 ${colors.iconText}`} strokeWidth={1.75} />
        </div>

        {/* Name */}
        <p className="font-semibold text-slate-900 dark:text-slate-100 pr-5 leading-snug mb-1.5">
          {tool.name}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </button>
    </div>
  )
}

// ── FavoritePill ──────────────────────────────────────────────────────────────

interface FavoritePillProps {
  tool: Tool
  onSelect?: () => void
  onRemove?: () => void
}

export function FavoritePill({ tool, onSelect, onRemove }: FavoritePillProps) {
  const colors = COLOR_MAP[tool.color] ?? COLOR_MAP.indigo
  const Icon = ICON_MAP[tool.icon] ?? LayoutGrid

  return (
    <div className="group flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all duration-200">
      <button onClick={onSelect} className="flex items-center gap-2 focus:outline-none">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.iconBg}`}>
          <Icon className={`w-3.5 h-3.5 ${colors.iconText}`} strokeWidth={2} />
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
          {tool.name}
        </span>
      </button>
      <button
        onClick={e => { e.stopPropagation(); onRemove?.() }}
        className="ml-1 p-0.5 rounded text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
        title="Quitar de favoritos"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export { ICON_MAP, COLOR_MAP }
