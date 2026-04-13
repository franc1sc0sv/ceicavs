import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetBreadcrumb } from '@/context/breadcrumb.context'
import { useAttendanceGroups } from '../hooks/use-attendance-groups'
import { useAttendanceReportByRange } from '../hooks/use-attendance-report-by-range'
import { ReportFilters } from '../components/report-filters'
import { ReportSummaryCards } from '../components/report-summary-cards'
import { ReportStudentTable } from '../components/report-student-table'

export default function AttendanceReportsPage() {
  const { t } = useTranslation('attendance')

  const [groupId, setGroupId] = useState('')
  const [dateFrom, setDateFrom] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'),
  )
  const [dateTo, setDateTo] = useState(new Date().toLocaleDateString('en-CA'))
  const [shouldRun, setShouldRun] = useState(false)

  const { groups, loading: groupsLoading } = useAttendanceGroups()
  const { report, loading: reportLoading, refetch } = useAttendanceReportByRange({
    groupId,
    dateFrom,
    dateTo,
    skip: !shouldRun || !groupId,
  })

  useSetBreadcrumb([
    { label: t('title'), to: '/attendance' },
    { label: t('reports.title') },
  ])

  const handleRun = () => {
    if (shouldRun) {
      void refetch()
    } else {
      setShouldRun(true)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">{t('reports.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('reports.subtitle')}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <ReportFilters
          groupId={groupId}
          dateFrom={dateFrom}
          dateTo={dateTo}
          groups={groups}
          groupsLoading={groupsLoading}
          onGroupChange={setGroupId}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onRun={handleRun}
          loading={reportLoading}
        />
      </div>

      {shouldRun && (
        <>
          <ReportSummaryCards summary={report?.summary ?? null} loading={reportLoading} />
          <div className="bg-card border border-border rounded-2xl p-5">
            <ReportStudentTable
              students={report?.students ?? []}
              loading={reportLoading}
            />
          </div>
        </>
      )}
    </div>
  )
}
