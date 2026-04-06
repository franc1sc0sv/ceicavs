import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface DraftAuthor {
  id: string
  name: string
  avatarUrl: string | null
}

interface DraftCategory {
  id: string
  name: string
}

interface DraftCardData {
  id: string
  title: string
  excerpt: string | null
  createdAt: string
  author: DraftAuthor
  categories: DraftCategory[]
}

interface DraftCardProps {
  draft: DraftCardData
  onApprove: (id: string) => void
  onReject: (id: string) => void
  approving: boolean
  rejecting: boolean
}

export function DraftCard({ draft, onApprove, onReject, approving, rejecting }: DraftCardProps) {
  const { t } = useTranslation('blog')

  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {draft.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                >
                  {cat.name}
                </span>
              ))}
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
              {draft.title}
            </h3>
            {draft.excerpt && (
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                {draft.excerpt}
              </p>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {draft.author.name}
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Button
              size="sm"
              disabled={approving || rejecting}
              onClick={() => onApprove(draft.id)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            >
              {t('actions.approve')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={approving || rejecting}
              onClick={() => onReject(draft.id)}
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              {t('actions.reject')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
