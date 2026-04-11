import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ComingSoon() {
  const { t } = useTranslation('tools')

  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Clock className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{t('comingSoon')}</h2>
        <p className="max-w-xs text-sm text-muted-foreground">{t('comingSoonDescription')}</p>
      </div>
    </div>
  )
}
