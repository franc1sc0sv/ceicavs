import { useState } from 'react'
import type {
  AttendanceProps,
  AttendanceStatus,
  ExportFormat,
  ReportPeriod,
  StudentHistoryRecord,
  StudentReport,
  StudentSummary,
} from '../types'
import { GroupCard } from './GroupCard'
import { RosterRow } from './RosterRow'

// ── Status badge config ──────────────────────────────────────────────────────

const STATUS_BADGE: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  absent:  'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  late:    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  excused: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: 'Presente',
  absent:  'Ausente',
  late:    'Tarde',
  excused: 'Justificado',
}

// ── Shared helpers ───────────────────────────────────────────────────────────

function RateRing({ rate, size = 56 }: { rate: number; size?: number }) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (rate / 100) * circumference
  const color = rate >= 90 ? '#10b981' : rate >= 75 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor"
          strokeWidth="5" className="text-slate-200 dark:text-slate-700" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
          strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums" style={{ color }}>{rate}%</span>
    </div>
  )
}

// ── Reports tab ──────────────────────────────────────────────────────────────

interface ReportsTabProps {
  reports: StudentReport[]
  period: ReportPeriod
  onPeriodChange?: (p: ReportPeriod) => void
  onExport?: (format: ExportFormat) => void
}

function ReportsTab({ reports, period, onPeriodChange, onExport }: ReportsTabProps) {
  const periods: { value: ReportPeriod; label: string }[] = [
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
  ]

  return (
    <div>
      {/* Filter + export row */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {periods.map((p, i) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange?.(p.value)}
              className={[
                'px-3 py-2 text-sm font-medium transition-colors',
                i > 0 ? 'border-l border-slate-200 dark:border-slate-700' : '',
                period === p.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800',
              ].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onExport?.('pdf')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
          <button
            onClick={() => onExport?.('excel')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Presente</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Ausente</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Tarde</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400 inline-block" /> Justificado</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700">
              <th className="text-left py-2.5 px-4 sm:px-0 pr-4 font-semibold text-slate-600 dark:text-slate-300">Alumno</th>
              <th className="text-right py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-300 w-40">Asistencia</th>
              <th className="text-right py-2.5 px-2 font-semibold text-emerald-600 dark:text-emerald-400 w-10">P</th>
              <th className="text-right py-2.5 px-2 font-semibold text-red-500 dark:text-red-400 w-10">A</th>
              <th className="text-right py-2.5 px-2 font-semibold text-amber-500 dark:text-amber-400 w-10">T</th>
              <th className="text-right py-2.5 pl-2 pr-4 sm:pr-0 font-semibold text-slate-400 w-10">J</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.studentId} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 sm:px-0 pr-4 font-medium text-slate-800 dark:text-slate-200">{r.studentName}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                      <div
                        className={`h-full rounded-full ${r.attendanceRate >= 90 ? 'bg-emerald-500' : r.attendanceRate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${r.attendanceRate}%` }}
                      />
                    </div>
                    <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-300 w-10 text-right">
                      {r.attendanceRate}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right font-medium tabular-nums text-emerald-600 dark:text-emerald-400">{r.presentCount}</td>
                <td className="py-3 px-2 text-right font-medium tabular-nums text-red-500 dark:text-red-400">{r.absentCount}</td>
                <td className="py-3 px-2 text-right font-medium tabular-nums text-amber-500 dark:text-amber-400">{r.lateCount}</td>
                <td className="py-3 pl-2 pr-4 sm:pr-0 text-right font-medium tabular-nums text-slate-400 dark:text-slate-500">{r.excusedCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Student personal view ────────────────────────────────────────────────────

function StudentView({
  summary,
  history,
}: {
  summary: StudentSummary
  history: StudentHistoryRecord[]
}) {
  const grouped = history.reduce<Record<string, StudentHistoryRecord[]>>((acc, r) => {
    if (!acc[r.date]) acc[r.date] = []
    acc[r.date].push(r)
    return acc
  }, {})

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="max-w-2xl mx-auto">
      {/* Summary banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 rounded-2xl p-6 mb-6 text-white shadow-lg shadow-indigo-500/20">
        <p className="text-xs font-semibold text-indigo-200 uppercase tracking-widest mb-5">Mi Asistencia</p>
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center gap-2">
            <RateRing rate={summary.overallRate} size={64} />
            <span className="text-xs text-indigo-200">General</span>
          </div>
          <div className="w-px h-12 bg-indigo-500" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl">🔥</span>
              <span className="text-4xl font-bold tabular-nums">{summary.currentStreak}</span>
            </div>
            <span className="text-xs text-indigo-200">días seguidos</span>
          </div>
          <div className="w-px h-12 bg-indigo-500" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-bold tabular-nums">{summary.groupCount}</span>
            <span className="text-xs text-indigo-200">grupos</span>
          </div>
        </div>
      </div>

      {/* History */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
          Historial
        </p>
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-slate-400 dark:text-slate-600 text-sm">Sin registros de asistencia todavía</p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([date, records]) => (
              <div key={date}>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide capitalize mb-2">
                  {formatDate(date)}
                </p>
                <div className="space-y-2">
                  {records.map(r => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.groupName}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main exportable component ────────────────────────────────────────────────

export function AttendanceView({
  role,
  groups = [],
  groupDetail,
  studentSummary,
  studentHistory = [],
  reportPeriod = 'monthly',
  onGroupSelect,
  onStatusChange,
  onSubmitAttendance,
  onDateChange,
  onPeriodChange,
  onExport,
  onBack,
}: AttendanceProps) {
  const [activeTab, setActiveTab] = useState<'roster' | 'reports'>('roster')

  // ── Student view ─────────────────────────────────────────────────────────
  if (role === 'student') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <StudentView
          summary={studentSummary ?? { overallRate: 0, currentStreak: 0, groupCount: 0 }}
          history={studentHistory}
        />
      </div>
    )
  }

  // ── Group detail view ─────────────────────────────────────────────────────
  if (groupDetail) {
    const hasStatus = groupDetail.roster.some(s => s.status !== null)

    return (
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Breadcrumb header */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Asistencia
          </button>
          <svg className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{groupDetail.group.name}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Fecha:</span>
            <input
              type="date"
              value={groupDetail.date}
              onChange={e => onDateChange?.(e.target.value)}
              className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-5 w-fit">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === 'roster'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Lista del día
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-5 py-2 text-sm font-medium border-l border-slate-200 dark:border-slate-700 transition-colors ${
              activeTab === 'reports'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Reportes
          </button>
        </div>

        {/* Tab content panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {activeTab === 'roster' ? (
            <>
              {groupDetail.roster.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">👥</p>
                  <p className="text-slate-400 dark:text-slate-600 text-sm">No hay alumnos en este grupo</p>
                </div>
              ) : (
                <>
                  {/* Roster summary chips */}
                  <div className="flex gap-2 px-4 sm:px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap">
                    {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map(s => {
                      const count = groupDetail.roster.filter(r => r.status === s).length
                      return count > 0 ? (
                        <span key={s} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[s]}`}>
                          {STATUS_LABEL[s]}: {count}
                        </span>
                      ) : null
                    })}
                    {groupDetail.roster.every(r => r.status === null) && (
                      <span className="text-xs text-slate-400 dark:text-slate-600">Sin marcar todavía</span>
                    )}
                  </div>

                  {/* Roster list */}
                  <div className="px-4 sm:px-5">
                    {groupDetail.roster.map(student => (
                      <RosterRow key={student.id} student={student} onStatusChange={onStatusChange} />
                    ))}
                  </div>

                  {/* Submit button */}
                  <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={onSubmitAttendance}
                      disabled={!hasStatus}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {groupDetail.group.todaySubmitted ? 'Actualizar asistencia' : 'Enviar asistencia'}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="p-4 sm:p-5">
              <ReportsTab
                reports={groupDetail.reports}
                period={reportPeriod}
                onPeriodChange={onPeriodChange}
                onExport={onExport}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Groups list ───────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Asistencia</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Selecciona un grupo para tomar la lista del día
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-slate-400 dark:text-slate-600">No tienes grupos asignados todavía</p>
        </div>
      ) : (
        <>
          {/* Pending indicator */}
          {groups.some(g => !g.todaySubmitted) && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-3 mb-5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>
                {groups.filter(g => !g.todaySubmitted).length} grupo(s) sin asistencia registrada hoy
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(g => (
              <GroupCard key={g.id} group={g} onClick={() => onGroupSelect?.(g.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
