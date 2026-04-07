import { useNavigate } from 'react-router-dom'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Can } from '@/context/ability.context'
import { type Action, type Subject } from '@ceicavs/shared'

interface QuickActionProps {
  icon: LucideIcon
  labelKey: string
  href: string
  permission?: { action: Action; subject: Subject }
}

function QuickActionButton({ icon: Icon, labelKey, href }: Omit<QuickActionProps, 'permission'>) {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()

  return (
    <Button
      variant="outline"
      className="justify-start gap-3 h-auto py-3 w-full"
      onClick={() => navigate(href)}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="flex-1 text-left">{t(labelKey)}</span>
      <ArrowRight className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
    </Button>
  )
}

export function QuickAction({ icon, labelKey, href, permission }: QuickActionProps) {
  if (permission) {
    return (
      <Can I={permission.action} a={permission.subject}>
        <QuickActionButton icon={icon} labelKey={labelKey} href={href} />
      </Can>
    )
  }
  return <QuickActionButton icon={icon} labelKey={labelKey} href={href} />
}
