import { graphql } from '@/generated/gql'

export const GET_POSTS = graphql(`
  query GetPosts($filters: PostFiltersInput) {
    posts(filters: $filters) {
      id
      title
      excerpt
      status
      createdAt
      author {
        id
        name
        avatarUrl
        role
      }
      categories {
        id
        name
      }
      reactionSummary {
        emoji
        count
        userReacted
      }
      commentCount
    }
  }
`)

export const GET_POST_BY_ID = graphql(`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      title
      excerpt
      content
      status
      createdAt
      updatedAt
      rejectionNote
      publishedAt
      author {
        id
        name
        avatarUrl
        role
      }
      categories {
        id
        name
      }
      reactionSummary {
        emoji
        count
        userReacted
      }
      images {
        id
        url
        publicId
        order
      }
    }
  }
`)

export const GET_CATEGORIES = graphql(`
  query GetCategories {
    categories {
      id
      name
    }
  }
`)

export const GET_DRAFT_QUEUE = graphql(`
  query GetDraftQueue {
    draftQueue {
      id
      title
      excerpt
      createdAt
      author {
        id
        name
        avatarUrl
      }
      categories {
        id
        name
      }
    }
  }
`)

export const GET_MY_DRAFTS = graphql(`
  query GetMyDrafts {
    myDrafts {
      id
      title
      status
      rejectionNote
      createdAt
      updatedAt
      categories {
        id
        name
      }
    }
  }
`)

export const GET_FEED = graphql(`
  query GetFeed($filters: PostFiltersInput, $cursor: String, $limit: Int) {
    feed(filters: $filters, cursor: $cursor, limit: $limit) {
      items {
        id
        title
        excerpt
        status
        createdAt
        publishedAt
        authorId
        author {
          id
          name
          avatarUrl
          role
        }
        categories {
          id
          name
        }
        reactionSummary {
          emoji
          count
          userReacted
        }
        commentCount
        images {
          id
          url
          publicId
          order
        }
      }
      nextCursor
    }
  }
`)

export const GET_COMMENTS = graphql(`
  query GetComments($postId: ID!, $cursor: String, $limit: Int) {
    comments(postId: $postId, cursor: $cursor, limit: $limit) {
      items {
        id
        text
        parentId
        postId
        depth
        gifUrl
        gifAlt
        replyCount
        reactionSummary {
          emoji
          count
          userReacted
        }
        createdAt
        updatedAt
        author {
          id
          name
          avatarUrl
          role
        }
      }
      nextCursor
    }
  }
`)

export const GET_REPLIES = graphql(`
  query GetReplies($parentId: ID!, $cursor: String, $limit: Int) {
    replies(parentId: $parentId, cursor: $cursor, limit: $limit) {
      items {
        id
        text
        parentId
        postId
        depth
        gifUrl
        gifAlt
        replyCount
        reactionSummary {
          emoji
          count
          userReacted
        }
        createdAt
        updatedAt
        author {
          id
          name
          avatarUrl
          role
        }
      }
      nextCursor
    }
  }
`)
