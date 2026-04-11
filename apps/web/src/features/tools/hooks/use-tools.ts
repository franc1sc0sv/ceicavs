import { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import type { ToolCategoryType, ToolType } from '@/generated/graphql'
import { GET_TOOLS } from '../graphql/tools.queries'

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
  tools: ToolType[]
  categories: ToolCategoryType[]
  favoriteIds: Set<string>
  search: string
  loading: boolean
  error: boolean
  setSearch: (q: string) => void
  toggleFavorite: (toolId: string) => void
}

export function useTools(): UseToolsResult {
  const [search, setSearch] = useState('')
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(loadFavorites)

  const { data, loading, error } = useQuery(GET_TOOLS)

  const allTools: ToolType[] = data?.tools ?? []

  const categories = useMemo<ToolCategoryType[]>(() => {
    const seen = new Set<string>()
    const result: ToolCategoryType[] = []
    for (const tool of allTools) {
      if (!seen.has(tool.category.id)) {
        seen.add(tool.category.id)
        result.push(tool.category)
      }
    }
    return result.sort((a, b) => a.order - b.order)
  }, [allTools])

  const tools = useMemo<ToolType[]>(() => {
    if (!search.trim()) return allTools
    const q = search.toLowerCase()
    return allTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q),
    )
  }, [search, allTools])

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
    categories,
    favoriteIds,
    search,
    loading,
    error: !!error,
    setSearch,
    toggleFavorite,
  }
}
