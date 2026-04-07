import { useTranslation } from 'react-i18next'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UsersByRole {
  admin: number
  teacher: number
  student: number
}

interface UsersBarChartProps {
  data: UsersByRole
}

const ROLE_COLORS = {
  admin: '#4f46e5',
  teacher: '#10b981',
  student: '#0ea5e9',
}

export function UsersBarChart({ data }: UsersBarChartProps) {
  const { t } = useTranslation('dashboard')

  const chartData = [
    { role: t('charts.roleAdmin'), key: 'admin', value: data.admin },
    { role: t('charts.roleTeacher'), key: 'teacher', value: data.teacher },
    { role: t('charts.roleStudent'), key: 'student', value: data.student },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {t('charts.usersByRole')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="role"
              tick={{ fontSize: 12 }}
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
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={ROLE_COLORS[entry.key as keyof typeof ROLE_COLORS]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
