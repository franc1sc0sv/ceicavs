import { graphql } from '@/generated/gql'

export const CREATE_TASK_ITEM = graphql(`
  mutation CreateTaskItem($input: CreateTaskItemInput!) {
    createTaskItem(input: $input) {
      id
      text
      completed
      order
    }
  }
`)

export const UPDATE_TASK_ITEM = graphql(`
  mutation UpdateTaskItem($id: ID!, $input: UpdateTaskItemInput!) {
    updateTaskItem(id: $id, input: $input) {
      id
      text
      completed
    }
  }
`)

export const DELETE_TASK_ITEM = graphql(`
  mutation DeleteTaskItem($id: ID!) {
    deleteTaskItem(id: $id)
  }
`)

export const REORDER_TASK_ITEMS = graphql(`
  mutation ReorderTaskItems($input: ReorderTaskItemsInput!) {
    reorderTaskItems(input: $input)
  }
`)
