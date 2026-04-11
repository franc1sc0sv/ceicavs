import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

interface SummaryResultProps {
  summary: string | null
  summarizerAvailable: boolean
  isSummarizing: boolean
}

export function SummaryResult({ summary, summarizerAvailable, isSummarizing }: SummaryResultProps) {
  const { t } = useTranslation('transcription')

  if (!summarizerAvailable) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>{t('summary.notAvailable')}</AlertDescription>
      </Alert>
    )
  }

  if (isSummarizing || !summary) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t('summary.label')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
          {summary}
        </div>
      </CardContent>
    </Card>
  )
}
