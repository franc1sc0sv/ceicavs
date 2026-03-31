import { Flame, Layers } from 'lucide-react'
import type { StudentWelcome } from '../types'

interface WelcomeBannerProps {
  welcome: StudentWelcome
}

export function WelcomeBanner({ welcome }: WelcomeBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 p-6 text-white shadow-lg shadow-indigo-500/20 dark:from-indigo-500 dark:via-indigo-600 dark:to-violet-600 dark:shadow-indigo-500/10 sm:p-8">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5" />

      <div className="relative">
        <p className="text-sm font-medium text-indigo-100">
          Bienvenido de vuelta
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          ¡Hola, {welcome.studentName}! 👋
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold backdrop-blur-sm">
            <Flame className="h-4 w-4 text-amber-300" />
            {welcome.attendanceStreak} días de racha
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold backdrop-blur-sm">
            <Layers className="h-4 w-4 text-indigo-200" />
            {welcome.groupCount} grupos
          </div>
        </div>
      </div>
    </div>
  )
}
