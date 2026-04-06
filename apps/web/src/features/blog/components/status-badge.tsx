import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

type PostStatus = 'published' | 'draft' | 'rejected'

interface StatusBadgeProps {
  status: PostStatus
}

const STATUS_CLASSES: Record<PostStatus, string> = {
  published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  draft: 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation('blog')

  return (
    <Badge className={`${STATUS_CLASSES[status]} border-0 font-semibold`}>
      {t(`status.${status}`)}
    </Badge>
  )
}
