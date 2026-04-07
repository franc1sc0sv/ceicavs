import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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

interface ActivityItemProps {
  item: ActivityItemData
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function parseMetadata(description: string): Record<string, string> {
  try {
    return JSON.parse(description) as Record<string, string>
  } catch {
    return {}
  }
}

export function ActivityItem({ item }: ActivityItemProps) {
  const { t } = useTranslation('dashboard')

  const metadata = parseMetadata(item.description)
  const typeKey = `activity.types.${item.type}`
  const description = t(typeKey, metadata)

  const date = new Date(item.createdAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  let relativeTime: string
  if (diffMins < 1) relativeTime = t('activity.time.now')
  else if (diffMins < 60) relativeTime = t('activity.time.minutes', { count: diffMins })
  else if (diffHours < 24) relativeTime = t('activity.time.hours', { count: diffHours })
  else relativeTime = t('activity.time.days', { count: diffDays })

  return (
    <li className="flex items-start gap-3 py-3">
      <Avatar className="size-8 shrink-0">
        {item.actorAvatarUrl && (
          <AvatarImage src={item.actorAvatarUrl} alt={item.actorName} />
        )}
        <AvatarFallback className="text-xs">
          {getInitials(item.actorName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">
          <span className="font-medium">{item.actorName}</span>{' '}
          <span className="text-muted-foreground">{description}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {relativeTime}
        </p>
      </div>
    </li>
  )
}
