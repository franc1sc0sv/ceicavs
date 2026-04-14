import { useTranslation } from 'react-i18next'
import { Pie, PieChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'

interface PostsByStatus {
  published: number
  draft: number
  pending: number
  rejected: number
}

interface PostsDonutChartProps {
  data: PostsByStatus
}

export function PostsDonutChart({ data }: PostsDonutChartProps) {
  const { t } = useTranslation('dashboard')

  const chartConfig = {
    published: { label: t('charts.published'), color: 'var(--chart-1)' },
    draft: { label: t('charts.draft'), color: 'var(--chart-2)' },
    pending: { label: t('charts.pending'), color: '#f59e0b' },
    rejected: { label: t('charts.rejected'), color: 'var(--chart-3)' },
  } satisfies ChartConfig

  const chartData = [
    { status: 'published', value: data.published, fill: 'var(--color-published)' },
    { status: 'draft', value: data.draft, fill: 'var(--color-draft)' },
    { status: 'pending', value: data.pending, fill: '#f59e0b' },
    { status: 'rejected', value: data.rejected, fill: 'var(--color-rejected)' },
  ].filter((d) => d.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {t('charts.postsByStatus')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="status" hideLabel />} />
            <Pie data={chartData} dataKey="value" nameKey="status" innerRadius={55} />
            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
