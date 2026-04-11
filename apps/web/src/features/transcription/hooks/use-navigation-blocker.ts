import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

export function useNavigationBlocker(isProcessing: boolean) {
  const blocker = useBlocker(isProcessing)

  useEffect(() => {
    if (!isProcessing || import.meta.env.DEV) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isProcessing])

  return blocker
}
