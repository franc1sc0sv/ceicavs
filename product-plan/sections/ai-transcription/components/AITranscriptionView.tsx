import { useState } from 'react'
import type {
  AITranscriptionProps,
  Folder,
  RecordingDetail,
  TranscriptionResult,
} from '../types'
import { RecordingCard } from './RecordingCard'

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

// ── Folder sidebar / tabs ────────────────────────────────────────────────────

function FolderNav({
  folders,
  selectedId,
  totalCount,
  onSelect,
}: {
  folders: Folder[]
  selectedId: string | null
  totalCount: number
  onSelect?: (id: string | null) => void
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-56 flex-shrink-0">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 px-1">
          Carpetas
        </p>
        <nav className="space-y-0.5">
          <button
            onClick={() => onSelect?.(null)}
            className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedId === null
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Todas</span>
            <span className="text-xs tabular-nums">{totalCount}</span>
          </button>
          {folders.map(f => (
            <button
              key={f.id}
              onClick={() => onSelect?.(f.id)}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedId === f.id
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="truncate">{f.name}</span>
              <span className="text-xs tabular-nums ml-2">{f.recordingCount}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile horizontal tabs */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => onSelect?.(null)}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedId === null
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Todas ({totalCount})
        </button>
        {folders.map(f => (
          <button
            key={f.id}
            onClick={() => onSelect?.(f.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedId === f.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {f.name} ({f.recordingCount})
          </button>
        ))}
      </div>
    </>
  )
}

// ── Transcription tabs ───────────────────────────────────────────────────────

type TabId = 'transcript' | 'summary' | 'takeaways' | 'actions'

const TABS: { id: TabId; label: string }[] = [
  { id: 'transcript', label: 'Transcripción' },
  { id: 'summary', label: 'Resumen' },
  { id: 'takeaways', label: 'Puntos Clave' },
  { id: 'actions', label: 'Acciones' },
]

function TranscriptionTabs({ transcription }: { transcription: TranscriptionResult }) {
  const [activeTab, setActiveTab] = useState<TabId>('transcript')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-center py-2 px-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[200px]">
        {activeTab === 'transcript' && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
              {transcription.fullTranscript.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{transcription.summary}</p>
            </div>
          </div>
        )}

        {activeTab === 'takeaways' && (
          <ul className="space-y-3">
            {transcription.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'actions' && (
          <ul className="space-y-2">
            {transcription.actionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600" />
                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ── Detail view ──────────────────────────────────────────────────────────────

function DetailView({
  detail,
  onTranscribe,
  onBack,
}: {
  detail: RecordingDetail
  onTranscribe?: (id: string) => void
  onBack?: () => void
}) {
  const { recording, transcription } = detail

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Transcripción IA
        </button>
        <svg className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{recording.name}</span>
      </div>

      {/* Recording header card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{recording.name}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md font-medium text-xs">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {recording.folderName}
              </span>
              <span>{formatDuration(recording.duration)}</span>
              <span>{formatDate(recording.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Audio player placeholder */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
          <button className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center flex-shrink-0 transition-colors shadow-sm">
            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
          {/* Waveform / progress bar */}
          <div className="flex-1 flex items-center gap-[2px] h-8">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full ${i < 20 ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                style={{ height: `${6 + Math.sin(i * 0.5) * 10 + Math.cos(i * 1.3) * 6}px` }}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums flex-shrink-0">
            0:00 / {formatDuration(recording.duration)}
          </span>
        </div>
      </div>

      {/* Transcription section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        {recording.transcriptionStatus === 'none' && (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">Transcribir con IA</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs mx-auto">
              Genera transcripción completa, resumen, puntos clave y acciones detectadas
            </p>
            <button
              onClick={() => onTranscribe?.(recording.id)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Transcribir
            </button>
          </div>
        )}

        {recording.transcriptionStatus === 'processing' && (
          <div className="text-center py-10">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-2 rounded-full bg-indigo-500 animate-pulse"
                  style={{
                    height: `${12 + i * 4}px`,
                    animationDelay: `${i * 150}ms`,
                    animationDuration: '1s',
                  }}
                />
              ))}
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">Procesando transcripción…</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Esto puede tomar unos minutos</p>
          </div>
        )}

        {recording.transcriptionStatus === 'completed' && transcription && (
          <TranscriptionTabs transcription={transcription} />
        )}
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function AITranscriptionView({
  recordings,
  folders,
  selectedFolderId = null,
  selectedDetail,
  onRecordingClick,
  onFolderSelect,
  onSearch,
  onStartRecording,
  onUpload,
  onTranscribe,
  onBack,
}: AITranscriptionProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // ── Detail view ────────────────────────────────────────────────────────
  if (selectedDetail) {
    return (
      <DetailView
        detail={selectedDetail}
        onTranscribe={onTranscribe}
        onBack={onBack}
      />
    )
  }

  // ── List view ──────────────────────────────────────────────────────────
  const handleSearch = (q: string) => {
    setSearchQuery(q)
    onSearch?.(q)
  }

  const displayedRecordings = recordings.filter(r => {
    const matchesFolder = selectedFolderId === null || r.folderId === selectedFolderId
    const matchesSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFolder && matchesSearch
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Transcripción IA</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {recordings.length} grabación{recordings.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onUpload}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Subir
          </button>
          <button
            onClick={onStartRecording}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            Grabar
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar grabaciones…"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Layout: sidebar + grid */}
      <div className="flex gap-8">
        <FolderNav
          folders={folders}
          selectedId={selectedFolderId}
          totalCount={recordings.length}
          onSelect={onFolderSelect}
        />

        {/* Recordings grid */}
        <div className="flex-1 min-w-0">
          {displayedRecordings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-slate-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {searchQuery
                  ? `Sin resultados para "${searchQuery}"`
                  : 'No hay grabaciones en esta carpeta'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayedRecordings.map(r => (
                <RecordingCard
                  key={r.id}
                  recording={r}
                  onClick={() => onRecordingClick?.(r.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
