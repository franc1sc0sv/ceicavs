import { useQuery } from '@apollo/client/react'
import { GET_MY_DRAFTS } from '../graphql/blog.queries'

interface MyDraftsData {
  myDrafts: { id: string; title: string; status: string; rejectionNote: string | null; createdAt: string; updatedAt: string; categories: { id: string; name: string }[] }[]
}

export function useMyDrafts() {
  const { data, loading, error, refetch } = useQuery(GET_MY_DRAFTS)
  const typed = data as MyDraftsData | undefined

  return {
    drafts: typed?.myDrafts ?? [],
    loading,
    error,
    refetch,
  }
}
