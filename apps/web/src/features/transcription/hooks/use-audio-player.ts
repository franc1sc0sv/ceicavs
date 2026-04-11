import { useRef, useState, useEffect, useCallback } from 'react'

interface AudioPlayerState {
  currentTime: number
  duration: number
  isPlaying: boolean
  isLoaded: boolean
}

export interface UseAudioPlayerReturn extends AudioPlayerState {
  toggle: () => void
  seek: (seconds: number) => void
  seekTo: (seconds: number) => void
}

export function useAudioPlayer(url: string | null): UseAudioPlayerReturn {
  const elRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioPlayerState>({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isLoaded: false,
  })

  useEffect(() => {
    if (!url) return

    const el = new Audio()
    el.preload = 'metadata'
    el.src = url
    elRef.current = el

    const readDuration = () => {
      if (!isNaN(el.duration) && el.duration > 0) {
        setState(s => ({ ...s, duration: el.duration }))
      }
    }

    const onTimeUpdate = () => setState(s => ({ ...s, currentTime: el.currentTime }))
    const onDurationChange = () => readDuration()
    const onLoadedMetadata = () => readDuration()
    const onPlay = () => setState(s => ({ ...s, isPlaying: true }))
    const onPause = () => setState(s => ({ ...s, isPlaying: false }))
    const onEnded = () => setState(s => ({ ...s, isPlaying: false }))
    const onCanPlay = () => {
      readDuration()
      setState(s => ({ ...s, isLoaded: true }))
    }

    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('durationchange', onDurationChange)
    el.addEventListener('loadedmetadata', onLoadedMetadata)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onEnded)
    el.addEventListener('canplay', onCanPlay)

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate)
      el.removeEventListener('durationchange', onDurationChange)
      el.removeEventListener('loadedmetadata', onLoadedMetadata)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('canplay', onCanPlay)
      el.pause()
      el.src = ''
      elRef.current = null
      setState({ currentTime: 0, duration: 0, isPlaying: false, isLoaded: false })
    }
  }, [url])

  const toggle = useCallback(() => {
    const el = elRef.current
    if (!el) return
    if (el.paused) void el.play()
    else el.pause()
  }, [])

  const seek = useCallback((seconds: number) => {
    const el = elRef.current
    if (!el) return
    el.currentTime = seconds
  }, [])

  const seekTo = useCallback((seconds: number) => {
    const el = elRef.current
    if (!el) return
    el.currentTime = seconds
    void el.play()
  }, [])

  return { ...state, toggle, seek, seekTo }
}
