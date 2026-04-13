import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export interface ReportSummary {
  totalStudents: number
  averageRate: number
  totalPresent: number
  totalAbsent: number
  totalLate: number
  totalExcused: number
  totalSessions: number
}

interface ReportSummaryCardsProps {
  summary: ReportSummary | null
  loading: boolean
}

function rateColorClass(rate: number): string {
  if (rate >= 90) return 'text-emerald-600 dark:text-emerald-400'
  if (rate >= 75) return 'text-amber-500 dark:text-amber-400'
  return 'text-red-500 dark:text-red-400'
}

export function ReportSummaryCards({ summary, loading }: ReportSummaryCardsProps) {
  const { t } = useTranslation('attendance')

  if (!loading && !summary) return null

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-5 pb-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">{t('reports.averageRate')}</p>
          <p className={`text-3xl font-bold tabular-nums ${rateColorClass(summary!.averageRate)}`}>
            {summary!.averageRate.toFixed(1)}
            <span className="text-lg font-semibold">%</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('reports.sessions', { count: summary!.totalSessions })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 pb-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">{t('reports.totalPresent')}</p>
          <p className="text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {summary!.totalPresent}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 pb-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">{t('reports.totalAbsent')}</p>
          <p className="text-3xl font-bold tabular-nums text-red-500 dark:text-red-400">
            {summary!.totalAbsent}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 pb-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">{t('reports.totalLate')}</p>
          <p className="text-3xl font-bold tabular-nums text-amber-500 dark:text-amber-400">
            {summary!.totalLate}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
