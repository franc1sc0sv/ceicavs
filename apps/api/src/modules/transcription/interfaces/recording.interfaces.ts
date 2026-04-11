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
  segments: string | null
  summary: string | null
  summaryError: string | null
  keyTakeaways: string[]
  actionItems: string[]
  completedAt: Date | null
}

export interface IRecording {
  id: string
  userId: string
  name: string
  duration: number
  audioUrl: string | null
  cloudinaryPublicId: string | null
  transcriptionStatus: 'none' | 'processing' | 'completed'
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  transcription?: ITranscription | null
}

export interface ICreateRecordingData {
  userId: string
  name: string
  duration: number
  audioUrl: string
  cloudinaryPublicId: string
}

export interface IUpdateTranscriptionData {
  recordingId: string
  fullTranscript: string
  segments: ITranscriptSegment[]
  summary: string | null
}

export interface IUpdateSummaryData {
  recordingId: string
  summary: string
  keyTakeaways: string[]
  actionItems: string[]
}
