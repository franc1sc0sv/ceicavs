import { useState, useMemo } from 'react'
import { TOOLS, CATEGORIES, type Tool, type ToolCategory } from '../data/tools-data'

const FAVORITES_KEY = 'ceicavs-tool-favorites'

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

export interface UseToolsResult {
  tools: Tool[]
  categories: ToolCategory[]
  favoriteIds: Set<string>
  search: string
  setSearch: (q: string) => void
  toggleFavorite: (toolId: string) => void
}

export function useTools(): UseToolsResult {
  const [search, setSearch] = useState('')
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(loadFavorites)

  const tools = useMemo(() => {
    if (!search.trim()) return TOOLS
    const q = search.toLowerCase()
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    )
  }, [search])

  function toggleFavorite(toolId: string): void {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(toolId)) {
        next.delete(toolId)
      } else {
        next.add(toolId)
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]))
      return next
    })
  }

  return {
    tools,
    categories: CATEGORIES,
    favoriteIds,
    search,
    setSearch,
    toggleFavorite,
  }
}
