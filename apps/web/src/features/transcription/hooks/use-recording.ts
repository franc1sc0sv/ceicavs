import { useQuery } from '@apollo/client/react'
import { graphql } from '@/generated/gql'

const GET_RECORDING = graphql(`
  query GetRecording($input: GetRecordingInput!) {
    getRecording(input: $input) {
      id
      name
      duration
      audioUrl
      transcriptionStatus
      createdAt
      transcription {
        status
        summaryStatus
        summaryError
        fullTranscript
        segments
        summary
        keyTakeaways
        actionItems
        completedAt
      }
    }
  }
`)

export function useRecording(id: string) {
  const { data, loading } = useQuery(GET_RECORDING, {
    variables: { input: { id } },
    skip: !id,
  })
  return { recording: data?.getRecording ?? null, loading }
}

export function useRecordingWithPolling(id: string) {
  const { data, loading } = useQuery(GET_RECORDING, {
    variables: { input: { id } },
    skip: !id,
    pollInterval: 5000,
  })
  const recording = data?.getRecording ?? null
  return { recording, loading }
}
