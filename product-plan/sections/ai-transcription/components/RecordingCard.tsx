import type { Recording, TranscriptionStatus } from '../types'

const STATUS_CONFIG: Record<TranscriptionStatus, { label: string; class: string; dot: string }> = {
  none:       { label: 'Sin transcripción', class: 'text-slate-500 dark:text-slate-500',   dot: 'bg-slate-400 dark:bg-slate-600' },
  processing: { label: 'Procesando…',       class: 'text-amber-600 dark:text-amber-400',   dot: 'bg-amber-400 animate-pulse' },
  completed:  { label: 'Transcrita',        class: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface RecordingCardProps {
  recording: Recording
  onClick?: () => void
}

export function RecordingCard({ recording, onClick }: RecordingCardProps) {
  const status = STATUS_CONFIG[recording.transcriptionStatus]

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200"
    >
      {/* Mini waveform decoration */}
      <div className="flex items-end gap-[3px] mb-4 h-5 opacity-60 group-hover:opacity-100 transition-opacity">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full ${recording.transcriptionStatus === 'completed' ? 'bg-indigo-400 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            style={{ height: `${4 + Math.sin(i * 0.8 + recording.duration * 0.01) * 8 + Math.random() * 6}px` }}
          />
        ))}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
        {recording.name}
      </h3>

      {/* Folder badge */}
      <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md mb-3">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        {recording.folderName}
      </span>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDuration(recording.duration)}
          </span>
          <span>{formatDate(recording.createdAt)}</span>
        </div>
        <span className={`flex items-center gap-1.5 font-medium ${status.class}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          <span className="hidden sm:inline">{status.label}</span>
        </span>
      </div>
    </button>
  )
}
