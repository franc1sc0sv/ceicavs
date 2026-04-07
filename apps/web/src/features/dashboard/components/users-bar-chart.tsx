import { useTranslation } from 'react-i18next'
import { Bar, BarChart, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

interface UsersByRole {
  admin: number
  teacher: number
  student: number
}

interface UsersBarChartProps {
  data: UsersByRole
}

export function UsersBarChart({ data }: UsersBarChartProps) {
  const { t } = useTranslation('dashboard')

  const chartConfig = {
    value: { label: t('charts.usersByRole') },
    admin: { label: t('charts.roleAdmin'), color: 'var(--chart-1)' },
    teacher: { label: t('charts.roleTeacher'), color: 'var(--chart-2)' },
    student: { label: t('charts.roleStudent'), color: 'var(--chart-3)' },
  } satisfies ChartConfig

  const chartData = [
    { role: 'admin', label: t('charts.roleAdmin'), value: data.admin, fill: 'var(--color-admin)' },
    { role: 'teacher', label: t('charts.roleTeacher'), value: data.teacher, fill: 'var(--color-teacher)' },
    { role: 'student', label: t('charts.roleStudent'), value: data.student, fill: 'var(--color-student)' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {t('charts.usersByRole')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
