'use client'

import type { PostPreview, EmojiType } from '../types'

// ── helpers ────────────────────────────────────────────────────────────────

const EMOJI_MAP: Record<EmojiType, string> = {
  like:       '👍',
  love:       '❤️',
  insightful: '💡',
  funny:      '😄',
  celebrate:  '🎉',
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function avatarBg(role: string) {
  if (role === 'admin')   return 'bg-indigo-600'
  if (role === 'teacher') return 'bg-amber-500'
  return 'bg-slate-500'
}

function relativeDate(isoString: string): string {
  const now = new Date()
  const date = new Date(isoString)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

// ── component ─────────────────────────────────────────────────────────────

export interface PostCardProps {
  post: PostPreview
  onClick?: () => void
}

export function PostCard({ post, onClick }: PostCardProps) {
  const topReactions = post.reactions.slice(0, 3)

  return (
    <article
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200/80 dark:hover:border-indigo-700/40 hover:shadow-md hover:shadow-slate-100/80 dark:hover:shadow-slate-950/60 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Gradient accent line on hover */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="p-5 sm:p-6">
        {/* Top row: categories + date */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {post.categories.map(cat => (
              <span
                key={cat.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
              >
                {cat.name}
              </span>
            ))}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 tabular-nums whitespace-nowrap mt-0.5">
            {relativeDate(post.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug mb-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-5">
          {post.excerpt}
        </p>

        {/* Bottom: author left, reactions right */}
        <div className="flex items-center justify-between gap-4">
          {/* Author */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 ${avatarBg(post.author.role)}`}
            >
              {initials(post.author.name)}
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
              {post.author.name}
            </span>
            {post.author.role !== 'student' && (
              <span
                className={`hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                  post.author.role === 'admin'
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400'
                    : 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
                }`}
              >
                {post.author.role === 'admin' ? 'Admin' : 'Docente'}
              </span>
            )}
          </div>

          {/* Reactions + comment count */}
          <div className="flex items-center gap-1.5 shrink-0">
            {topReactions.map(r => (
              <span
                key={r.emoji}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                  r.userReacted
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <span className="leading-none">{EMOJI_MAP[r.emoji]}</span>
                <span className="font-medium tabular-nums">{r.count}</span>
              </span>
            ))}
            {post.commentCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 ml-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium tabular-nums">{post.commentCount}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
