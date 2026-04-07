import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const GROUP_COLORS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#3b82f6',
  '#ec4899',
  '#8b5cf6',
]

interface AttendanceDayPoint {
  date: string
  rate: number
}

interface AttendanceGroupLine {
  groupId: string
  groupName: string
  points: AttendanceDayPoint[]
}

interface AdminLineChartProps {
  mode: 'admin'
  data: AttendanceDayPoint[]
}

interface TeacherLineChartProps {
  mode: 'teacher'
  data: AttendanceGroupLine[]
}

type AttendanceLineChartProps = AdminLineChartProps | TeacherLineChartProps

export function AttendanceLineChart(props: AttendanceLineChartProps) {
  const { t } = useTranslation('dashboard')

  if (props.mode === 'admin') {
    const formatted = props.data.map((d) => ({
      date: d.date,
      rate: Math.round(d.rate * 100),
    }))

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {t('charts.attendanceTrend')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
              />
              <YAxis
                domain={[0, 100]}
                unit="%"
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
              />
              <Tooltip
                formatter={(value) => [
                  typeof value === 'number' ? `${value}%` : value,
                  t('charts.attendanceRate'),
                ]}
                labelClassName="text-foreground"
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  const allDates = Array.from(
    new Set(props.data.flatMap((g) => g.points.map((p) => p.date))),
  ).sort()

  const formatted = allDates.map((date) => {
    const point: Record<string, string | number> = { date }
    props.data.forEach((group) => {
      const match = group.points.find((p) => p.date === date)
      point[group.groupId] = match ? Math.round(match.rate * 100) : 0
    })
    return point
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {t('charts.groupAttendanceTrend')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
            />
            <YAxis
              domain={[0, 100]}
              unit="%"
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
            />
            <Tooltip
              formatter={(value, name) => {
                const groupName = typeof name === 'string'
                  ? (props.data.find((g) => g.groupId === name)?.groupName ?? name)
                  : String(name)
                const displayValue = typeof value === 'number' ? `${value}%` : value
                return [displayValue, groupName]
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend
              formatter={(value: string) => {
                const group = props.data.find((g) => g.groupId === value)
                return group?.groupName ?? value
              }}
            />
            {props.data.map((group, index) => (
              <Line
                key={group.groupId}
                type="monotone"
                dataKey={group.groupId}
                stroke={GROUP_COLORS[index % GROUP_COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
