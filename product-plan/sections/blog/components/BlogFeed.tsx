'use client'

import { useState, useMemo } from 'react'
import type { BlogFeedProps } from '../types'
import { PostCard } from './PostCard'

export function BlogFeed({
  posts,
  categories,
  searchQuery: initialSearch = '',
  selectedBlogCategoryId: initialCategory = null,
  onSearch,
  onBlogCategoryFilter,
  onPostClick,
  onNewPost,
}: BlogFeedProps) {
  const [search, setSearch]       = useState(initialSearch)
  const [categoryId, setCategoryId] = useState<string | null>(initialCategory ?? null)

  function handleSearch(q: string) {
    setSearch(q)
    onSearch?.(q)
  }

  function handleCategory(id: string | null) {
    setCategoryId(id)
    onBlogCategoryFilter?.(id)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return posts.filter(p => {
      if (q && !p.title.toLowerCase().includes(q) && !p.excerpt.toLowerCase().includes(q)) return false
      if (categoryId && !p.categories.some(c => c.id === categoryId)) return false
      return true
    })
  }, [posts, search, categoryId])

  const isFiltered = !!(search.trim() || categoryId)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Blog
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              {posts.length} {posts.length === 1 ? 'publicación' : 'publicaciones'}
            </p>
          </div>

          {onNewPost && (
            <button
              onClick={onNewPost}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40 transition-all shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Nuevo post</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          )}
        </div>

        {/* ── Search ── */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Buscar publicaciones..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Category chips ── */}
        <div className="flex items-center gap-1.5 flex-wrap mb-5">
          <button
            onClick={() => handleCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !categoryId
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id === categoryId ? null : cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryId === cat.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              {cat.name}
              <span className={`ml-1.5 tabular-nums ${categoryId === cat.id ? 'opacity-80' : 'text-slate-400 dark:text-slate-500'}`}>
                {cat.postCount}
              </span>
            </button>
          ))}
        </div>

        {/* ── Result hint ── */}
        {isFiltered && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
            </span>
            <button
              onClick={() => { handleSearch(''); handleCategory(null) }}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* ── Feed ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {isFiltered ? 'No se encontraron publicaciones' : 'Aún no hay publicaciones'}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {isFiltered
                ? 'Intenta con otros términos o categorías'
                : 'Sé el primero en compartir algo con la comunidad'}
            </p>
            {isFiltered && (
              <button
                onClick={() => { handleSearch(''); handleCategory(null) }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
              >
                Ver todas las publicaciones
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => onPostClick?.(post.id)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
