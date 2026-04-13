import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface StudentRow {
  studentId: string
  studentName: string
  attendanceRate: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  totalDays: number
}

interface ReportStudentTableProps {
  students: StudentRow[]
  loading: boolean
}

export function ReportStudentTable({ students, loading }: ReportStudentTableProps) {
  const { t } = useTranslation('attendance')

  const sorted = [...students].sort((a, b) => b.attendanceRate - a.attendanceRate)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">{t('reports.columns.student')}</TableHead>
          <TableHead className="font-semibold w-44">{t('reports.columns.rate')}</TableHead>
          <TableHead className="text-right font-semibold text-emerald-600 dark:text-emerald-400 w-12">
            {t('reports.columns.present')}
          </TableHead>
          <TableHead className="text-right font-semibold text-red-500 dark:text-red-400 w-12">
            {t('reports.columns.absent')}
          </TableHead>
          <TableHead className="text-right font-semibold text-amber-500 dark:text-amber-400 w-12">
            {t('reports.columns.late')}
          </TableHead>
          <TableHead className="text-right font-semibold text-slate-400 w-12">
            {t('reports.columns.excused')}
          </TableHead>
          <TableHead className="text-right font-semibold w-16">{t('reports.columns.totalDays')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={7}>
                <Skeleton className="h-8 w-full rounded" />
              </TableCell>
            </TableRow>
          ))
        ) : sorted.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
              {t('reports.noData')}
            </TableCell>
          </TableRow>
        ) : (
          sorted.map((row) => (
            <TableRow key={row.studentId}>
              <TableCell className="font-medium">{row.studentName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className="w-20 h-1.5 rounded-full bg-muted overflow-hidden flex-shrink-0"
                    role="progressbar"
                    aria-valuenow={row.attendanceRate}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={`h-full rounded-full ${
                        row.attendanceRate >= 90
                          ? 'bg-emerald-500'
                          : row.attendanceRate >= 75
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${row.attendanceRate}%` }}
                    />
                  </div>
                  <span className="font-semibold tabular-nums text-foreground w-12 text-right">
                    {row.attendanceRate}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                {row.presentCount}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums text-red-500 dark:text-red-400">
                {row.absentCount}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums text-amber-500 dark:text-amber-400">
                {row.lateCount}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums text-slate-400 dark:text-slate-500">
                {row.excusedCount}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums text-muted-foreground">
                {row.totalDays}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
