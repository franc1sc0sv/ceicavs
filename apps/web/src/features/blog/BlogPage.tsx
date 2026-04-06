import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2, Settings, Inbox, FileText, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Can, useAbility } from '@/context/ability.context'
import { Action, Subject, UserRole } from '@ceicavs/shared'
import { useAuth } from '@/context/auth.context'
import { PostCard } from './components/post-card'
import { CategoryChips } from './components/category-chips'
import { useBlogFeed } from './hooks/use-blog-feed'
import { useCategories } from './hooks/use-categories'

export default function BlogPage() {
  const { t } = useTranslation('blog')
  const navigate = useNavigate()
  const ability = useAbility()
  const { user } = useAuth()
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const { posts, loading, error, search, categoryId, setSearch, setCategoryId, isFiltered, refetch, hasMore, loadMore } =
    useBlogFeed()
  const { categories } = useCategories()

  const canModerate = ability.can(Action.APPROVE, Subject.POST)
  const canCreate = ability.can(Action.CREATE, Subject.POST)
  const canManageCategories = ability.can(Action.MANAGE, Subject.CATEGORY)
  const isStudent = user?.role === UserRole.STUDENT

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('filters.search')}
            className="pl-9"
            aria-label={t('filters.search')}
          />
        </div>
        {isStudent && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/blog/drafts')}
            className="gap-1.5"
          >
            <FileText className="size-4" />
            {t('pages.drafts')}
          </Button>
        )}
        {canModerate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/blog/queue')}
            className="gap-1.5"
          >
            <Inbox className="size-4" />
            {t('pages.queue')}
          </Button>
        )}
        {canManageCategories && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/blog/categories')}
            className="gap-1.5"
          >
            <Settings className="size-4" />
            {t('pages.categories')}
          </Button>
        )}
        {canCreate && (
          <Can I={Action.CREATE} a={Subject.POST}>
            <Button onClick={() => navigate('/blog/new')} className="gap-1.5">
              <Plus className="size-4" />
              {t('newPost')}
            </Button>
          </Can>
        )}
      </div>

      <CategoryChips
        categories={categories}
        selectedId={categoryId}
        onSelect={setCategoryId}
      />

      {isFiltered && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {posts.length} {posts.length === 1 ? t('filters.results', { count: 1 }) : t('filters.results_plural', { count: posts.length })}
          </span>
          <button
            onClick={() => {
              setSearch('')
              setCategoryId(null)
            }}
            className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {t('filters.clearFilters')}
          </button>
        </div>
      )}

      {loading && posts.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label={t('loading')} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('error.title')}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t('error.retry')}
          </Button>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <FileText className="size-7 text-slate-300 dark:text-slate-600" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {isFiltered ? t('empty.noResults') : t('empty.noPosts')}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {isFiltered ? t('empty.noResultsHint') : t('empty.noPostsHint')}
          </p>
          {isFiltered && (
            <button
              onClick={() => {
                setSearch('')
                setCategoryId(null)
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {t('filters.clearFilters')}
            </button>
          )}
        </div>
      ) : (
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          {posts.filter((p) => !!p.id).map((post) => (
            <PostCard
              key={post.id!}
              post={{
                id: post.id!,
                title: post.title ?? '',
                excerpt: post.excerpt ?? null,
                createdAt: post.createdAt ?? '',
                author: {
                  id: post.author?.id ?? '',
                  name: post.author?.name ?? '',
                  avatarUrl: post.author?.avatarUrl ?? null,
                  role: post.author?.role ?? '',
                },
                categories: (post.categories ?? []).map((c) => ({ id: c?.id ?? '', name: c?.name ?? '' })),
                reactionSummary: (post.reactionSummary ?? []).map((r) => ({
                  emoji: r?.emoji ?? '',
                  count: r?.count ?? 0,
                  userReacted: r?.userReacted ?? false,
                })),
                commentCount: post.commentCount ?? 0,
                images: (post.images ?? []).map((img) => ({
                  id: img?.id ?? '',
                  url: img?.url ?? '',
                  order: img?.order ?? 0,
                })),
              }}
              onClick={() => navigate(`/blog/${post.id}`)}
            />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      {hasMore && loading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label={t('feed.loadingMore')} />
        </div>
      )}
    </div>
  )
}
