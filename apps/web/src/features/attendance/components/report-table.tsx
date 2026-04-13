import { useTranslation } from 'react-i18next'
import { Info, ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { EmptyState } from './empty-state'
import type { ReportPeriod } from '@/generated/graphql'

interface StudentReport {
  studentId: string
  studentName: string
  attendanceRate: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  totalDays: number
}

interface ReportTableProps {
  reports: StudentReport[]
  loading: boolean
  period: ReportPeriod
  onPeriodChange: (period: ReportPeriod) => void
  selectedDate: string
  onDateChange: (date: string) => void
}

function rateColor(rate: number) {
  if (rate >= 80) return 'text-emerald-500 dark:text-emerald-400'
  if (rate >= 30) return 'text-amber-500 dark:text-amber-400'
  return 'text-red-500 dark:text-red-400'
}

function barColor(rate: number) {
  if (rate >= 80) return 'bg-emerald-500'
  if (rate >= 30) return 'bg-amber-500'
  return 'bg-red-500'
}

function formatDateLabel(period: ReportPeriod, selectedDate: string): string {
  const anchor = new Date(selectedDate + 'T12:00:00')

  if (period === 'DAILY') {
    return anchor.toLocaleDateString('es-SV', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (period === 'WEEKLY') {
    const dayOfWeek = anchor.getDay()
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const monday = new Date(anchor)
    monday.setDate(monday.getDate() - daysFromMonday)
    const sunday = new Date(monday)
    sunday.setDate(sunday.getDate() + 6)
    const startStr = monday.toLocaleDateString('es-SV', { month: 'short', day: 'numeric' })
    const endStr = sunday.toLocaleDateString('es-SV', { month: 'short', day: 'numeric', year: 'numeric' })
    return `${startStr} – ${endStr}`
  }

  return anchor.toLocaleDateString('es-SV', { month: 'long', year: 'numeric' })
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en-CA')
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString('en-CA')
}

function navigateDate(dateStr: string, period: ReportPeriod, direction: number): string {
  if (period === 'MONTHLY') return addMonths(dateStr, direction)
  if (period === 'WEEKLY') return addDays(dateStr, direction * 7)
  return addDays(dateStr, direction)
}

function getMondayOf(d: Date): Date {
  const day = d.getDay()
  const daysFromMonday = day === 0 ? 6 : day - 1
  const monday = new Date(d)
  monday.setDate(monday.getDate() - daysFromMonday)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function isAtCurrentLimit(dateStr: string, period: ReportPeriod): boolean {
  const today = new Date()
  const anchor = new Date(dateStr + 'T12:00:00')
  if (period === 'MONTHLY') {
    return anchor.getFullYear() === today.getFullYear() && anchor.getMonth() === today.getMonth()
  }
  if (period === 'WEEKLY') {
    return getMondayOf(anchor) >= getMondayOf(today)
  }
  return dateStr === today.toLocaleDateString('en-CA')
}

export function ReportTable({ reports, loading, period, onPeriodChange, selectedDate, onDateChange }: ReportTableProps) {
  const { t } = useTranslation('attendance')

  const periods: { value: ReportPeriod; labelKey: string }[] = [
    { value: 'DAILY', labelKey: 'period.daily' },
    { value: 'WEEKLY', labelKey: 'period.weekly' },
    { value: 'MONTHLY', labelKey: 'period.monthly' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div
          className="flex rounded-lg border border-border overflow-hidden w-fit"
          role="group"
          aria-label={t('tabs.reports')}
        >
          {periods.map((p, i) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onPeriodChange(p.value)}
              aria-pressed={period === p.value}
              className={[
                'px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                i > 0 ? 'border-l border-border' : '',
                period === p.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              ].join(' ')}
            >
              {t(p.labelKey)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDateChange(navigateDate(selectedDate, period, -1))}
            aria-label="Previous"
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="min-w-[160px] text-center text-sm font-medium text-foreground tabular-nums">
            {formatDateLabel(period, selectedDate)}
          </span>
          <button
            type="button"
            onClick={() => onDateChange(navigateDate(selectedDate, period, 1))}
            disabled={isAtCurrentLimit(selectedDate, period)}
            aria-label="Next"
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState message={t('empty.noReports')} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-2.5 pr-4 font-semibold text-muted-foreground w-[30%]">
                  {t('report.student')}
                </th>
                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground w-[25%]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="inline-flex items-center gap-1 cursor-default">
                        {t('report.attendance')}
                        <Info className="w-3.5 h-3.5 text-muted-foreground/60" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px] text-center text-xs">
                        {t('report.rateTooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-center py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400 w-[9%]">
                  {t('legend.present')}
                </th>
                <th className="text-center py-2.5 px-3 font-semibold text-red-500 dark:text-red-400 w-[9%]">
                  {t('legend.absent')}
                </th>
                <th className="text-center py-2.5 px-3 font-semibold text-amber-500 dark:text-amber-400 w-[9%]">
                  {t('legend.late')}
                </th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-400 w-[9%]">
                  {t('legend.excused')}
                </th>
                <th className="text-center py-2.5 pl-3 font-semibold text-muted-foreground w-[9%]">
                  {t('report.days')}
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r.studentId}
                  className="border-b border-border/60 last:border-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="py-3 pr-4 font-medium text-foreground">{r.studentName}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"
                        role="progressbar"
                        aria-valuenow={r.attendanceRate}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`h-full rounded-full ${barColor(r.attendanceRate)}`}
                          style={{ width: `${r.attendanceRate}%` }}
                        />
                      </div>
                      <span className={`font-semibold tabular-nums w-14 text-right ${rateColor(r.attendanceRate)}`}>
                        {r.attendanceRate.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                    {r.presentCount}
                  </td>
                  <td className="py-3 px-3 text-center font-medium tabular-nums text-red-500 dark:text-red-400">
                    {r.absentCount}
                  </td>
                  <td className="py-3 px-3 text-center font-medium tabular-nums text-amber-500 dark:text-amber-400">
                    {r.lateCount}
                  </td>
                  <td className="py-3 px-3 text-center font-medium tabular-nums text-slate-400 dark:text-slate-500">
                    {r.excusedCount}
                  </td>
                  <td className="py-3 pl-3 text-center font-medium tabular-nums text-muted-foreground">
                    {r.presentCount + r.lateCount}/{r.totalDays}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
