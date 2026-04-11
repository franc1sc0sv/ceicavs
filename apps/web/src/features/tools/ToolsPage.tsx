import { Search, Star, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { ToolCard } from './components/tool-card'
import { FavoritePill } from './components/favorite-pill'
import { useTools } from './hooks/use-tools'

export default function ToolsPage() {
  const { t } = useTranslation('tools')
  const navigate = useNavigate()
  const { tools, categories, favoriteIds, search, loading, error, setSearch, toggleFavorite } = useTools()

  const favoriteTools = tools.filter((tool) => favoriteIds.has(tool.id))

  if (loading) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" aria-label={t('loading')} />
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-muted-foreground">{t('errorLoading')}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('subtitle', { count: tools.length })}
          </p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={2}
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-9"
          aria-label={t('search')}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label={t('clearSearch')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {favoriteTools.length > 0 && !search && (
        <section aria-label={t('favorites')} className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t('favorites')}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {favoriteTools.map((tool) => (
              <FavoritePill
                key={tool.id}
                tool={tool}
                onSelect={() => navigate(`/tools/${tool.id}`)}
                onRemove={() => toggleFavorite(tool.id)}
              />
            ))}
          </div>
          <div className="mt-6 border-t border-border" />
        </section>
      )}

      {search ? (
        <div>
          {tools.length === 0 ? (
            <div className="py-16 text-center">
              <p className="mb-2 text-3xl" aria-hidden="true">🔍</p>
              <p className="text-sm text-muted-foreground">
                {t('noResults', { query: search })}
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {t('results', { count: tools.length })}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {tools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFavorited={favoriteIds.has(tool.id)}
                    onSelect={() => navigate(`/tools/${tool.id}`)}
                    onToggleFavorite={() => toggleFavorite(tool.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map((category) => {
            const categoryTools = tools.filter((tool) => tool.category.id === category.id)
            if (categoryTools.length === 0) return null
            return (
              <section key={category.id} aria-labelledby={`category-${category.id}`}>
                <div className="mb-4 flex items-center gap-3">
                  <h2
                    id={`category-${category.id}`}
                    className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    {category.name}
                  </h2>
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium text-muted-foreground/60">
                    {categoryTools.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {categoryTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isFavorited={favoriteIds.has(tool.id)}
                      onSelect={() => navigate(`/tools/${tool.id}`)}
                      onToggleFavorite={() => toggleFavorite(tool.id)}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}
