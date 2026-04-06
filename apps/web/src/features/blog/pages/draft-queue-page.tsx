import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DraftCard } from '../components/draft-card'
import { useDraftQueue } from '../hooks/use-draft-queue'

interface DraftItem {
  id: string
  title: string
  excerpt: string | null
  createdAt: string
  author: { id: string; name: string; avatarUrl: string | null }
  categories: { id: string; name: string }[]
}

export function DraftQueuePage() {
  const { t } = useTranslation('blog')
  const navigate = useNavigate()
  const { drafts, loading, error, reviewDraft, reviewing } = useDraftQueue()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState('')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Cargando" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('error.title')}</p>
      </div>
    )
  }

  async function handleApprove(id: string) {
    await reviewDraft({ variables: { id, input: { action: 'approve', rejectionNote: null } } })
  }

  async function handleRejectConfirm() {
    if (!rejectingId) return
    await reviewDraft({
      variables: { id: rejectingId, input: { action: 'reject', rejectionNote: rejectNote } },
    })
    setRejectingId(null)
    setRejectNote('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{t('pages.queue')}</h1>
        <Button variant="ghost" size="sm" onClick={() => navigate('/blog')} className="gap-1.5">
          {t('actions.back')}
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('empty.noDrafts')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(drafts as DraftItem[]).map((draft: DraftItem) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              onApprove={handleApprove}
              onReject={(id) => setRejectingId(id)}
              approving={reviewing}
              rejecting={reviewing}
            />
          ))}
        </div>
      )}

      {rejectingId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h2
              id="reject-dialog-title"
              className="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
              {t('drafts.rejectDialog.title')}
            </h2>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder={t('drafts.rejectDialog.placeholder')}
              rows={4}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={t('queue.rejectNote')}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setRejectingId(null)
                  setRejectNote('')
                }}
              >
                {t('delete.cancel')}
              </Button>
              <Button
                disabled={reviewing}
                onClick={handleRejectConfirm}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
              >
                {t('actions.reject')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DraftQueuePage
