import { useState, useCallback, useRef } from 'react'
import Tesseract from 'tesseract.js'

interface DownloadProgress {
  status: string
  loaded: number
  total: number
}

interface ImageOcrState {
  extractedText: string | null
  isProcessing: boolean
  downloadProgress: DownloadProgress | null
  error: string | null
}

interface UseImageOcrReturn extends ImageOcrState {
  extractText: (imageUrl: string) => void
  reset: () => void
}

export function useImageOcr(): UseImageOcrReturn {
  const abortRef = useRef<boolean>(false)
  const [state, setState] = useState<ImageOcrState>({
    extractedText: null,
    isProcessing: false,
    downloadProgress: null,
    error: null,
  })

  const extractText = useCallback((imageUrl: string) => {
    abortRef.current = false
    setState({ extractedText: null, isProcessing: true, downloadProgress: null, error: null })

    void Tesseract.recognize(imageUrl, 'eng+spa', {
      logger: (m: { status: string; progress: number }) => {
        if (abortRef.current) return
        if (m.status === 'recognizing text') {
          setState((prev) => ({ ...prev, downloadProgress: null }))
        } else {
          setState((prev) => ({
            ...prev,
            downloadProgress: {
              status: m.status,
              loaded: Math.round(m.progress * 100),
              total: 100,
            },
          }))
        }
      },
    }).then(({ data: { text } }) => {
      if (abortRef.current) return
      setState({ extractedText: text.trim(), isProcessing: false, downloadProgress: null, error: null })
    }).catch((err: unknown) => {
      if (abortRef.current) return
      setState({
        extractedText: null,
        isProcessing: false,
        downloadProgress: null,
        error: err instanceof Error ? err.message : 'OCR failed',
      })
    })
  }, [])

  const reset = useCallback(() => {
    abortRef.current = true
    setState({ extractedText: null, isProcessing: false, downloadProgress: null, error: null })
  }, [])

  return { ...state, extractText, reset }
}
