import { LogOut, ChevronUp, Globe, Sun, Moon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export type UserRole = 'admin' | 'teacher' | 'student'

interface UserMenuProps {
  user: {
    name: string
    role: UserRole
    avatarUrl?: string
  }
  collapsed?: boolean
  locale?: string
  darkMode?: boolean
  onLogout?: () => void
  onToggleLocale?: () => void
  onToggleDarkMode?: () => void
}

const roleLabels: Record<UserRole, Record<string, string>> = {
  admin: { es: 'Admin', en: 'Admin' },
  teacher: { es: 'Docente', en: 'Teacher' },
  student: { es: 'Estudiante', en: 'Student' },
}

const roleBadgeColors: Record<UserRole, string> = {
  admin: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
  teacher: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  student: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UserMenu({
  user,
  collapsed = false,
  locale = 'es',
  darkMode = false,
  onLogout,
  onToggleLocale,
  onToggleDarkMode,
}: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const roleLabel = roleLabels[user.role]?.[locale] ?? user.role

  return (
    <div ref={menuRef} className="relative px-3 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors
          hover:bg-slate-100 dark:hover:bg-slate-800
          ${collapsed ? 'justify-center px-2' : ''}
        `}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
            {getInitials(user.name)}
          </div>
        )}
        {!collapsed && (
          <>
            <div className="flex flex-1 flex-col items-start text-left min-w-0">
              <span className="font-medium text-slate-900 dark:text-slate-100 truncate w-full">
                {user.name}
              </span>
              <span
                className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${roleBadgeColors[user.role]}`}
              >
                {roleLabel}
              </span>
            </div>
            <ChevronUp
              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 ${
                open ? '' : 'rotate-180'
              }`}
            />
          </>
        )}
      </button>

      {open && (
        <div className="absolute bottom-full left-3 right-3 mb-1 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {onToggleDarkMode && (
            <button
              onClick={() => {
                onToggleDarkMode()
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {darkMode
                ? locale === 'es' ? 'Modo claro' : 'Light mode'
                : locale === 'es' ? 'Modo oscuro' : 'Dark mode'}
            </button>
          )}
          {onToggleLocale && (
            <button
              onClick={() => {
                onToggleLocale()
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
            >
              <Globe className="h-4 w-4" />
              {locale === 'es' ? 'English' : 'Español'}
            </button>
          )}
          <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
          <button
            onClick={() => {
              setOpen(false)
              onLogout?.()
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            {locale === 'es' ? 'Cerrar sesión' : 'Log out'}
          </button>
        </div>
      )}
    </div>
  )
}
