import { useTranslation } from 'react-i18next'
import { Bar, BarChart, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'

interface StudentAttendanceDayPoint {
  date: string
  status: string | null
}

interface StudentAttendanceChartProps {
  data: StudentAttendanceDayPoint[]
}

export function StudentAttendanceChart({ data }: StudentAttendanceChartProps) {
  const { t } = useTranslation('dashboard')

  const chartConfig = {
    present: { label: t('charts.present'), color: 'var(--chart-1)' },
    late: { label: t('charts.late'), color: 'var(--chart-2)' },
    excused: { label: t('charts.excused'), color: 'var(--chart-3)' },
    absent: { label: t('charts.absent'), color: 'var(--chart-4)' },
  } satisfies ChartConfig

  const grouped = data.reduce<Record<string, Record<string, number>>>((acc, point) => {
    if (!acc[point.date]) {
      acc[point.date] = { present: 0, absent: 0, late: 0, excused: 0 }
    }
    const status = point.status ?? 'absent'
    if (status in acc[point.date]) {
      acc[point.date][status] = (acc[point.date][status] ?? 0) + 1
    }
    return acc
  }, {})

  const chartData = Object.entries(grouped).map(([date, counts]) => ({ date, ...counts }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {t('charts.myAttendance')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="present" stackId="a" fill="var(--color-present)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="late" stackId="a" fill="var(--color-late)" />
            <Bar dataKey="excused" stackId="a" fill="var(--color-excused)" />
            <Bar dataKey="absent" stackId="a" fill="var(--color-absent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
