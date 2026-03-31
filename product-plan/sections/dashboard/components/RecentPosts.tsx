import { ArrowRight } from 'lucide-react'
import type { RecentPost } from '../types'

function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  })
}

interface RecentPostsProps {
  posts: RecentPost[]
  onPostClick?: (post: RecentPost) => void
}

export function RecentPosts({ posts, onPostClick }: RecentPostsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Posts Recientes
        </h3>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => onPostClick?.(post)}
            className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
                {post.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{post.authorName}</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span>{formatDate(post.publishedAt)}</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {post.categoryName}
                </span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600" />
          </button>
        ))}
      </div>
    </div>
  )
}
