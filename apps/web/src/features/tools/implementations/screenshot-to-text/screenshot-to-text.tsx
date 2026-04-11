import { useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Upload, Copy, Check } from 'lucide-react'
import { useImageOcr } from '../../hooks/use-image-ocr'
import { ModelDownloadProgress } from '@/components/model-download-progress'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export function ScreenshotToText() {
  const { t } = useTranslation('tools')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const { extractedText, isProcessing, downloadProgress, error, extractText, reset } = useImageOcr()

  const handleFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    reset()
  }, [reset])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleExtract = useCallback(() => {
    if (preview) extractText(preview)
  }, [preview, extractText])

  const handleCopy = useCallback(async () => {
    if (!extractedText) return
    await navigator.clipboard.writeText(extractedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [extractedText])

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
      <Card
        className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed transition-colors cursor-pointer ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-48 rounded object-contain" />
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t('screenshotToText.dropzone')}</p>
            <p className="text-xs text-muted-foreground">{t('screenshotToText.formats')}</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </Card>

      {preview && !isProcessing && !extractedText && (
        <Button onClick={handleExtract} disabled={isProcessing}>
          {t('screenshotToText.extract')}
        </Button>
      )}

      {error && (
        <p className="text-sm text-destructive">{t('screenshotToText.error')}</p>
      )}

      {isProcessing && (
        <div className="flex flex-col gap-3">
          {downloadProgress && downloadProgress.status !== 'done' ? (
            <ModelDownloadProgress
              loaded={downloadProgress.loaded}
              total={downloadProgress.total}
              status={downloadProgress.status}
            />
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('screenshotToText.processing')}
            </div>
          )}
        </div>
      )}

      {extractedText && (
        <Card>
          <CardContent className="pt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('screenshotToText.extractedText')}</span>
              <Button variant="ghost" size="sm" onClick={() => void handleCopy()}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1">{copied ? t('screenshotToText.copied') : t('screenshotToText.copy')}</span>
              </Button>
            </div>
            <Textarea value={extractedText} readOnly className="min-h-32 resize-none bg-muted/30" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
