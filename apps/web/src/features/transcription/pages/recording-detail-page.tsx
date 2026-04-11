import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Loader2,
  FileText,
  Download,
  Mic,
  Sparkles,
  Clock,
  CalendarDays,
  AlertCircle,
  Settings2,
} from 'lucide-react'
import { Can } from '@/context/ability.context'
import { Action, Subject } from '@ceicavs/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useQuery, useMutation } from '@apollo/client/react'
import { graphql } from '@/generated/gql'
import { useWhisperTranscription } from '../hooks/use-whisper-transcription'
import { useNavigationBlocker } from '../hooks/use-navigation-blocker'
import { useAudioPlayer } from '../hooks/use-audio-player'
import { NavigationBlockDialog } from '../components/navigation-block-dialog'
import { AudioPlayer } from '../components/audio-player'
import { useSetBreadcrumb } from '@/context/breadcrumb.context'
import { formatTimestamp, parseSegments, getActiveSegmentIndex } from '../utils'

const UPDATE_TRANSCRIPTION = graphql(`
  mutation UpdateTranscription($input: UpdateTranscriptionInput!) {
    updateTranscription(input: $input)
  }
`)

const GENERATE_SUMMARY = graphql(`
  mutation GenerateSummary($input: GenerateSummaryInput!) {
    generateSummary(input: $input)
  }
`)

const GET_SUMMARY_PROMPT = graphql(`
  query GetSummaryPrompt {
    getSummaryPrompt
  }
`)

const GET_RECORDING_DETAIL = graphql(`
  query GetRecordingDetail($input: GetRecordingInput!) {
    getRecording(input: $input) {
      id
      name
      duration
      audioUrl
      transcriptionStatus
      createdAt
      transcription {
        status
        summaryStatus
        summaryError
        fullTranscript
        segments
        summary
        keyTakeaways
        actionItems
        completedAt
      }
    }
  }
`)

export function downloadTxt(name: string, createdAt: string, duration: number, transcript: string, durationLabel: string): void {
  const date = format(new Date(createdAt), 'dd/MM/yyyy')
  const content = `${name}\n${date} — ${durationLabel}: ${formatTimestamp(duration)}\n\n${transcript}`
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

interface LanguageSelectProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

function LanguageSelect({ value, onValueChange, className }: LanguageSelectProps) {
  const { t } = useTranslation('transcription')
  return (
    <Select value={value} onValueChange={(v) => { if (v) onValueChange(v) }}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="spanish">{t('languages.spanish')}</SelectItem>
        <SelectItem value="english">{t('languages.english')}</SelectItem>
        <SelectItem value="portuguese">{t('languages.portuguese')}</SelectItem>
        <SelectItem value="french">{t('languages.french')}</SelectItem>
        <SelectItem value="german">{t('languages.german')}</SelectItem>
        <SelectItem value="italian">{t('languages.italian')}</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default function RecordingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('transcription')
  const navigate = useNavigate()

  const { data: promptData } = useQuery(GET_SUMMARY_PROMPT)

  const { data, loading, refetch, startPolling, stopPolling } = useQuery(GET_RECORDING_DETAIL, {
    variables: { input: { id: id ?? '' } },
    skip: !id,
  })

  const recording = data?.getRecording ?? null
  const transcription = recording?.transcription ?? null
  const summaryStatus = transcription?.summaryStatus ?? null

  const [summaryWasGeneratingThisSession, setSummaryWasGeneratingThisSession] = useState(false)

  useEffect(() => {
    if (summaryStatus === 'generating') {
      setSummaryWasGeneratingThisSession(true)
    }
  }, [summaryStatus])

  useEffect(() => {
    const isTranscriptionProcessing = recording?.transcriptionStatus === 'processing'
    const isSummarizing = summaryStatus === 'generating'
    if (isTranscriptionProcessing || isSummarizing) {
      startPolling(3000)
    } else {
      stopPolling()
    }
  }, [recording?.transcriptionStatus, summaryStatus, startPolling, stopPolling])

  const { transcribe, transcript, segments: transcribedSegments, isTranscribing, downloadProgress } = useWhisperTranscription()
  const [updateTranscription] = useMutation(UPDATE_TRANSCRIPTION)
  const [generateSummaryMutation, { loading: isGeneratingSummary }] = useMutation(GENERATE_SUMMARY, {
    onCompleted: () => {
      void refetch()
      toast.success(t('detail.summarySaved'))
    },
    onError: () => {
      toast.error(t('detail.saveError'))
    },
  })

  const player = useAudioPlayer(recording?.audioUrl ?? null)
  const activeSegmentRef = useRef<HTMLLIElement | null>(null)

  const [isFetchingAudio, setIsFetchingAudio] = useState(false)
  const [isSavingTranscript, setIsSavingTranscript] = useState(false)
  const [language, setLanguage] = useState('spanish')
  const [activeTab, setActiveTab] = useState('transcript')
  const [promptValue, setPromptValue] = useState('')
  const [promptSheetOpen, setPromptSheetOpen] = useState(false)

  const isProcessing = isTranscribing || isSavingTranscript || isFetchingAudio
  const blocker = useNavigationBlocker(isProcessing)

  useSetBreadcrumb([
    { label: t('listPage.title'), to: '/transcription' },
    { label: recording?.name ?? '' },
  ])

  useEffect(() => {
    if (promptData?.getSummaryPrompt) {
      setPromptValue(promptData.getSummaryPrompt)
    }
  }, [promptData])

  useEffect(() => {
    if (!transcript || isSavingTranscript) return

    const save = async () => {
      setIsSavingTranscript(true)
      try {
        await updateTranscription({
          variables: {
            input: {
              recordingId: id ?? '',
              fullTranscript: transcript,
              segments: transcribedSegments ?? '[]',
              summary: null,
            },
          },
        })
        await refetch()
        toast.success(t('detail.transcriptSaved'))
      } catch {
        toast.error(t('detail.saveError'))
      } finally {
        setIsSavingTranscript(false)
      }
    }

    void save()
  }, [transcript])

  const segments = parseSegments(transcription?.segments)
  const activeSegmentIndex = segments ? getActiveSegmentIndex(segments, player.currentTime) : -1

  useEffect(() => {
    if (player.isPlaying && activeSegmentRef.current) {
      activeSegmentRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeSegmentIndex, player.isPlaying])

  const handleGenerateTranscription = async () => {
    if (!recording?.audioUrl) return
    try {
      setIsFetchingAudio(true)
      const response = await fetch(recording.audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioContext = new AudioContext({ sampleRate: 16000 })
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const float32 = audioBuffer.getChannelData(0)
      setIsFetchingAudio(false)
      transcribe(float32, language)
    } catch {
      setIsFetchingAudio(false)
      toast.error(t('detail.fetchAudioError'))
    }
  }

  if (loading && !recording) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (!recording) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate('/transcription')} className="self-start -ml-2">
          <ArrowLeft className="size-4" />
          {t('detail.back')}
        </Button>
        <div className="flex items-center gap-3 text-muted-foreground">
          <AlertCircle className="size-5" />
          <p className="text-sm">{t('detail.notFound')}</p>
        </div>
      </div>
    )
  }

  const isCompleted = recording.transcriptionStatus === 'completed'
  const isNone = recording.transcriptionStatus === 'none'
  const statusKey = recording.transcriptionStatus as 'none' | 'processing' | 'completed'

  const overallPercent =
    downloadProgress && downloadProgress.total > 0
      ? Math.round((downloadProgress.loaded / downloadProgress.total) * 100)
      : 0

  const isDownloading =
    isTranscribing &&
    downloadProgress !== null &&
    downloadProgress.status !== 'done' &&
    downloadProgress.status !== 'ready' &&
    downloadProgress.total > 0

  const isInferring = isTranscribing && !isDownloading

  return (
    <div className="flex flex-col overflow-hidden h-[calc(100dvh-7rem)] md:h-[calc(100dvh-8rem)]">
    <div className="flex-1 flex flex-col gap-6 p-6 max-w-3xl mx-auto w-full min-h-0">
      <NavigationBlockDialog
        open={blocker.state === 'blocked'}
        onLeave={() => blocker.proceed?.()}
        onStay={() => blocker.reset?.()}
      />

      <Button
        variant="ghost"
        size="sm"
        className="self-start -ml-2 text-muted-foreground"
        onClick={() => navigate('/transcription')}
        disabled={isProcessing}
      >
        <ArrowLeft className="size-4" />
        {t('listPage.title')}
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{recording.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              {format(new Date(recording.createdAt as string), 'dd/MM/yyyy')}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {formatTimestamp(recording.duration)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant={isCompleted ? 'default' : isNone ? 'secondary' : 'outline'}
              className={isCompleted ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400' : ''}
            >
              {t(`status.${statusKey}`)}
            </Badge>
          </div>
        </div>

        {isCompleted && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() =>
              downloadTxt(
                recording.name,
                recording.createdAt as string,
                recording.duration,
                transcription?.fullTranscript ?? '',
                t('detail.durationLabel'),
              )
            }
          >
            <Download className="size-3.5" />
            {t('detail.exportTxt')}
          </Button>
        )}
      </div>

      <Separator />

      {isNone && !isProcessing && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Mic className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium">{t('detail.noTranscriptTitle')}</p>
              <p className="text-sm text-muted-foreground max-w-xs">{t('detail.noTranscriptDescription')}</p>
            </div>
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <div className="flex items-center gap-2 w-full">
                <span className="text-sm text-muted-foreground shrink-0">{t('detail.languageLabel')}</span>
                <LanguageSelect value={language} onValueChange={setLanguage} className="flex-1" />
              </div>
              <Can I={Action.TRANSCRIBE} a={Subject.RECORDING}>
                <Button onClick={() => void handleGenerateTranscription()} disabled={!recording.audioUrl} className="w-full">
                  <Mic className="size-4" />
                  {t('detail.generateTranscription')}
                </Button>
              </Can>
            </div>
          </CardContent>
        </Card>
      )}

      {isFetchingAudio && (
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Loader2 className="size-4 animate-spin shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t('detail.fetchingAudio')}</p>
          </CardContent>
        </Card>
      )}

      {isDownloading && (
        <Card>
          <CardContent className="flex flex-col gap-3 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin shrink-0 text-primary" />
                <p className="text-sm font-medium">{t('detail.downloadingModel')}</p>
              </div>
              <span className="text-sm tabular-nums text-muted-foreground">{overallPercent}%</span>
            </div>
            <Progress value={overallPercent} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {t('detail.downloadingModelHint')}
            </p>
          </CardContent>
        </Card>
      )}

      {isInferring && (
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="relative">
              <Loader2 className="size-4 animate-spin text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">{t('detail.transcribing')}</p>
              <p className="text-xs text-muted-foreground">{t('detail.transcribingHint')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {isSavingTranscript && (
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Loader2 className="size-4 animate-spin shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t('detail.savingTranscript')}</p>
          </CardContent>
        </Card>
      )}

      {isCompleted && transcription && (
        <>
          <Sheet open={promptSheetOpen} onOpenChange={setPromptSheetOpen}>
            <SheetContent side="right" className="sm:max-w-lg flex flex-col gap-0 p-0">
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle>{t('prompt.customize')}</SheetTitle>
                <SheetDescription>{t('prompt.hint')}</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-2 flex-1 p-6">
                <Label className="text-xs font-medium text-muted-foreground">{t('prompt.label')}</Label>
                <Textarea
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  className="flex-1 resize-none font-mono text-xs min-h-0"
                  style={{ height: '100%' }}
                />
              </div>
              <SheetFooter className="px-6 pb-6 pt-0 flex-row justify-between">
                <Button variant="outline" onClick={() => setPromptValue(promptData?.getSummaryPrompt ?? '')}>
                  {t('prompt.resetToDefault')}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between gap-2">
            <TabsList>
              <TabsTrigger value="transcript">
                <FileText className="size-3.5" />
                {t('detail.transcript')}
              </TabsTrigger>
              <TabsTrigger value="summary">
                <Sparkles className="size-3.5" />
                {t('detail.summary')}
              </TabsTrigger>
            </TabsList>

            {!isProcessing && activeTab === 'transcript' && (
              <Can I={Action.TRANSCRIBE} a={Subject.RECORDING}>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('detail.languageLabel')}</span>
                  <LanguageSelect value={language} onValueChange={setLanguage} className="w-36" />
                  <Button variant="outline" size="sm" onClick={() => void handleGenerateTranscription()} disabled={!recording.audioUrl}>
                    <Mic className="size-3.5" />
                    {t('detail.regenerateTranscription')}
                  </Button>
                </div>
              </Can>
            )}

            {!isProcessing && activeTab === 'summary' && (
              <Can I={Action.TRANSCRIBE} a={Subject.RECORDING}>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPromptSheetOpen(true)}
                  >
                    <Settings2 className="size-3.5" />
                    {t('prompt.customize')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void generateSummaryMutation({ variables: { input: { recordingId: id ?? '', prompt: promptValue || null } } })}
                    disabled={isGeneratingSummary}
                  >
                    <Sparkles className="size-3.5" />
                    {t('detail.regenerateSummary')}
                  </Button>
                </div>
              </Can>
            )}
          </div>

          <TabsContent value="transcript" className="mt-4 flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col min-h-0">
              <CardContent className="pt-5 flex-1 min-h-0">
                <ScrollArea className="h-full">
                  {segments ? (
                    <ul className="flex flex-col gap-1 pr-4">
                      {segments.map((seg, i) => {
                        const isActive = i === activeSegmentIndex
                        return (
                          <li
                            key={i}
                            ref={isActive ? activeSegmentRef : null}
                            className={`flex items-start gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${isActive ? 'bg-primary/10' : ''}`}
                          >
                            <button
                              type="button"
                              onClick={() => player.seekTo(seg.start)}
                              className={`font-mono text-xs px-1.5 py-0.5 rounded shrink-0 mt-0.5 tabular-nums transition-colors hover:bg-primary hover:text-primary-foreground ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                            >
                              {formatTimestamp(seg.start)}
                            </button>
                            <span className={`leading-relaxed ${isActive ? 'font-medium' : ''}`}>
                              {seg.text}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  ) : transcription.fullTranscript ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap pr-4">
                      {transcription.fullTranscript}
                    </p>
                  ) : null}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="mt-4 flex-1 flex flex-col min-h-0">
            <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 pr-4 pb-4">
            {summaryStatus === 'failed' && summaryWasGeneratingThisSession && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
                <AlertCircle className="size-4 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">
                  {t(`summary.error.${transcription?.summaryError ?? 'unknown'}`, { defaultValue: t('summary.error.unknown') })}
                </p>
              </div>
            )}
            {isGeneratingSummary || summaryStatus === 'generating' ? (
              <Card>
                <CardContent className="flex items-center gap-3 py-4">
                  <Loader2 className="size-4 animate-spin shrink-0 text-primary" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">{t('summary.generating')}</p>
                    <p className="text-xs text-muted-foreground">{t('detail.generatingSummaryHint')}</p>
                  </div>
                </CardContent>
              </Card>
            ) : transcription.summary ? (
              <div className="flex flex-col gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {t('detail.summaryLabel')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{transcription.summary}</p>
                  </CardContent>
                </Card>

                {transcription.keyTakeaways.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {t('detail.keyTakeaways')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="flex flex-col gap-2">
                        {transcription.keyTakeaways.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {transcription.actionItems.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {t('detail.actionItems')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="flex flex-col gap-2">
                        {transcription.actionItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold mt-0.5">
                              {i + 1}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <Sparkles className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{t('detail.noSummaryTitle')}</p>
                    <p className="text-sm text-muted-foreground max-w-xs">{t('detail.noSummaryDescription')}</p>
                  </div>
                  <Can I={Action.TRANSCRIBE} a={Subject.RECORDING}>
                    <Button
                      onClick={() => void generateSummaryMutation({ variables: { input: { recordingId: id ?? '', prompt: promptValue || null } } })}
                      disabled={isGeneratingSummary}
                    >
                      <Sparkles className="size-4" />
                      {t('detail.generateSummary')}
                    </Button>
                  </Can>
                </CardContent>
              </Card>
            )}
            </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        </>
      )}
    </div>

    {isCompleted && recording.audioUrl && (
      <AudioPlayer
        recordingName={recording.name}
        player={player}
        disabled={isProcessing}
      />
    )}
    </div>
  )
}
