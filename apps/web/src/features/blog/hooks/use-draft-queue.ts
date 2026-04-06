import { useQuery, useMutation } from '@apollo/client/react'
import { GET_DRAFT_QUEUE } from '../graphql/blog.queries'
import { REVIEW_DRAFT } from '../graphql/blog.mutations'

interface DraftQueueData {
  draftQueue: { id: string; title: string; excerpt: string | null; createdAt: string; author: { id: string; name: string; avatarUrl: string | null }; categories: { id: string; name: string }[] }[]
}

export function useDraftQueue() {
  const { data, loading, error, refetch } = useQuery(GET_DRAFT_QUEUE)
  const typed = data as DraftQueueData | undefined

  const [reviewDraft, { loading: reviewing }] = useMutation(REVIEW_DRAFT, {
    refetchQueries: [GET_DRAFT_QUEUE],
  })

  return {
    drafts: typed?.draftQueue ?? [],
    loading,
    error,
    reviewDraft,
    reviewing,
    refetch,
  }
}
