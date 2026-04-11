import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Check } from 'lucide-react'

interface TranscriptionResultProps {
  transcript: string
}

export function TranscriptionResult({ transcript }: TranscriptionResultProps) {
  const { t } = useTranslation('transcription')
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(transcript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [transcript])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{t('transcript.label')}</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => void handleCopy()}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="ml-1">{copied ? t('transcript.copied') : t('transcript.copy')}</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Textarea
          value={transcript}
          readOnly
          className="min-h-32 resize-none bg-muted/30"
        />
      </CardContent>
    </Card>
  )
}
