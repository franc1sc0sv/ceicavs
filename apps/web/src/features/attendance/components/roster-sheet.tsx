import type { ReportPeriod } from '@/generated/graphql'
import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DatePicker } from '@/components/ui/date-picker'
import { RosterRow } from './roster-row'
import { ReportTable } from './report-table'
import { EmptyState } from './empty-state'
import { useRoster } from '../hooks/use-roster'
import { useAttendanceReport } from '../hooks/use-attendance-report'
import { useRecordAttendance } from '../hooks/use-record-attendance'

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

interface RosterStudent {
  id: string
  name: string
  avatarUrl: string | null
  status: string | null
}

interface RosterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupId: string | null
  selectedDate: string
  onDateChange: (date: string) => void
  rosterChanges: Record<string, string>
  onStatusChange: (studentId: string, status: AttendanceStatus) => void
  reportPeriod: ReportPeriod
  onReportPeriodChange: (period: ReportPeriod) => void
  activeTab: 'roster' | 'reports'
  onTabChange: (tab: 'roster' | 'reports') => void
}

export function RosterSheet({
  open,
  onOpenChange,
  groupId,
  selectedDate,
  onDateChange,
  rosterChanges,
  onStatusChange,
  reportPeriod,
  onReportPeriodChange,
  activeTab,
  onTabChange,
}: RosterSheetProps) {
  const { t } = useTranslation('attendance')
  const { rosterData, loading: rosterLoading, error: rosterError } = useRoster({ groupId, date: selectedDate })
  const { reports, loading: reportLoading } = useAttendanceReport({ groupId, period: reportPeriod })
  const { recordAttendance, loading: submitting } = useRecordAttendance()

  const mergedRoster: RosterStudent[] = (rosterData?.roster as RosterStudent[] | undefined ?? []).map((student: RosterStudent) => ({
    ...student,
    status: rosterChanges[student.id] ?? student.status,
  }))

  const hasAnyStatus = mergedRoster.some((s: RosterStudent) => s.status !== null)

  const handleSubmit = () => {
    if (!groupId) return
    const records = mergedRoster
      .filter((s: RosterStudent) => s.status !== null)
      .map((s: RosterStudent) => ({ studentId: s.id, status: s.status as AttendanceStatus }))
    recordAttendance({
      variables: { input: { groupId, date: selectedDate, records } },
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[480px] flex flex-col p-0" showCloseButton>
        <SheetHeader className="px-5 pt-5 pb-0">
          <SheetTitle>{rosterData?.group.name ?? '…'}</SheetTitle>
          <div className="mt-2">
            <DatePicker value={selectedDate} onChange={onDateChange} />
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as 'roster' | 'reports')} className="mx-5 mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="roster" className="flex-1">{t('tabs.roster')}</TabsTrigger>
            <TabsTrigger value="reports" className="flex-1">{t('tabs.reports')}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'roster' ? (
            <div className="px-5 py-4">
              {rosterLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              ) : rosterError ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">{t('error.title')}</p>
                </div>
              ) : mergedRoster.length === 0 ? (
                <EmptyState message={t('empty.noStudents')} />
              ) : (
                <>
                  <div className="flex gap-2 pb-3 border-b border-border/60 mb-1 flex-wrap">
                    {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((s) => {
                      const count = mergedRoster.filter((r: RosterStudent) => r.status === s).length
                      if (count === 0) return null
                      const badgeClass = {
                        present: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
                        absent: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
                        late: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
                        excused: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                      }[s]
                      return (
                        <span key={s} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}>
                          {t(`status.${s}`)}: {count}
                        </span>
                      )
                    })}
                    {mergedRoster.every((r: RosterStudent) => r.status === null) && (
                      <span className="text-xs text-muted-foreground">{t('noMark')}</span>
                    )}
                  </div>
                  <div>
                    {mergedRoster.map((student: RosterStudent) => (
                      <RosterRow key={student.id} student={student} onStatusChange={onStatusChange} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="px-5 py-4">
              <ReportTable
                groupId={groupId ?? ''}
                reports={reports}
                loading={reportLoading}
                period={reportPeriod}
                onPeriodChange={onReportPeriodChange}
              />
            </div>
          )}
        </div>

        {activeTab === 'roster' && mergedRoster.length > 0 && (
          <>
            <Separator />
            <div className="px-5 py-4">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!hasAnyStatus || submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {rosterData?.group.todaySubmitted ? t('actions.update') : t('actions.submit')}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
