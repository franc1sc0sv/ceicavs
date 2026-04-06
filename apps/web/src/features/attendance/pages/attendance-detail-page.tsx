import { useState } from 'react'
import { useQueryState, parseAsString } from 'nuqs'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Pencil } from 'lucide-react'
import { Action, Subject } from '@ceicavs/shared'
import { useAbility } from '@/context/ability.context'
import { useSetBreadcrumb } from '@/context/breadcrumb.context'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DatePicker } from '@/components/ui/date-picker'
import { RosterRow } from '../components/roster-row'
import { EmptyState } from '../components/empty-state'
import { GroupEditSheet } from '../components/group-edit-sheet'
import { useRoster } from '../hooks/use-roster'
import { useRecordAttendance } from '../hooks/use-record-attendance'

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

const BADGE_CLASS: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  absent: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  late: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  excused: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

export default function AttendanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('attendance')
  const ability = useAbility()

  const [date, setDate] = useQueryState(
    'date',
    parseAsString.withDefault(new Date().toLocaleDateString('en-CA')),
  )
  const [changes, setChanges] = useState<Record<string, AttendanceStatus>>({})
  const [activeTab, setActiveTab] = useState<'roster' | 'reports'>('roster')
  const [editOpen, setEditOpen] = useState(false)

  const { rosterData, loading, error, refetch } = useRoster({ groupId: id ?? null, date })
  const { recordAttendance, loading: submitting } = useRecordAttendance()

  const groupName = rosterData?.group.name ?? ''

  useSetBreadcrumb([
    { label: t('back'), to: '/attendance' },
    { label: groupName },
  ])

  const mergedRoster = (rosterData?.roster ?? []).map((student) => ({
    ...student,
    status: changes[student.id] ?? student.status,
  }))

  const hasChanges = Object.keys(changes).length > 0

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setChanges((prev) => ({ ...prev, [studentId]: status }))
  }

  const handleSubmit = () => {
    if (!id) return
    const records = mergedRoster
      .filter((s) => s.status !== null)
      .map((s) => ({ studentId: s.id, status: s.status as AttendanceStatus }))
    recordAttendance({
      variables: { input: { groupId: id, date, records } },
      onCompleted: () => {
        setChanges({})
        refetch()
      },
    })
  }

  const canManage = ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)
  const canUpdateGroup = ability.can(Action.UPDATE, Subject.GROUP)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          {loading && !groupName ? (
            <Skeleton className="h-7 w-48" />
          ) : (
            <h1 className="text-xl font-bold text-foreground truncate">{groupName}</h1>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <DatePicker
            value={date}
            onChange={(d) => {
              void setDate(d)
              setChanges({})
            }}
          />

          {canUpdateGroup && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditOpen(true)}
              aria-label={t('sheet.edit')}
            >
              <Pencil className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex border-b border-border">
        {(['roster', 'reports'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            aria-selected={activeTab === tab}
            role="tab"
            className={[
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>

      {activeTab === 'roster' ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">{t('error.title')}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t('error.retry')}
              </button>
            </div>
          ) : mergedRoster.length === 0 ? (
            <div className="py-12">
              <EmptyState message={t('empty.noStudents')} />
            </div>
          ) : (
            <>
              <div className="flex gap-2 px-5 pt-4 pb-3 border-b border-border/60 flex-wrap">
                {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((s) => {
                  const count = mergedRoster.filter((r) => r.status === s).length
                  if (count === 0) return null
                  return (
                    <span key={s} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_CLASS[s]}`}>
                      {t(`status.${s}`)}: {count}
                    </span>
                  )
                })}
                {mergedRoster.every((r) => r.status === null) && (
                  <span className="text-xs text-muted-foreground">{t('noMark')}</span>
                )}
              </div>

              <div className="px-5">
                {mergedRoster.map((student) => (
                  <RosterRow
                    key={student.id}
                    student={student}
                    onStatusChange={canManage ? handleStatusChange : () => undefined}
                  />
                ))}
              </div>

              {canManage && (
                <div className="px-5 py-4 border-t border-border">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!hasChanges || submitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {rosterData?.group.todaySubmitted ? t('actions.update') : t('actions.submit')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <p className="text-sm text-muted-foreground">{t('empty.noReports')}</p>
        </div>
      )}

      {id && (
        <GroupEditSheet
          groupId={id}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSaved={() => refetch()}
        />
      )}
    </div>
  )
}
