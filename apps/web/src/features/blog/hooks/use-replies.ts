import { useQuery } from '@apollo/client/react'
import { useCallback, useState } from 'react'
import { GET_REPLIES } from '../graphql/blog.queries'

export function useReplies(parentId: string) {
  const [activated, setActivated] = useState(false)

  const { data, loading, fetchMore } = useQuery(GET_REPLIES, {
    variables: { parentId, cursor: null, limit: 5 },
    skip: !activated,
  })

  const replies = data?.replies?.items ?? []
  const nextCursor = data?.replies?.nextCursor ?? null
  const hasMore = nextCursor !== null

  const activate = useCallback(() => setActivated(true), [])

  const loadMore = useCallback(() => {
    if (!nextCursor || loading) return
    fetchMore({
      variables: { cursor: nextCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        return {
          replies: {
            ...fetchMoreResult.replies,
            items: [...(prev.replies?.items ?? []), ...fetchMoreResult.replies.items],
          },
        }
      },
    })
  }, [nextCursor, loading, fetchMore])

  return { replies, loading, hasMore, loadMore, activated, activate }
}
