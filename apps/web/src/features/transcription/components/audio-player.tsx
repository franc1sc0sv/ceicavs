import { Play, Pause, RotateCcw, RotateCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Slider } from '@/components/ui/slider'
import { formatTimestamp } from '../utils'
import type { UseAudioPlayerReturn } from '../hooks/use-audio-player'

interface AudioPlayerProps {
  recordingName: string
  player: UseAudioPlayerReturn
  disabled?: boolean
}

const SKIP_SECONDS = 10

export function AudioPlayer({ recordingName, player, disabled = false }: AudioPlayerProps) {
  const { t } = useTranslation('transcription')
  const { currentTime, duration, isPlaying, isLoaded, toggle, seek, seekTo } = player

  const isDisabled = disabled || !isLoaded

  function handleSliderChange(value: number | readonly number[]) {
    const seconds = Array.isArray(value) ? (value as number[])[0] : (value as number)
    seek(seconds ?? 0)
  }

  return (
    <div className="border-t bg-background shadow-[0_-4px_16px_rgba(0,0,0,0.08)] mb-4">
      <div className="flex flex-col gap-2.5 px-6 py-3 max-w-3xl mx-auto">
        <p className="text-xs text-muted-foreground text-center truncate">{recordingName}</p>

        <div className="flex items-center gap-2">
          <span className="text-xs tabular-nums text-muted-foreground w-10 text-right shrink-0 select-none">
            {formatTimestamp(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration > 0 ? duration : 100}
            step={0.5}
            disabled={isDisabled}
            onValueChange={handleSliderChange}
            className="flex-1"
            aria-label={t('player.seekbar')}
          />
          <span className="text-xs tabular-nums text-muted-foreground w-10 shrink-0 select-none">
            {duration > 0 ? formatTimestamp(duration) : '--:--'}
          </span>
        </div>

        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            disabled={isDisabled}
            onClick={() => seekTo(Math.max(0, currentTime - SKIP_SECONDS))}
            aria-label={t('player.skipBack', { seconds: SKIP_SECONDS })}
            className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <RotateCcw className="size-5" />
            <span className="absolute text-[8px] font-bold leading-none mt-0.5 select-none">
              {SKIP_SECONDS}
            </span>
          </button>

          <button
            type="button"
            disabled={isDisabled}
            onClick={toggle}
            aria-label={isPlaying ? t('player.pause') : t('player.play')}
            className="flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {isPlaying
              ? <Pause className="size-4" />
              : <Play className="size-4 translate-x-px" />}
          </button>

          <button
            type="button"
            disabled={isDisabled}
            onClick={() => seekTo(Math.min(duration, currentTime + SKIP_SECONDS))}
            aria-label={t('player.skipForward', { seconds: SKIP_SECONDS })}
            className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <RotateCw className="size-5" />
            <span className="absolute text-[8px] font-bold leading-none mt-0.5 select-none">
              {SKIP_SECONDS}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
