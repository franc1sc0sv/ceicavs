---
title: Wrap Apollo Operations in Custom Hooks
impact: HIGH
tags: graphql, apollo, hooks
---

## Rule

Never call `useQuery` or `useMutation` directly in components. Wrap every Apollo operation in a feature-specific custom hook (e.g., `useAttendanceGroups`, `useSubmitAttendance`). The hook handles typing, variables, and data transformation. Components stay clean and decoupled from Apollo internals.

## Incorrect

Calling `useQuery` directly inside a page component:

```typescript
// features/blog/pages/BlogFeedPage.tsx -- WRONG
import { useQuery } from "@apollo/client";
import { GET_BLOG_POSTS } from "../graphql/blog.queries";
import type { BlogPost } from "../types";

export function BlogFeedPage({ categoryId }: { categoryId: string }) {
  const { data, loading, error } = useQuery(GET_BLOG_POSTS, {
    variables: { categoryId, limit: 20 },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error.message} />;

  // Component now knows about Apollo's response shape
  const posts: BlogPost[] = data?.blogPosts?.edges.map(
    (edge: { node: BlogPost }) => edge.node
  ) ?? [];

  return <BlogPostList posts={posts} />;
}
```

Problems: the component is coupled to Apollo's response structure, the transformation logic is not reusable, and testing requires mocking Apollo internals.

## Correct

### Query hook with data transformation

```typescript
// features/blog/hooks/useBlogFeed.ts
import { useQuery } from "@apollo/client";
import { GET_BLOG_POSTS } from "../graphql/blog.queries";
import type { BlogPost, GetBlogPostsQuery } from "../types";

interface UseBlogFeedResult {
  posts: BlogPost[];
  loading: boolean;
  error: Error | undefined;
  hasMore: boolean;
  fetchMore: () => void;
}

export function useBlogFeed(categoryId: string): UseBlogFeedResult {
  const { data, loading, error, fetchMore } = useQuery<GetBlogPostsQuery>(
    GET_BLOG_POSTS,
    {
      variables: { categoryId, limit: 20 },
    }
  );

  const posts: BlogPost[] =
    data?.blogPosts?.edges.map((edge) => edge.node) ?? [];
  const hasMore = data?.blogPosts?.pageInfo.hasNextPage ?? false;

  return {
    posts,
    loading,
    error,
    hasMore,
    fetchMore: () =>
      fetchMore({
        variables: { cursor: data?.blogPosts?.pageInfo.endCursor },
      }),
  };
}
```

### Clean component consuming the hook

```typescript
// features/blog/pages/BlogFeedPage.tsx
import { useBlogFeed } from "../hooks/useBlogFeed";

export function BlogFeedPage({ categoryId }: { categoryId: string }) {
  const { posts, loading, error, hasMore, fetchMore } =
    useBlogFeed(categoryId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error.message} />;

  return <BlogPostList posts={posts} hasMore={hasMore} onLoadMore={fetchMore} />;
}
```

### Mutation hook with clean return type

```typescript
// features/attendance/hooks/useSubmitAttendance.ts
import { useMutation } from "@apollo/client";
import { SUBMIT_ATTENDANCE } from "../graphql/attendance.mutations";
import { GET_ATTENDANCE_GROUPS } from "../graphql/attendance.queries";
import type {
  SubmitAttendanceMutation,
  SubmitAttendanceInput,
} from "../types";

interface UseSubmitAttendanceResult {
  submitAttendance: (input: SubmitAttendanceInput) => Promise<void>;
  loading: boolean;
}

export function useSubmitAttendance(
  groupId: string
): UseSubmitAttendanceResult {
  const [mutate, { loading }] = useMutation<SubmitAttendanceMutation>(
    SUBMIT_ATTENDANCE,
    {
      refetchQueries: [
        { query: GET_ATTENDANCE_GROUPS, variables: { groupId } },
      ],
    }
  );

  const submitAttendance = async (input: SubmitAttendanceInput) => {
    await mutate({ variables: { input } });
  };

  return { submitAttendance, loading };
}
```

### Component using the mutation hook

```typescript
// features/attendance/components/AttendanceForm.tsx
import { useSubmitAttendance } from "../hooks/useSubmitAttendance";
import type { SubmitAttendanceInput } from "../types";

export function AttendanceForm({ groupId }: { groupId: string }) {
  const { submitAttendance, loading } = useSubmitAttendance(groupId);

  const handleSubmit = async (entries: SubmitAttendanceInput) => {
    await submitAttendance(entries);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar Asistencia"}
      </button>
    </form>
  );
}
```

## Why

- **Testability**: hooks can be unit-tested without rendering components or mocking Apollo Provider.
- **Reuse**: multiple components can call the same hook without duplicating query logic.
- **Encapsulation**: Apollo response shapes, cache updates, and refetch logic stay hidden from the UI layer.
- **Type safety**: the hook defines a clean return interface instead of leaking Apollo's generic types into components.
