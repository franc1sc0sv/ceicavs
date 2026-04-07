import { useTranslation } from 'react-i18next'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StudentAttendanceDayPoint {
  date: string
  status: string | null
}

interface StudentAttendanceChartProps {
  data: StudentAttendanceDayPoint[]
}

const STATUS_COLORS = {
  present: '#22c55e',
  absent: '#ef4444',
  late: '#f59e0b',
  excused: '#3b82f6',
}

export function StudentAttendanceChart({ data }: StudentAttendanceChartProps) {
  const { t } = useTranslation('dashboard')

  const statuses = ['present', 'absent', 'late', 'excused'] as const

  const grouped = data.reduce<Record<string, Record<string, number>>>(
    (acc, point) => {
      if (!acc[point.date]) {
        acc[point.date] = { present: 0, absent: 0, late: 0, excused: 0 }
      }
      const status = point.status ?? 'absent'
      if (status in acc[point.date]) {
        acc[point.date][status] = (acc[point.date][status] ?? 0) + 1
      }
      return acc
    },
    {},
  )

  const chartData = Object.entries(grouped).map(([date, counts]) => ({
    date,
    ...counts,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {t('charts.myAttendance')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            {statuses.map((status) => (
              <Bar
                key={status}
                dataKey={status}
                name={t(`charts.${status}`)}
                stackId="a"
                fill={STATUS_COLORS[status]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
