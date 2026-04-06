import { useState, useCallback } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_FEED } from '../graphql/blog.queries'

export function useBlogFeed() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)

  const filters = {
    authorId: null,
    status: null,
    ...(search.trim() ? { search: search.trim() } : { search: null }),
    ...(categoryId ? { categoryId } : { categoryId: null }),
  }

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_FEED, {
    variables: { filters, cursor: null, limit: 12 },
  })

  const posts = data?.feed?.items ?? []
  const nextCursor = data?.feed?.nextCursor ?? null
  const hasMore = nextCursor !== null

  const loadMore = useCallback(() => {
    if (!nextCursor || loading) return
    fetchMore({
      variables: { cursor: nextCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        return {
          feed: {
            ...fetchMoreResult.feed,
            items: [...(prev.feed?.items ?? []), ...fetchMoreResult.feed.items],
          },
        }
      },
    })
  }, [nextCursor, loading, fetchMore])

  return {
    posts,
    loading,
    error,
    search,
    categoryId,
    setSearch,
    setCategoryId,
    isFiltered: !!(search.trim() || categoryId),
    refetch,
    hasMore,
    loadMore,
  }
}
