import { useTranslation } from 'react-i18next'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'

const GROUP_PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const

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
    const chartConfig = {
      rate: {
        label: t('charts.attendanceRate'),
        color: 'var(--chart-1)',
      },
    } satisfies ChartConfig

    const formatted = props.data.map((d) => ({
      date: d.date,
      rate: Math.round(d.rate),
    }))

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {t('charts.attendanceTrend')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart accessibilityLayer data={formatted} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={(v) => [`${v}%`, t('charts.attendanceRate')]} />}
              />
              <Line
                dataKey="rate"
                type="monotone"
                stroke="var(--color-rate)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }

  const chartConfig = Object.fromEntries(
    props.data.map((group, index) => [
      group.groupId,
      { label: group.groupName, color: GROUP_PALETTE[index % GROUP_PALETTE.length] },
    ]),
  ) satisfies ChartConfig

  const allDates = Array.from(
    new Set(props.data.flatMap((g) => g.points.map((p) => p.date))),
  ).sort()

  const formatted = allDates.map((date) => {
    const point: Record<string, string | number> = { date }
    props.data.forEach((group, index) => {
      const match = group.points.find((p) => p.date === date)
      point[group.groupId] = match ? Math.round(match.rate) : 0
      void index
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
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={formatted} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
            <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${v}%`} />} />
            <ChartLegend content={<ChartLegendContent />} />
            {props.data.map((group, index) => (
              <Line
                key={group.groupId}
                dataKey={group.groupId}
                type="monotone"
                stroke={GROUP_PALETTE[index % GROUP_PALETTE.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
