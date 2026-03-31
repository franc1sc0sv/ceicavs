import { useState } from 'react'
import { Menu, X, Sun, Moon, Globe, Bell } from 'lucide-react'
import { MainNav, type NavigationItem } from './MainNav'
import { UserMenu, type UserRole } from './UserMenu'

interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: { name: string; role: UserRole; avatarUrl?: string }
  locale?: string
  darkMode?: boolean
  currentSectionLabel?: string
  onNavigate?: (href: string) => void
  onLogout?: () => void
  onToggleLocale?: () => void
  onToggleDarkMode?: () => void
}

export function AppShell({
  children,
  navigationItems,
  user,
  locale = 'es',
  darkMode = false,
  currentSectionLabel,
  onNavigate,
  onLogout,
  onToggleLocale,
  onToggleDarkMode,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavigate = (href: string) => {
    onNavigate?.(href)
    setMobileOpen(false)
  }

  const activeItem = navigationItems.find((item) => item.isActive)
  const sectionLabel = currentSectionLabel ?? activeItem?.label ?? ''

  return (
    <div className="flex h-screen bg-slate-50 font-[Inter] dark:bg-slate-950">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white dark:bg-indigo-500">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              CEICAVS
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {locale === 'es' ? 'Sistema Escolar' : 'School System'}
            </span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          <MainNav items={navigationItems} onNavigate={handleNavigate} />
        </div>

        {/* User menu */}
        {user && (
          <UserMenu
            user={user}
            locale={locale}
            darkMode={darkMode}
            onLogout={onLogout}
            onToggleLocale={onToggleLocale}
            onToggleDarkMode={onToggleDarkMode}
          />
        )}
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white dark:bg-slate-900
          shadow-2xl transform transition-transform duration-200 ease-in-out md:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white dark:bg-indigo-500">
              C
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              CEICAVS
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <MainNav items={navigationItems} onNavigate={handleNavigate} />
        </div>

        {user && (
          <UserMenu
            user={user}
            locale={locale}
            darkMode={darkMode}
            onLogout={onLogout}
            onToggleLocale={onToggleLocale}
            onToggleDarkMode={onToggleDarkMode}
          />
        )}
      </aside>

      {/* ── Main content area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Section label */}
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {sectionLabel}
            </h2>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-1">
            {onToggleLocale && (
              <button
                onClick={onToggleLocale}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{locale === 'es' ? 'ES' : 'EN'}</span>
              </button>
            )}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
