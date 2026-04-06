import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/client/react'
import { Loader2, SmilePlus } from 'lucide-react'
import { UserRole } from '@ceicavs/shared'
import { Button } from '@/components/ui/button'
import type { GetCommentsQuery } from '@/generated/graphql'
import { usePaginatedComments } from '../hooks/use-paginated-comments'
import { useReplies } from '../hooks/use-replies'
import { CommentForm } from './comment-form'
import { EmojiPickerPopover } from './emoji-picker-popover'
import { TOGGLE_REACTION } from '../graphql/blog.mutations'
import { GET_COMMENTS, GET_REPLIES } from '../graphql/blog.queries'

type CommentItem = NonNullable<GetCommentsQuery['comments']>['items'][number]

const ROLE_BADGE_CLASSES: Record<string, string> = {
  [UserRole.ADMIN]: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  [UserRole.TEACHER]: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  [UserRole.STUDENT]: 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300',
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function avatarBg(role: string): string {
  if (role === UserRole.ADMIN) return 'bg-indigo-600'
  if (role === UserRole.TEACHER) return 'bg-amber-500'
  return 'bg-slate-500'
}

interface CommentNodeProps {
  comment: CommentItem
  postId: string
}

function CommentNode({ comment, postId }: CommentNodeProps) {
  const { t } = useTranslation('blog')
  const [replying, setReplying] = useState(false)
  const { replies, loading, hasMore, loadMore, activated, activate } = useReplies(comment.id)
  const [toggleReaction] = useMutation(TOGGLE_REACTION, {
    refetchQueries: [
      { query: GET_COMMENTS, variables: { postId } },
      ...(comment.parentId ? [{ query: GET_REPLIES, variables: { parentId: comment.parentId } }] : []),
    ],
  })
  const reactionSummary = comment.reactionSummary ?? []

  const indentPx = Math.min(comment.depth, 4) * 24

  return (
    <div style={{ marginLeft: indentPx > 0 ? `${indentPx}px` : undefined }}>
      <div className="flex gap-3">
        <div className="shrink-0">
          {comment.author.avatarUrl ? (
            <img
              src={comment.author.avatarUrl}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${avatarBg(comment.author.role)}`}
              aria-hidden="true"
            >
              {initials(comment.author.name)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {comment.author.name}
            </span>
            {comment.author.role !== UserRole.STUDENT && (
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${ROLE_BADGE_CLASSES[comment.author.role] ?? ''}`}
              >
                {t(`roles.${comment.author.role}`)}
              </span>
            )}
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
              {new Date(comment.createdAt).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {comment.text}
          </p>

          {comment.gifUrl && (
            <img
              src={comment.gifUrl}
              alt={comment.gifAlt ?? ''}
              className="mt-2 max-h-48 rounded-lg"
            />
          )}

          <div className="flex items-center gap-3 mt-1.5">
            <button
              onClick={() => setReplying((v) => !v)}
              className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:underline"
            >
              {t('comments.reply')}
            </button>

            <div className="flex items-center gap-1">
              {reactionSummary.map((r) => (
                <button
                  key={r.emoji}
                  onClick={() => toggleReaction({ variables: { postId: null, commentId: comment.id, emoji: r.emoji } })}
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] transition-all hover:scale-105 ${
                    r.userReacted
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span className="tabular-nums">{r.count}</span>
                </button>
              ))}
              <EmojiPickerPopover
                onEmojiSelect={(native) => {
                  toggleReaction({ variables: { postId: null, commentId: comment.id, emoji: native } })
                }}
              >
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" aria-label={t('reactions.react')}>
                  <SmilePlus className="size-3" />
                </Button>
              </EmojiPickerPopover>
            </div>
          </div>

          {replying && (
            <div className="mt-2">
              <CommentForm postId={postId} parentId={comment.id} onCancel={() => setReplying(false)} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {!activated && (comment.replyCount ?? 0) > 0 && (
          <button
            onClick={activate}
            className="ml-11 text-xs font-medium text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {t('comments.loadReplies')} ({comment.replyCount})
          </button>
        )}

        {activated && loading && replies.length === 0 && (
          <div className="ml-11 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <Loader2 className="size-3 animate-spin" aria-hidden="true" />
            {t('comments.loadingReplies')}
          </div>
        )}

        {activated && replies.length > 0 && (
          <div className="ml-11 pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-4">
            {replies.map((reply) => (
              <CommentNode key={reply.id} comment={reply} postId={postId} />
            ))}
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="text-xs font-medium text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:underline"
              >
                {loading ? t('comments.loading') : t('comments.loadMoreReplies')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface CommentListProps {
  postId: string
}

export function CommentList({ postId }: CommentListProps) {
  const { t } = useTranslation('blog')
  const { comments, loading, hasMore, loadMore } = usePaginatedComments(postId)

  const topLevel = comments.filter((c) => !c.parentId)

  return (
    <section aria-label={t('comments.title')}>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        {t('comments.title')}
        {topLevel.length > 0 && (
          <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
            ({topLevel.length})
          </span>
        )}
      </h2>

      <div className="mb-6">
        <CommentForm postId={postId} />
      </div>

      {loading && topLevel.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 py-4">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {t('comments.loading')}
        </div>
      ) : topLevel.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">{t('empty.noComments')}</p>
      ) : (
        <div className="space-y-6">
          {topLevel.map((comment) => (
            <CommentNode key={comment.id} comment={comment} postId={postId} />
          ))}
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full py-2 text-sm font-medium text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
            >
              {loading ? t('comments.loading') : t('comments.loadMore')}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
