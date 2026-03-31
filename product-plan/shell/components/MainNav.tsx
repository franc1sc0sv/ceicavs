import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  PenSquare,
  Wrench,
  AudioLines,
  type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
  label: string
  href: string
  icon?: string
  isActive?: boolean
}

interface MainNavProps {
  items: NavigationItem[]
  collapsed?: boolean
  onNavigate?: (href: string) => void
}

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  attendance: ClipboardCheck,
  people: Users,
  blog: PenSquare,
  'teaching-tools': Wrench,
  'ai-transcription': AudioLines,
}

function getIcon(item: NavigationItem): LucideIcon {
  if (item.icon && iconMap[item.icon]) return iconMap[item.icon]
  const key = item.href.replace(/^\//, '').toLowerCase()
  return iconMap[key] || LayoutDashboard
}

export function MainNav({ items, collapsed = false, onNavigate }: MainNavProps) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {items.map((item) => {
        const Icon = getIcon(item)
        return (
          <button
            key={item.href}
            onClick={() => onNavigate?.(item.href)}
            title={collapsed ? item.label : undefined}
            className={`
              group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150
              ${collapsed ? 'justify-center px-2' : ''}
              ${
                item.isActive
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }
            `}
          >
            <Icon
              className={`h-5 w-5 shrink-0 ${
                item.isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
              }`}
            />
            {!collapsed && <span>{item.label}</span>}
          </button>
        )
      })}
    </nav>
  )
}
