import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Copy, Check, Info } from 'lucide-react'
import { useTextSimplifier } from '../../hooks/use-text-simplifier'

type Tone = 'as-is' | 'more-casual' | 'more-formal'

const TONES: { value: Tone; labelKey: string }[] = [
  { value: 'as-is', labelKey: 'textSimplifier.toneSimple' },
  { value: 'more-formal', labelKey: 'textSimplifier.toneFormal' },
  { value: 'more-casual', labelKey: 'textSimplifier.toneCasual' },
]

export function TextSimplifier() {
  const { t } = useTranslation('tools')
  const [inputText, setInputText] = useState('')
  const [tone, setTone] = useState<Tone>('as-is')
  const [copied, setCopied] = useState(false)
  const { simplify, result, isSimplifying, isAvailable } = useTextSimplifier()

  const handleSimplify = useCallback(() => {
    if (!inputText.trim()) return
    void simplify(inputText, tone)
  }, [inputText, tone, simplify])

  const handleCopy = useCallback(async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result])

  if (!isAvailable) {
    return (
      <div className="p-4 max-w-2xl mx-auto w-full">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{t('textSimplifier.notAvailable')}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">{t('textSimplifier.inputLabel')}</label>
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('textSimplifier.inputPlaceholder')}
          className="min-h-36 resize-none"
          disabled={isSimplifying}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">{t('textSimplifier.toneLabel')}</label>
        <div className="flex gap-2">
          {TONES.map(({ value, labelKey }) => (
            <Button
              key={value}
              variant={tone === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTone(value)}
              disabled={isSimplifying}
            >
              {t(labelKey)}
            </Button>
          ))}
        </div>
      </div>

      <Button onClick={handleSimplify} disabled={isSimplifying || !inputText.trim()}>
        {isSimplifying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {t('textSimplifier.processing')}
          </>
        ) : (
          t('textSimplifier.simplify')
        )}
      </Button>

      {result && (
        <Card>
          <CardContent className="pt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('textSimplifier.resultLabel')}</span>
              <Button variant="ghost" size="sm" onClick={() => void handleCopy()}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1">{copied ? t('textSimplifier.copied') : t('textSimplifier.copy')}</span>
              </Button>
            </div>
            <Textarea value={result} readOnly className="min-h-36 resize-none bg-muted/30" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
