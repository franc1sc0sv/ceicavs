import { useQuery } from '@apollo/client/react'
import { graphql } from '@/generated/gql'

const GET_RECORDINGS = graphql(`
  query GetRecordings {
    getRecordings {
      id
      name
      duration
      audioUrl
      transcriptionStatus
      createdAt
    }
  }
`)

export function useRecordings() {
  const { data, loading, refetch } = useQuery(GET_RECORDINGS)
  return { recordings: data?.getRecordings ?? [], loading, refetch }
}
