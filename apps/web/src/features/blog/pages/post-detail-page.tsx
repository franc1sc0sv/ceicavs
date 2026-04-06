import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Pencil, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { useAbility } from '@/context/ability.context'
import { useAuth } from '@/context/auth.context'
import { Action, Subject, UserRole } from '@ceicavs/shared'
import { ReactionBar } from '../components/reaction-bar'
import { CommentList } from '../components/comment-list'
import { usePostDetail } from '../hooks/use-post-detail'
import { useSetBreadcrumb } from '@/context/breadcrumb.context'

const ROLE_BADGE_CLASSES: Record<string, string> = {
  [UserRole.ADMIN]: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  [UserRole.TEACHER]: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  [UserRole.STUDENT]: 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300',
}

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

function avatarBg(role: string): string {
  if (role === UserRole.ADMIN) return 'bg-indigo-600'
  if (role === UserRole.TEACHER) return 'bg-amber-500'
  return 'bg-slate-500'
}

export function PostDetailPage() {
  const { t } = useTranslation('blog')
  const { t: tc } = useTranslation('common')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const ability = useAbility()
  const { user } = useAuth()
  const { post, loading, error, refetch } = usePostDetail(id ?? '')

  useSetBreadcrumb([
    { label: tc('nav.blog'), to: '/blog' },
    { label: post?.title ?? '' },
  ])

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
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          {t('error.retry')}
        </Button>
      </div>
    )
  }

  if (!post) return null

  const canEdit =
    ability.can(Action.MANAGE, Subject.POST) || user?.id === post.author.id

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        {canEdit && (
          <Button variant="outline" size="sm" onClick={() => navigate(`/blog/${post.id}/edit`)} className="gap-1.5">
            <Pencil className="size-4" />
            {t('actions.edit')}
          </Button>
        )}
        {!canEdit && <div />}
        <Button variant="ghost" size="sm" onClick={() => navigate('/blog')} className="gap-1.5">
          {t('actions.back')}
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {post.images && post.images.length > 0 ? (
        <div className="px-12">
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {[...post.images].sort((a, b) => a.order - b.order).map((img) => (
                <CarouselItem key={img.id}>
                  <div className="rounded-2xl overflow-hidden aspect-video">
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {post.images.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      ) : null}

      <header className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {(post.categories as { id: string; name: string }[]).map((cat: { id: string; name: string }) => (
            <span
              key={cat.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
            >
              {cat.name}
            </span>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3">
          {post.author.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarBg(post.author.role)}`}
              aria-hidden="true"
            >
              {initials(post.author.name)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {post.author.name}
              </span>
              {post.author.role !== UserRole.STUDENT && (
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${ROLE_BADGE_CLASSES[post.author.role] ?? ''}`}
                >
                  {t(`roles.${post.author.role}`)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {new Date(post.createdAt).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </header>

      {post.content && (
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      <section aria-label="Reacciones">
        <ReactionBar postId={post.id} reactionSummary={post.reactionSummary} />
      </section>

      <hr className="border-slate-200 dark:border-slate-800" />

      <CommentList postId={post.id} />
    </article>
  )
}

export default PostDetailPage
