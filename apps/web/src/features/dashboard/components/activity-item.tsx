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

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'ahora'
  if (diffMins < 60) return `hace ${diffMins}m`
  if (diffHours < 24) return `hace ${diffHours}h`
  return `hace ${diffDays}d`
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function ActivityItem({ item }: ActivityItemProps) {
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
          <span className="text-muted-foreground">{item.description}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatRelativeTime(item.createdAt)}
        </p>
      </div>
    </li>
  )
}
