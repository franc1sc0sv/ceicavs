import { Progress } from '@/components/ui/progress'
import { useTranslation } from 'react-i18next'

interface ModelDownloadProgressProps {
  loaded: number
  total: number
  status: string
}

export function ModelDownloadProgress({ loaded, total, status }: ModelDownloadProgressProps) {
  const { t } = useTranslation('common')

  if (status === 'done' || status === 'ready') return null

  const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-sm text-muted-foreground">
        {t('modelDownload.label', { percentage })}
      </p>
      <Progress value={percentage} />
    </div>
  )
}
