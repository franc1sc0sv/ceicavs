import { useTranslation } from 'react-i18next'
import { SmilePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReactions } from '../hooks/use-reactions'
import { EmojiPickerPopover } from './emoji-picker-popover'

interface ReactionSummaryItem {
  emoji: string
  count: number
  userReacted: boolean
}

interface ReactionBarProps {
  postId: string
  reactionSummary: ReactionSummaryItem[]
}

export function ReactionBar({ postId, reactionSummary }: ReactionBarProps) {
  const { t } = useTranslation('blog')
  const { toggleReaction, loading } = useReactions(postId)

  return (
    <div className="flex items-center gap-2 flex-wrap" role="group" aria-label={t('reactions.label')}>
      {reactionSummary.map((r) => (
        <button
          key={r.emoji}
          disabled={loading}
          onClick={() => toggleReaction({ variables: { postId, commentId: null, emoji: r.emoji } })}
          aria-label={`${r.emoji} (${r.count})`}
          aria-pressed={r.userReacted}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 ${
            r.userReacted
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 shadow-sm'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <span aria-hidden="true">{r.emoji}</span>
          {r.count > 0 && <span className="tabular-nums text-xs">{r.count}</span>}
        </button>
      ))}
      <EmojiPickerPopover
        onEmojiSelect={(native) => {
          toggleReaction({ variables: { postId, commentId: null, emoji: native } })
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          disabled={loading}
          aria-label={t('reactions.react')}
        >
          <SmilePlus className="size-4" />
        </Button>
      </EmojiPickerPopover>
    </div>
  )
}
