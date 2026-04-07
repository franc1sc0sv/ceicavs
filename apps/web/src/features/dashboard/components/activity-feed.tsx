import { useTranslation } from 'react-i18next'
import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ActivityItem } from './activity-item'

interface ActivityItemData {
  id: string
  type: string
  description: string
  actorName: string
  actorAvatarUrl?: string | null
  actorRole: string
  entityId?: string | null
  entityType?: string | null
  createdAt: string
}

interface ActivityFeedProps {
  activities: ActivityItemData[]
  loading: boolean
}

export function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  const { t } = useTranslation('dashboard')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {t('sections.activity')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <ul className="space-y-3" aria-busy="true" aria-label={t('sections.activity')}>
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="flex items-start gap-3 py-3">
                <Skeleton className="size-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </li>
            ))}
          </ul>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="size-8 text-muted-foreground mb-2" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">{t('activity.empty')}</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {activities.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
