import { graphql } from '@/generated/gql'

export const GET_NOTES = graphql(`
  query GetNotes {
    notes {
      id
      content
      createdAt
      updatedAt
    }
  }
`)
