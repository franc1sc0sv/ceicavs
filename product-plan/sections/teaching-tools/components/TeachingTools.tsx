import { useState } from 'react'
import { Search, Star } from 'lucide-react'
import type { TeachingToolsProps } from '../types'
import { ToolCard, FavoritePill } from './ToolCard'

export function TeachingTools({
  tools,
  categories,
  favorites,
  onSelectTool,
  onToggleFavorite,
  onSearch,
}: TeachingToolsProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const favoritedIds = new Set(favorites.map(f => f.toolId))

  const handleSearch = (q: string) => {
    setSearchQuery(q)
    onSearch?.(q)
  }

  const displayedTools = searchQuery
    ? tools.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tools

  const favoriteTools = tools.filter(t => favoritedIds.has(t.id))
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Herramientas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {tools.length} herramientas disponibles
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" strokeWidth={2} />
        <input
          type="text"
          placeholder="Buscar herramientas…"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Favorites row */}
      {favoriteTools.length > 0 && !searchQuery && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Favoritos
            </h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {favoriteTools.map(tool => (
              <FavoritePill
                key={tool.id}
                tool={tool}
                onSelect={() => onSelectTool?.(tool.id)}
                onRemove={() => onToggleFavorite?.(tool.id)}
              />
            ))}
          </div>
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800" />
        </div>
      )}

      {/* Search results */}
      {searchQuery ? (
        <div>
          {displayedTools.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No se encontraron herramientas para <strong>"{searchQuery}"</strong>
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {displayedTools.length} resultado{displayedTools.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedTools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFavorited={favoritedIds.has(tool.id)}
                    onSelect={() => onSelectTool?.(tool.id)}
                    onToggleFavorite={() => onToggleFavorite?.(tool.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        /* Category sections */
        <div className="space-y-10">
          {sortedCategories.map(cat => {
            const catTools = displayedTools.filter(t => t.categoryId === cat.id)
            if (!catTools.length) return null
            return (
              <section key={cat.id}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {cat.name}
                  </h2>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                  <span className="text-xs text-slate-400 dark:text-slate-600 font-medium">
                    {catTools.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {catTools.map(tool => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isFavorited={favoritedIds.has(tool.id)}
                      onSelect={() => onSelectTool?.(tool.id)}
                      onToggleFavorite={() => onToggleFavorite?.(tool.id)}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
