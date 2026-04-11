import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getApiBase, getAuthHeaders } from '@/lib/api-client'

type ConvertDirection = 'word-to-pdf' | 'pdf-to-word'

function acceptedExtension(direction: ConvertDirection): string {
  return direction === 'word-to-pdf' ? '.docx' : '.pdf'
}

export function WordPdfConverter() {
  const { t } = useTranslation('tools')
  const [file, setFile] = useState<File | null>(null)
  const [direction, setDirection] = useState<ConvertDirection>('word-to-pdf')
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (incoming: File) => {
      setFile(incoming)
      setError(null)
    },
    [],
  )

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) processFile(dropped)
  }

  async function handleConvert() {
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(
        `${getApiBase()}/tools/convert?direction=${direction}`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData,
        },
      )

      if (!res.ok) {
        setError(t('wordPdfConverter.error'))
        return
      }

      const blob = await res.blob()
      const ext = direction === 'word-to-pdf' ? 'pdf' : 'docx'
      const baseName = file.name.replace(/\.[^.]+$/, '')
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `${baseName}.${ext}`
      link.click()
      URL.revokeObjectURL(objectUrl)
    } catch {
      setError(t('wordPdfConverter.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('wordPdfConverter.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('wordPdfConverter.directionLabel')}</Label>
          <Select
            value={direction}
            onValueChange={(v) => {
              setDirection(v as ConvertDirection)
              setFile(null)
              setError(null)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="word-to-pdf">{t('wordPdfConverter.wordToPdf')}</SelectItem>
              <SelectItem value="pdf-to-word">{t('wordPdfConverter.pdfToWord')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label={t('wordPdfConverter.dropzone')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click() }}
        >
          {file ? (
            <p className="text-sm font-medium">{file.name}</p>
          ) : (
            <p className="text-muted-foreground text-sm">{t('wordPdfConverter.dropzone')}</p>
          )}
          <input
            ref={fileRef}
            type="file"
            accept={acceptedExtension(direction)}
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f) }}
          />
        </div>

        {direction === 'pdf-to-word' && (
          <p className="text-xs text-muted-foreground">
            {t('wordPdfConverter.limitedFidelity')}
          </p>
        )}

        {error !== null && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button
          onClick={handleConvert}
          disabled={file === null || loading}
          className="w-full"
        >
          {loading ? t('wordPdfConverter.converting') : t('wordPdfConverter.convert')}
        </Button>
      </CardContent>
    </Card>
  )
}
