import { useTranslation } from 'react-i18next'
import { UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BulkToolbarProps {
  selectedCount: number
  onDeactivate: () => void
  loading: boolean
}

export function BulkToolbar({ selectedCount, onDeactivate, loading }: BulkToolbarProps) {
  const { t } = useTranslation('people')

  if (selectedCount === 0) return null

  return (
    <div
      role="toolbar"
      aria-label={t('bulk.selected', { count: selectedCount })}
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 flex items-center gap-3 rounded-xl bg-background px-4 py-3 shadow-xl ring-1 ring-foreground/10"
    >
      <span className="text-sm font-medium text-foreground">
        {t('bulk.selected', { count: selectedCount })}
      </span>
      <div className="h-4 w-px bg-border" />
      <Button
        variant="destructive"
        size="sm"
        disabled={loading}
        onClick={onDeactivate}
        className="gap-1.5"
      >
        <UserX className="size-3.5" />
        {t('bulk.deactivate')}
      </Button>
    </div>
  )
}
