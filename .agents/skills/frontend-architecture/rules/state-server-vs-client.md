---
title: Apollo Cache Is Server State, React Context Is Client State
impact: HIGH
tags: state, apollo, context
---

## Rule

Server data (users, posts, attendance records, grades, groups) flows exclusively through Apollo Client and its normalized cache. Client-only state (dark mode, sidebar open, locale) flows through React context. Never store server data in React context. Never use Apollo local state (`@client` directives or reactive variables) for UI preferences.

## Incorrect

```tsx
// features/blog/context/blog-context.tsx
// BAD: server data stored in React context
interface BlogContextValue {
  posts: Post[];
  loading: boolean;
  fetchPosts: () => Promise<void>;
}

const BlogContext = createContext<BlogContextValue | null>(null);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await client.query({ query: GET_POSTS });
    setPosts(data.posts); // duplicating Apollo cache into React state
    setLoading(false);
  };

  return (
    <BlogContext.Provider value={{ posts, loading, fetchPosts }}>
      {children}
    </BlogContext.Provider>
  );
}
```

## Correct

```tsx
// features/blog/graphql/use-blog-feed.ts
// GOOD: server data via Apollo hook — cache handles deduplication
import { useQuery } from "@apollo/client";
import { GET_BLOG_POSTS } from "./blog.queries";

export function useBlogFeed(sectionId: string) {
  return useQuery(GET_BLOG_POSTS, {
    variables: { sectionId },
  });
}
```

```tsx
// contexts/theme-context.tsx
// GOOD: client-only UI state via React context
interface ThemeContextValue {
  dark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const toggle = () =>
    setDark((prev) => {
      localStorage.setItem("theme", prev ? "light" : "dark");
      return !prev;
    });

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
```

## The Three Contexts in CEICAVS

| Context | Purpose | What It Holds |
|---------|---------|---------------|
| `AuthContext` | Authentication state | Current user, JWT token, login/logout |
| `AbilityContext` | CASL permissions | `AppAbility` instance from `@ceicavs/shared` |
| `ThemeContext` | UI preferences | Dark mode toggle |

Everything else (students, grades, attendance, posts, groups, sections) is server state and lives in the Apollo cache.
