import { useQuery } from '@apollo/client/react'
import { useCallback } from 'react'
import { GET_COMMENTS } from '../graphql/blog.queries'

export function usePaginatedComments(postId: string) {
  const { data, loading, fetchMore } = useQuery(GET_COMMENTS, {
    variables: { postId, cursor: null, limit: 10 },
  })

  const comments = data?.comments?.items ?? []
  const nextCursor = data?.comments?.nextCursor ?? null
  const hasMore = nextCursor !== null

  const loadMore = useCallback(() => {
    if (!nextCursor || loading) return
    fetchMore({
      variables: { cursor: nextCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        return {
          comments: {
            ...fetchMoreResult.comments,
            items: [...(prev.comments?.items ?? []), ...fetchMoreResult.comments.items],
          },
        }
      },
    })
  }, [nextCursor, loading, fetchMore])

  return { comments, loading, hasMore, loadMore }
}
