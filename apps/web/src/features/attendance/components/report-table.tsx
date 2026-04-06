import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from './empty-state'
import { useExportAttendance } from '../hooks/use-export-attendance'
import type { ReportPeriod, ExportFormat } from '@/generated/graphql'

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
  groupId: string
  reports: StudentReport[]
  loading: boolean
  period: ReportPeriod
  onPeriodChange: (period: ReportPeriod) => void
}

export function ReportTable({ groupId, reports, loading, period, onPeriodChange }: ReportTableProps) {
  const { t } = useTranslation('attendance')
  const { exportAttendance, loading: exporting } = useExportAttendance()

  const periods: { value: ReportPeriod; labelKey: string }[] = [
    { value: 'DAILY', labelKey: 'period.daily' },
    { value: 'WEEKLY', labelKey: 'period.weekly' },
    { value: 'MONTHLY', labelKey: 'period.monthly' },
  ]

  const handleExport = (format: ExportFormat) => {
    exportAttendance({ variables: { input: { groupId, period, format } } })
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5">
        <div
          className="flex rounded-lg border border-border overflow-hidden"
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

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleExport('PDF')}
            disabled={exporting}
            aria-label={t('actions.exportPdf')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('actions.exportPdf')}
          </button>
          <button
            type="button"
            onClick={() => handleExport('EXCEL')}
            disabled={exporting}
            aria-label={t('actions.exportExcel')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('actions.exportExcel')}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs font-medium text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />
          {t('legend.present')}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" aria-hidden="true" />
          {t('legend.absent')}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" aria-hidden="true" />
          {t('legend.late')}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" aria-hidden="true" />
          {t('legend.excused')}
        </span>
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
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-2.5 px-4 sm:px-0 pr-4 font-semibold text-muted-foreground">
                  {t('report.student')}
                </th>
                <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground w-40">
                  {t('report.attendance')}
                </th>
                <th className="text-right py-2.5 px-2 font-semibold text-emerald-600 dark:text-emerald-400 w-10">P</th>
                <th className="text-right py-2.5 px-2 font-semibold text-red-500 dark:text-red-400 w-10">A</th>
                <th className="text-right py-2.5 px-2 font-semibold text-amber-500 dark:text-amber-400 w-10">T</th>
                <th className="text-right py-2.5 pl-2 pr-4 sm:pr-0 font-semibold text-slate-400 w-10">J</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r.studentId}
                  className="border-b border-border/60 last:border-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="py-3 px-4 sm:px-0 pr-4 font-medium text-foreground">{r.studentName}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <div
                        className="w-20 h-1.5 rounded-full bg-muted overflow-hidden flex-shrink-0"
                        role="progressbar"
                        aria-valuenow={r.attendanceRate}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`h-full rounded-full ${
                            r.attendanceRate >= 90
                              ? 'bg-emerald-500'
                              : r.attendanceRate >= 75
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${r.attendanceRate}%` }}
                        />
                      </div>
                      <span className="font-semibold tabular-nums text-foreground w-10 text-right">
                        {r.attendanceRate}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                    {r.presentCount}
                  </td>
                  <td className="py-3 px-2 text-right font-medium tabular-nums text-red-500 dark:text-red-400">
                    {r.absentCount}
                  </td>
                  <td className="py-3 px-2 text-right font-medium tabular-nums text-amber-500 dark:text-amber-400">
                    {r.lateCount}
                  </td>
                  <td className="py-3 pl-2 pr-4 sm:pr-0 text-right font-medium tabular-nums text-slate-400 dark:text-slate-500">
                    {r.excusedCount}
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
