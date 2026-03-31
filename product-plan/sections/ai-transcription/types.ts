export type TranscriptionStatus = 'none' | 'processing' | 'completed'
export type RecorderState = 'idle' | 'recording' | 'paused'

/** A folder for organizing recordings */
export interface Folder {
  id: string
  name: string
  recordingCount: number
}

/** A recording card shown in the list */
export interface Recording {
  id: string
  userId: string
  name: string
  folderId: string
  folderName: string
  /** Duration in seconds */
  duration: number
  createdAt: string
  transcriptionStatus: TranscriptionStatus
  /** Audio file URL for playback */
  audioUrl?: string
}

/** AI-generated transcription results */
export interface TranscriptionResult {
  /** Complete transcript text */
  fullTranscript: string
  /** Executive summary */
  summary: string
  /** Bulleted list of key points */
  keyTakeaways: string[]
  /** Detected action items / tasks */
  actionItems: string[]
  /** When the transcription was completed */
  completedAt: string
}

/** Full recording detail including transcription */
export interface RecordingDetail {
  recording: Recording
  transcription?: TranscriptionResult
}

/** Recorder state data */
export interface RecorderData {
  state: RecorderState
  /** Elapsed time in seconds */
  elapsedSeconds: number
  /** Max duration in seconds (1800 = 30 min) */
  maxSeconds: number
  /** Volume level 0-100 */
  volumeLevel: number
}

/** Props for the recordings list view */
export interface RecordingsListProps {
  recordings: Recording[]
  folders: Folder[]
  selectedFolderId?: string | null
  searchQuery?: string
  /** Called when a recording card is clicked */
  onRecordingClick?: (recordingId: string) => void
  /** Called when a folder is selected for filtering */
  onFolderSelect?: (folderId: string | null) => void
  /** Called when search input changes */
  onSearch?: (query: string) => void
  /** Called when "Record" button is clicked */
  onStartRecording?: () => void
  /** Called when "Upload" button is clicked */
  onUpload?: () => void
  /** Called when a folder is created */
  onCreateFolder?: (name: string) => void
  /** Called when a folder is renamed */
  onRenameFolder?: (folderId: string, name: string) => void
  /** Called when a folder is deleted */
  onDeleteFolder?: (folderId: string) => void
}

/** Props for the recording detail view */
export interface RecordingDetailProps {
  detail: RecordingDetail
  /** Called when "Transcribe" is clicked */
  onTranscribe?: (recordingId: string) => void
  /** Called when recording is renamed */
  onRename?: (recordingId: string, name: string) => void
  /** Called when recording is deleted */
  onDelete?: (recordingId: string) => void
  /** Called when recording is moved to another folder */
  onMove?: (recordingId: string, folderId: string) => void
  /** Called to go back to the list */
  onBack?: () => void
}

/** Props for the recorder overlay */
export interface RecorderProps {
  recorder: RecorderData
  onPause?: () => void
  onResume?: () => void
  onStop?: () => void
  onCancel?: () => void
}

/** Props for the save dialog (after recording or upload) */
export interface SaveDialogProps {
  folders: Folder[]
  onSave?: (name: string, folderId: string) => void
  onCancel?: () => void
}

/** Top-level props for the AI Transcription section */
export interface AITranscriptionProps {
  recordings: Recording[]
  folders: Folder[]
  selectedFolderId?: string | null
  searchQuery?: string
  /** Currently viewing recording detail (if set) */
  selectedDetail?: RecordingDetail
  /** Recorder state (if recording) */
  recorder?: RecorderData
  onRecordingClick?: (recordingId: string) => void
  onFolderSelect?: (folderId: string | null) => void
  onSearch?: (query: string) => void
  onStartRecording?: () => void
  onUpload?: () => void
  onTranscribe?: (recordingId: string) => void
  onRename?: (recordingId: string, name: string) => void
  onDelete?: (recordingId: string) => void
  onMove?: (recordingId: string, folderId: string) => void
  onCreateFolder?: (name: string) => void
  onRenameFolder?: (folderId: string, name: string) => void
  onDeleteFolder?: (folderId: string) => void
  onRecorderPause?: () => void
  onRecorderResume?: () => void
  onRecorderStop?: () => void
  onRecorderCancel?: () => void
  onSave?: (name: string, folderId: string) => void
  onBack?: () => void
}
