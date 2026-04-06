import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '../components/status-badge'
import { useMyDrafts } from '../hooks/use-my-drafts'

interface MyDraftItem {
  id: string
  title: string
  status: string
  updatedAt: string
  rejectionNote: string | null
  categories: { id: string; name: string }[]
}

export function MyDraftsPage() {
  const { t } = useTranslation('blog')
  const navigate = useNavigate()
  const { drafts, loading, error } = useMyDrafts()

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{t('pages.drafts')}</h1>
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
          {(drafts as MyDraftItem[]).map((draft: MyDraftItem) => (
            <Card key={draft.id} className="dark:bg-slate-900 dark:border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={draft.status as 'published' | 'draft' | 'rejected'} />
                      {draft.categories.map((cat: { id: string; name: string }) => (
                        <span
                          key={cat.id}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {draft.title}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(draft.updatedAt).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    {draft.status === 'rejected' && draft.rejectionNote && (
                      <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-4 py-3">
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                          {t('drafts.rejectionNote')}
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          {draft.rejectionNote}
                        </p>
                      </div>
                    )}
                  </div>
                  {(draft.status === 'draft' || draft.status === 'rejected') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/blog/${draft.id}/edit`)}
                      className="gap-1.5 shrink-0"
                    >
                      <Pencil className="size-3.5" />
                      {t('actions.edit')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyDraftsPage
