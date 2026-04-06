import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { UserRole } from '@ceicavs/shared'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ReactionPicker } from './reaction-picker'

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

interface ReactionSummaryItem {
  emoji: string
  count: number
  userReacted: boolean
}

interface Author {
  id: string
  name: string
  avatarUrl: string | null
  role: string
}

interface CategoryItem {
  id: string
  name: string
}

interface PostImage {
  id: string
  url: string
  order: number
}

interface PostCardData {
  id: string
  title: string
  excerpt: string | null
  createdAt: string
  author: Author
  categories: CategoryItem[]
  reactionSummary: ReactionSummaryItem[]
  commentCount: number
  images?: PostImage[]
}

interface PostCardProps {
  post: PostCardData
  onClick: () => void
}

function PostImageArea({ post }: { post: PostCardData }) {
  const sortedImages = post.images
    ? [...post.images].sort((a, b) => a.order - b.order)
    : []

  if (sortedImages.length >= 2) {
    return (
      <div className="relative">
        <Carousel>
          <CarouselContent>
            {sortedImages.map((img) => (
              <CarouselItem key={img.id}>
                <div className="h-56 overflow-hidden">
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="left-2"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
          />
          <CarouselNext
            className="right-2"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
          />
        </Carousel>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1" aria-hidden="true">
          {sortedImages.map((img) => (
            <span key={img.id} className="w-1.5 h-1.5 rounded-full bg-white/70" />
          ))}
        </div>
      </div>
    )
  }

  if (sortedImages.length === 1) {
    return (
      <div className="h-56 overflow-hidden">
        <img
          src={sortedImages[0].url}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none' }}
        />
      </div>
    )
  }

  return null
}

export function PostCard({ post, onClick }: PostCardProps) {
  const { t } = useTranslation('blog')

  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={post.title}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200/80 dark:hover:border-indigo-700/40 hover:shadow-md hover:shadow-slate-100/80 dark:hover:shadow-slate-950/60 transition-all duration-200 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <PostImageArea post={post} />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {post.categories.map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
              >
                {cat.name}
              </span>
            ))}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 tabular-nums whitespace-nowrap mt-0.5">
            {relativeDate(post.createdAt)}
          </span>
        </div>

        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug mb-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors line-clamp-2">
          {post.title}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-5">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 min-w-0 mb-3">
          {post.author.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt=""
              className="w-6 h-6 rounded-full shrink-0 object-cover"
            />
          ) : (
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 ${avatarBg(post.author.role)}`}
              aria-hidden="true"
            >
              {initials(post.author.name)}
            </div>
          )}
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
            {post.author.name}
          </span>
          {post.author.role !== UserRole.STUDENT && (
            <span
              className={`hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${ROLE_BADGE_CLASSES[post.author.role] ?? ''}`}
            >
              {t(`roles.${post.author.role}`)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div onClick={(e) => e.stopPropagation()}>
            <ReactionPicker postId={post.id} reactionSummary={post.reactionSummary} />
          </div>
          {post.commentCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 shrink-0">
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="font-medium tabular-nums">{post.commentCount}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
