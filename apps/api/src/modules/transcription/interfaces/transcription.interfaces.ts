export interface ITranscriptSegment {
  start: number
  end: number
  text: string
}

export interface ITranscription {
  id: string
  recordingId: string
  status: 'none' | 'processing' | 'completed'
  summaryStatus: 'none' | 'generating' | 'completed' | 'failed'
  fullTranscript: string | null
  segments: ITranscriptSegment[] | null
  summary: string | null
  summaryError: string | null
  keyTakeaways: string[]
  actionItems: string[]
  completedAt: Date | null
}

export interface IUpdateTranscriptionData {
  recordingId: string
  fullTranscript: string
  segments: ITranscriptSegment[]
  summary: string | null
}
