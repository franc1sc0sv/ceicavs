import { useNavigate } from 'react-router-dom'
import { type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  href?: string
}

export function StatCard({ icon: Icon, label, value, href }: StatCardProps) {
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
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
