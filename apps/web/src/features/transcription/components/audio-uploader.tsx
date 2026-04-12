import { useRef, useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, Mic, Square } from 'lucide-react'

const ACCEPTED_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/x-m4a']

interface AudioUploaderProps {
  onAudioReady: (audio: Float32Array, file: File, name: string) => void
  disabled: boolean
}

export function AudioUploader({ onAudioReady, disabled }: AudioUploaderProps) {
  const { t } = useTranslation('transcription')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const temp = await navigator.mediaDevices.getUserMedia({ audio: true })
        temp.getTracks().forEach((track) => track.stop())
      } catch {
        // permission denied — labels will be empty
      }
      const all = await navigator.mediaDevices.enumerateDevices()
      const audioInputs = all.filter((d) => d.kind === 'audioinput')
      setDevices(audioInputs)
      if (audioInputs.length > 0) {
        setSelectedDeviceId(audioInputs[0].deviceId)
      }
    }
    void loadDevices()
  }, [])

  const selectedDeviceLabel = (() => {
    const device = devices.find((d) => d.deviceId === selectedDeviceId)
    if (!device) return t('uploader.selectMic')
    return device.label || t('uploader.defaultMic')
  })()

  const drawBars = useCallback(() => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const barCount = 64

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = canvas.width / barCount - 1
      const step = Math.floor(bufferLength / barCount)

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step]
        const barHeight = (value / 255) * canvas.height
        const hue = 220 + (i / barCount) * 40
        ctx.fillStyle = `hsl(${hue}, 75%, 60%)`
        ctx.fillRect(i * (barWidth + 1), canvas.height - barHeight, barWidth, barHeight)
      }
    }

    draw()
  }, [])

  const decodeAudioFile = useCallback(
    async (file: File) => {
      const arrayBuffer = await file.arrayBuffer()
      const audioContext = new AudioContext({ sampleRate: 16000 })
      const decoded = await audioContext.decodeAudioData(arrayBuffer)
      const channelData = decoded.getChannelData(0)
      await audioContext.close()
      const name = file.name.replace(/\.[^.]+$/, '') || t('upload.untitled')
      onAudioReady(channelData, file, name)
    },
    [onAudioReady, t],
  )

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_FORMATS.includes(file.type)) return
      void decodeAudioFile(file)
    },
    [decodeAudioFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const startRecording = useCallback(async () => {
    const audioConstraints: MediaTrackConstraints = selectedDeviceId
      ? { deviceId: { exact: selectedDeviceId } }
      : {}
    const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints })

    const audioContext = new AudioContext()
    audioContextRef.current = audioContext
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)
    analyserRef.current = analyser

    chunksRef.current = []
    const recorder = new MediaRecorder(stream)
    mediaRecorderRef.current = recorder

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
    recorder.onstop = () => {
      cancelAnimationFrame(animationRef.current)
      void audioContextRef.current?.close()
      const blob = new Blob(chunksRef.current, { type: 'audio/ogg' })
      const timestamp = new Date().toISOString().slice(0, 10)
      const file = new File([blob], `grabacion-${timestamp}.ogg`, { type: 'audio/ogg' })
      void decodeAudioFile(file)
      stream.getTracks().forEach((track) => track.stop())
    }

    recorder.start()
    setIsRecording(true)
    drawBars()
  }, [selectedDeviceId, decodeAudioFile, drawBars])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }, [])

  return (
    <Tabs defaultValue="record">
      <TabsList className="w-full">
        <TabsTrigger value="file" className="flex-1" disabled={isRecording || disabled}>
          <Upload className="h-4 w-4 mr-2" />
          {t('uploader.tabFile')}
        </TabsTrigger>
        <TabsTrigger value="record" className="flex-1" disabled={disabled}>
          <Mic className="h-4 w-4 mr-2" />
          {t('uploader.tabRecord')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="file" className="mt-4">
        <Card
          className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed transition-colors cursor-pointer ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t('uploader.dropzone')}</p>
          <p className="text-xs text-muted-foreground">{t('uploader.formats')}</p>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            {t('uploader.browse')}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,.m4a,.ogg,audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Card>
      </TabsContent>

      <TabsContent value="record" className="mt-4 flex flex-col gap-4">
        <Select
          value={selectedDeviceId}
          onValueChange={(value) => { if (value !== null) setSelectedDeviceId(value) }}
          disabled={isRecording || disabled}
        >
          <SelectTrigger className="gap-2">
            <Mic className="h-4 w-4 text-muted-foreground shrink-0" />
            <SelectValue>{selectedDeviceLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {devices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label || t('uploader.defaultMic')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          className={`relative rounded-lg overflow-hidden bg-muted transition-all duration-300 ${
            isRecording ? 'h-20 opacity-100' : 'h-0 opacity-0'
          }`}
        >
          <canvas ref={canvasRef} width={600} height={80} className="w-full h-full" />
        </div>

        {isRecording ? (
          <Button variant="destructive" onClick={stopRecording} disabled={disabled}>
            <Square className="h-4 w-4 mr-2" />
            {t('uploader.stopRecording')}
          </Button>
        ) : (
          <Button onClick={() => void startRecording()} disabled={disabled}>
            <Mic className="h-4 w-4 mr-2" />
            {t('uploader.record')}
          </Button>
        )}
      </TabsContent>
    </Tabs>
  )
}
