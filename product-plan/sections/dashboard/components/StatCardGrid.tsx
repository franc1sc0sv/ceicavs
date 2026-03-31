import {
  Users,
  GraduationCap,
  ClipboardCheck,
  PenSquare,
  FileClock,
  AudioLines,
  Layers,
  Flame,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react'
import type { StatCard } from '../types'

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  'graduation-cap': GraduationCap,
  'clipboard-check': ClipboardCheck,
  'pen-square': PenSquare,
  'file-clock': FileClock,
  'audio-lines': AudioLines,
  layers: Layers,
  flame: Flame,
}

interface StatCardGridProps {
  stats: StatCard[]
}

export function StatCardGrid({ stats }: StatCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon ?? ''] ?? ClipboardCheck
        return (
          <div
            key={stat.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Subtle accent glow */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-500/5 transition-transform duration-300 group-hover:scale-150 dark:bg-indigo-400/5" />

            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              {stat.trend && (
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    stat.trend.direction === 'up'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                  }`}
                >
                  {stat.trend.direction === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.trend.percentage}%
                </div>
              )}
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}
