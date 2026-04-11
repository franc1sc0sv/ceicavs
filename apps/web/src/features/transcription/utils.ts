export interface TranscriptSegment {
  start: number
  end: number
  text: string
}

export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function parseSegments(raw: string | null | undefined): TranscriptSegment[] | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as TranscriptSegment[]
    return parsed.length > 0 ? parsed : null
  } catch {
    return null
  }
}

export function getActiveSegmentIndex(segments: TranscriptSegment[], currentTime: number): number {
  let result = -1
  for (let i = 0; i < segments.length; i++) {
    if (segments[i].start <= currentTime) result = i
    else break
  }
  return result
}
