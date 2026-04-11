import { useState, useCallback, useEffect } from 'react'

type Tone = 'as-is' | 'more-casual' | 'more-formal'

interface RewriterAPI {
  availability: () => Promise<string>
  create: (options: { tone: Tone; length: string; format: string }) => Promise<{
    rewrite: (text: string) => Promise<string>
    destroy: () => void
  }>
}

declare global {
  interface Window {
    Rewriter?: RewriterAPI
  }
}

interface UseTextSimplifierReturn {
  simplify: (text: string, tone: Tone) => Promise<void>
  result: string | null
  isSimplifying: boolean
  isAvailable: boolean
  reset: () => void
}

export function useTextSimplifier(): UseTextSimplifierReturn {
  const [result, setResult] = useState<string | null>(null)
  const [isSimplifying, setIsSimplifying] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    const checkAvailability = async () => {
      if (!window.Rewriter) return
      const status = await window.Rewriter.availability()
      setIsAvailable(status !== 'unavailable')
    }
    void checkAvailability()
  }, [])

  const simplify = useCallback(async (text: string, tone: Tone) => {
    if (!isAvailable || !window.Rewriter) return

    setIsSimplifying(true)
    setResult(null)

    try {
      const instance = await window.Rewriter.create({ tone, length: 'as-is', format: 'plain-text' })
      const output = await instance.rewrite(text)
      instance.destroy()
      setResult(output)
    } finally {
      setIsSimplifying(false)
    }
  }, [isAvailable])

  const reset = useCallback(() => {
    setResult(null)
  }, [])

  return { simplify, result, isSimplifying, isAvailable, reset }
}
