import { useMutation } from '@apollo/client/react'
import { SmilePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { EmojiPickerPopover } from './emoji-picker-popover'
import { TOGGLE_REACTION } from '../graphql/blog.mutations'
import { GET_FEED } from '../graphql/blog.queries'

interface ReactionSummaryItem {
  emoji: string
  count: number
  userReacted: boolean
}

interface ReactionPickerProps {
  postId: string
  reactionSummary: ReactionSummaryItem[]
}

export function ReactionPicker({ postId, reactionSummary }: ReactionPickerProps) {
  const { t } = useTranslation('blog')
  const [toggleReaction] = useMutation(TOGGLE_REACTION, {
    refetchQueries: [{ query: GET_FEED }],
  })

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {reactionSummary.map((r) => (
        <button
          key={r.emoji}
          onClick={(e) => {
            e.stopPropagation()
            toggleReaction({ variables: { postId, commentId: null, emoji: r.emoji } })
          }}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all hover:scale-105 ${
            r.userReacted
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 font-semibold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <span className="leading-none">{r.emoji}</span>
          <span className="font-medium tabular-nums">{r.count}</span>
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
          className="h-7 w-7 rounded-full"
          aria-label={t('reactions.react')}
        >
          <SmilePlus className="size-4" />
        </Button>
      </EmojiPickerPopover>
    </div>
  )
}
