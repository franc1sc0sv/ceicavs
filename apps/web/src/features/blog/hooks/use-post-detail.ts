import { useQuery } from '@apollo/client/react'
import { GET_POST_BY_ID } from '../graphql/blog.queries'

interface PostDetailData {
  post: {
    id: string
    title: string
    excerpt: string | null
    content: string | null
    status: string
    createdAt: string
    updatedAt: string
    rejectionNote: string | null
    publishedAt: string | null
    author: { id: string; name: string; avatarUrl: string | null; role: string }
    categories: { id: string; name: string }[]
    reactionSummary: { emoji: string; count: number; userReacted: boolean }[]
    images: { id: string; url: string; publicId: string; order: number }[]
    comments: { id: string; text: string; parentId: string | null; depth: number; createdAt: string; author: { id: string; name: string; avatarUrl: string | null; role: string } }[]
  } | null
}

export function usePostDetail(id: string) {
  const { data, loading, error, refetch } = useQuery(GET_POST_BY_ID, {
    variables: { id },
    skip: !id,
  })
  const typed = data as PostDetailData | undefined

  return {
    post: typed?.post ?? null,
    loading,
    error,
    refetch,
  }
}
