import { useMutation } from '@apollo/client/react'
import { TOGGLE_REACTION } from '../graphql/blog.mutations'
import { GET_POST_BY_ID } from '../graphql/blog.queries'

export function useReactions(postId: string) {
  const [toggleReaction, { loading }] = useMutation(TOGGLE_REACTION, {
    refetchQueries: [{ query: GET_POST_BY_ID, variables: { id: postId } }],
  })

  return { toggleReaction, loading }
}
