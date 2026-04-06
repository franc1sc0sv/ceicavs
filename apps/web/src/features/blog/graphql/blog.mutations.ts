import { graphql } from '@/generated/gql'

export const CREATE_POST = graphql(`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      status
    }
  }
`)

export const UPDATE_POST = graphql(`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
    }
  }
`)

export const DELETE_POST = graphql(`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`)

export const REVIEW_DRAFT = graphql(`
  mutation ReviewDraft($id: ID!, $input: ReviewDraftInput!) {
    reviewDraft(id: $id, input: $input) {
      id
      status
    }
  }
`)

export const TOGGLE_REACTION = graphql(`
  mutation ToggleReaction($postId: ID, $commentId: ID, $emoji: String) {
    toggleReaction(postId: $postId, commentId: $commentId, emoji: $emoji) {
      emoji
      count
      userReacted
    }
  }
`)

export const ADD_COMMENT = graphql(`
  mutation AddComment($input: AddCommentInput!) {
    addComment(input: $input) {
      id
      text
      parentId
      depth
      gifUrl
      gifAlt
      createdAt
      author {
        id
        name
        avatarUrl
        role
      }
    }
  }
`)

export const UPDATE_COMMENT = graphql(`
  mutation UpdateComment($id: ID!, $text: String!) {
    updateComment(id: $id, text: $text) {
      id
      text
    }
  }
`)

export const DELETE_COMMENT = graphql(`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`)

export const CREATE_CATEGORY = graphql(`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
    }
  }
`)

export const UPDATE_CATEGORY = graphql(`
  mutation UpdateCategory($id: ID!, $name: String!) {
    updateCategory(id: $id, name: $name) {
      id
      name
    }
  }
`)

export const DELETE_CATEGORY = graphql(`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`)
