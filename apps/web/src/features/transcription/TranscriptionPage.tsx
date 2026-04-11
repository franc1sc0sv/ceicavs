import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, CheckCircle2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useMutation } from '@apollo/client/react'
import { graphql } from '@/generated/gql'
import { useSetBreadcrumb } from '@/context/breadcrumb.context'
import { useCloudinaryUpload } from './hooks/use-cloudinary-upload'

const CREATE_RECORDING = graphql(`
  mutation CreateRecording($input: CreateRecordingInput!) {
    createRecording(input: $input) {
      id
      name
      transcriptionStatus
    }
  }
`)
import { useNavigationBlocker } from './hooks/use-navigation-blocker'
import { AudioUploader } from './components/audio-uploader'
import { NavigationBlockDialog } from './components/navigation-block-dialog'

export default function TranscriptionPage() {
  const { t } = useTranslation('transcription')
  const navigate = useNavigate()
  const [createRecording] = useMutation(CREATE_RECORDING)
  const { upload, isUploading, uploadProgress } = useCloudinaryUpload()
  const [isSaving, setIsSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  const isProcessing = isUploading || isSaving
  const blocker = useNavigationBlocker(isProcessing)

  useSetBreadcrumb([
    { label: t('listPage.title'), to: '/transcription' },
    { label: t('page.title') },
  ])

  const handleAudioReady = useCallback(
    async (audio: Float32Array, file: File, name: string) => {
      try {
        setIsSaving(true)
        const duration = Math.round(audio.length / 16000)
        const { publicId, url } = await upload(file)
        const result = await createRecording({ variables: { input: { name, duration, audioUrl: url, cloudinaryPublicId: publicId } } })
        const id = result.data?.createRecording?.id
        if (id) setSavedId(id)
      } finally {
        setIsSaving(false)
      }
    },
    [upload, createRecording],
  )

  const handleReset = useCallback(() => {
    setSavedId(null)
  }, [])

  if (savedId) {
    return (
      <main className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit -ml-2 text-muted-foreground"
            onClick={() => navigate('/transcription')}
          >
            <ArrowLeft className="size-4" />
            {t('listPage.title')}
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-6 pt-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="size-5 text-emerald-500" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{t('success.title')}</h2>
                <p className="text-sm text-muted-foreground">{t('success.description')}</p>
              </div>
            </div>

            <ol className="flex flex-col gap-2 border-l-2 border-border pl-4">
              {([
                t('success.step1'),
                t('success.step2'),
                t('success.step3'),
              ] as string[]).map((step, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1" onClick={() => navigate(`/transcription/${savedId}`)}>
                {t('success.cta')}
                <ChevronRight className="size-4" />
              </Button>
              <Button variant="outline" onClick={handleReset}>
                {t('success.another')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2 text-muted-foreground"
          onClick={() => navigate('/transcription')}
          disabled={isProcessing}
        >
          <ArrowLeft className="size-4" />
          {t('listPage.title')}
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t('page.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('page.description')}</p>
      </div>

      <AudioUploader onAudioReady={handleAudioReady} disabled={isProcessing} />

      {isUploading && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('upload.uploading')}
          </div>
          <Progress value={uploadProgress} className="h-1.5" />
        </div>
      )}

      {isSaving && !isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('upload.saving')}
        </div>
      )}

      <NavigationBlockDialog
        open={blocker.state === 'blocked'}
        onLeave={() => blocker.proceed?.()}
        onStay={() => blocker.reset?.()}
      />
    </main>
  )
}
