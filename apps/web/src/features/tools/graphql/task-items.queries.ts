import { graphql } from '@/generated/gql'

export const GET_TASK_ITEMS = graphql(`
  query GetTaskItems {
    taskItems {
      id
      text
      completed
      order
      createdAt
      updatedAt
    }
  }
`)
