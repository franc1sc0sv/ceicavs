import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface TrendData {
  direction: 'up' | 'down' | 'same'
  percentage: number
}

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  href?: string
  trend?: TrendData
}

export function StatCard({ icon: Icon, label, value, href, trend }: StatCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      className={href ? 'cursor-pointer transition-colors hover:bg-accent/50' : undefined}
      onClick={href ? () => navigate(href) : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        {trend && trend.direction !== 'same' && (
          <Badge
            variant="outline"
            className={
              trend.direction === 'up'
                ? 'text-green-600 border-green-200 dark:text-green-400 dark:border-green-800'
                : 'text-red-600 border-red-200 dark:text-red-400 dark:border-red-800'
            }
          >
            {trend.direction === 'up' ? (
              <ArrowUpRight className="size-3 mr-0.5" aria-hidden="true" />
            ) : (
              <ArrowDownRight className="size-3 mr-0.5" aria-hidden="true" />
            )}
            {trend.percentage}%
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

export function computeTrend(current: number, previous: number): TrendData {
  if (previous === 0) {
    return { direction: 'same', percentage: 0 }
  }
  const diff = current - previous
  const percentage = Math.abs(Math.round((diff / previous) * 100))
  if (diff > 0) return { direction: 'up', percentage }
  if (diff < 0) return { direction: 'down', percentage }
  return { direction: 'same', percentage: 0 }
}
