import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import BarLoader from 'react-spinners/BarLoader'
import BeatLoader from 'react-spinners/BeatLoader'
import ScaleLoader from 'react-spinners/ScaleLoader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { getApiBase, getAuthHeaders } from '@/lib/api-client'

type VideoQuality = '1080p' | '720p' | '480p' | 'audio'
type ViewState = 'idle' | 'loading-info' | 'ready' | 'downloading'

interface VideoPreview {
  title: string
  thumbnail: string
  durationSeconds: number
}

interface QualityOption {
  value: VideoQuality
  label: string
  sub: string
}

const QUALITY_OPTIONS: QualityOption[] = [
  { value: '1080p', label: '1080p', sub: 'Full HD' },
  { value: '720p', label: '720p', sub: 'HD' },
  { value: '480p', label: '480p', sub: 'SD' },
  { value: 'audio', label: 'MP3', sub: 'Audio only' },
]

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const mm = m.toString().padStart(2, '0')
  const ss = s.toString().padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export function YoutubeDownloader() {
  const { t } = useTranslation('tools')
  const [url, setUrl] = useState('')
  const [viewState, setViewState] = useState<ViewState>('idle')
  const [preview, setPreview] = useState<VideoPreview | null>(null)
  const [quality, setQuality] = useState<VideoQuality>('720p')
  const [error, setError] = useState<string | null>(null)

  async function handleLookup() {
    if (!url.trim()) return
    setViewState('loading-info')
    setError(null)
    setPreview(null)

    try {
      const res = await fetch(
        `${getApiBase()}/tools/youtube/info?url=${encodeURIComponent(url)}`,
        { headers: getAuthHeaders() },
      )
      if (!res.ok) {
        setError(t('youtubeDownloader.errorInfo'))
        setViewState('idle')
        return
      }
      const data = await res.json() as VideoPreview
      setPreview(data)
      setViewState('ready')
    } catch {
      setError(t('youtubeDownloader.errorInfo'))
      setViewState('idle')
    }
  }

  async function handleDownload() {
    if (!preview) return
    setViewState('downloading')
    setError(null)

    try {
      const res = await fetch(`${getApiBase()}/tools/youtube/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ url, quality }),
      })

      if (res.status === 503) {
        setError(t('youtubeDownloader.errorBusy'))
        setViewState('ready')
        return
      }
      if (!res.ok) {
        setError(t('youtubeDownloader.error'))
        setViewState('ready')
        return
      }

      const blob = await res.blob()
      const ext = quality === 'audio' ? 'mp3' : 'mp4'
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `${preview.title}.${ext}`
      link.click()
      URL.revokeObjectURL(objectUrl)
      setViewState('ready')
    } catch {
      setError(t('youtubeDownloader.error'))
      setViewState('ready')
    }
  }

  function handleReset() {
    setUrl('')
    setPreview(null)
    setViewState('idle')
    setError(null)
  }

  const isLoadingInfo = viewState === 'loading-info'
  const isDownloading = viewState === 'downloading'

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('youtubeDownloader.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="yt-url" className="sr-only">
              {t('youtubeDownloader.urlLabel')}
            </Label>
            <Input
              id="yt-url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (preview) handleReset()
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLookup() }}
              placeholder={t('youtubeDownloader.urlPlaceholder')}
              disabled={isLoadingInfo || isDownloading}
            />
          </div>
          <Button
            onClick={handleLookup}
            disabled={url.trim().length === 0 || isLoadingInfo || isDownloading}
            variant="secondary"
            className="min-w-[90px]"
          >
            {isLoadingInfo
              ? <BeatLoader size={6} color="currentColor" />
              : t('youtubeDownloader.lookup')}
          </Button>
        </div>

        {preview !== null && (
          <>
            <div className="flex gap-4 rounded-lg border p-3">
              {preview.thumbnail && (
                <img
                  src={preview.thumbnail}
                  alt=""
                  className="w-28 shrink-0 rounded object-cover aspect-video"
                />
              )}
              <div className="flex min-w-0 flex-col justify-center gap-1">
                <p className="line-clamp-2 text-sm font-medium leading-tight">
                  {preview.title}
                </p>
                {preview.durationSeconds > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(preview.durationSeconds)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('youtubeDownloader.qualityLabel')}</Label>
              <div className="grid grid-cols-4 gap-2">
                {QUALITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setQuality(opt.value)}
                    disabled={isDownloading}
                    className={[
                      'flex flex-col items-center gap-0.5 rounded-lg border-2 py-3 px-2 transition-colors',
                      quality === opt.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/40',
                    ].join(' ')}
                  >
                    <span className="text-sm font-semibold">{opt.label}</span>
                    <span className="text-[11px] text-muted-foreground">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {error !== null && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {isDownloading ? (
              <div className="flex flex-col items-center gap-3 py-2">
                <ScaleLoader color="var(--primary)" height={28} />
                <BarLoader
                  width="100%"
                  cssOverride={{ borderRadius: '9999px' }}
                  color="var(--primary)"
                />
              </div>
            ) : (
              <Button onClick={handleDownload} className="w-full">
                {t('youtubeDownloader.download')}
              </Button>
            )}
          </>
        )}

        {error !== null && viewState === 'idle' && (
          <p className="text-sm text-destructive">{error}</p>
        )}

      </CardContent>
    </Card>
  )
}
