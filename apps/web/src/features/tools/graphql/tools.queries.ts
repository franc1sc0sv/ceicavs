import { graphql } from '@/generated/gql'

export const GET_TOOLS = graphql(`
  query GetTools {
    tools {
      id
      name
      slug
      description
      icon
      color
      category {
        id
        name
        slug
        order
      }
    }
  }
`)
