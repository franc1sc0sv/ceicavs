import { graphql } from '@/generated/gql'

export const CREATE_NOTE = graphql(`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      id
      content
      createdAt
      updatedAt
    }
  }
`)

export const UPDATE_NOTE = graphql(`
  mutation UpdateNote($id: ID!, $input: UpdateNoteInput!) {
    updateNote(id: $id, input: $input) {
      id
      content
      updatedAt
    }
  }
`)

export const DELETE_NOTE = graphql(`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`)
