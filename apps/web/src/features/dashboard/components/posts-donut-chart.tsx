import { useTranslation } from 'react-i18next'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PostsByStatus {
  published: number
  draft: number
  rejected: number
}

interface PostsDonutChartProps {
  data: PostsByStatus
}

const STATUS_COLORS = {
  published: '#22c55e',
  draft: '#f59e0b',
  rejected: '#ef4444',
}

export function PostsDonutChart({ data }: PostsDonutChartProps) {
  const { t } = useTranslation('dashboard')

  const chartData = [
    { key: 'published', value: data.published, label: t('charts.published') },
    { key: 'draft', value: data.draft, label: t('charts.draft') },
    { key: 'rejected', value: data.rejected, label: t('charts.rejected') },
  ].filter((item) => item.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {t('charts.postsByStatus')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={STATUS_COLORS[entry.key as keyof typeof STATUS_COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
