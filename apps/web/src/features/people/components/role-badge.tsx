import { useTranslation } from 'react-i18next'
import { UserRole } from '@ceicavs/shared'

interface RoleBadgeProps {
  role: string
}

const ROLE_CLASSES: Record<string, string> = {
  [UserRole.ADMIN]: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  [UserRole.TEACHER]: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  [UserRole.STUDENT]: 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300',
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const { t } = useTranslation('common')
  const classes = ROLE_CLASSES[role] ?? ROLE_CLASSES[UserRole.STUDENT]

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${classes}`}>
      {t(`roles.${role}`)}
    </span>
  )
}
