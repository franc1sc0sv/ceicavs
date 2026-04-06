# Blog Fullstack — Implementation Plan

## Parallel Execution Strategy

This spec runs in worktrees alongside attendance-fullstack and people-management. Three files will conflict across all three specs and must be handled via sequential merge after all branches complete:

1. **`apps/api/src/app.module.ts`** — each spec registers its module.
2. **`apps/web/src/router/routes.tsx`** — each spec adds route entries.
3. **`apps/web/src/i18n/index.ts`** — each spec registers a namespace.

**Rule**: Do NOT modify these files in the worktree. Instead, leave a `TODO` comment or note in the PR description. A post-merge integration step will add all three modules/routes/namespaces at once.

### GraphQL Codegen

Backend and frontend run in separate worktrees. The frontend won't have the backend's updated `schema.gql` until merge. Workflow:
1. **Frontend branch**: write operations using `graphql()` from `@/generated/gql` against the agreed schema contract. Operations won't be type-checked until codegen runs.
2. **Post-merge**: run `pnpm --filter @ceicavs/web generate` to regenerate typed operations in `src/generated/`.
3. **Do NOT** use `gql` from `@apollo/client` — always use the generated `graphql()` function.

## Context

The CEICAVS school platform needs a complete blog/CMS feature (Wave 5 of the implementation plan). The database schema is already migrated (Post, Category, PostCategory, Reaction, Comment models with soft delete). Product-plan components (PostCard, BlogFeed) are fully designed and styled. Both the NestJS module (`apps/api/src/modules/blog/blog.module.ts`) and the React page (`apps/web/src/features/blog/BlogPage.tsx`) are currently empty stubs.

**Role-based rules:**
- Admin/Teacher: publish posts directly, review draft queue, manage categories, comment, react
- Student: submit drafts for approval, react and comment on published posts
- All authenticated: read published posts

---

## Task 1: Blog API — Module Foundation

Create full vertical slice skeleton before any handler logic.

**`apps/api/src/modules/blog/interfaces/blog.interfaces.ts`**
```typescript
import { PostStatus, EmojiReaction } from '@ceicavs/db/generated/client/enums'

export interface IPost { id: string; title: string; excerpt: string; content: string; coverImageUrl: string | null; status: PostStatus; authorId: string; rejectionNote: string | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null }
export interface ICategory { id: string; name: string; deletedAt: Date | null }
export interface IReaction { id: string; postId: string; userId: string; emoji: EmojiReaction }
export interface IComment { id: string; postId: string; authorId: string; text: string; gifUrl: string | null; gifAlt: string | null; depth: number; parentId: string | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null }
export interface ICreatePostData { title: string; excerpt: string; content: string; coverImageUrl?: string; categoryIds: string[]; publish: boolean }
export interface IUpdatePostData { title?: string; excerpt?: string; content?: string; coverImageUrl?: string; categoryIds?: string[] }
export interface IPostFilters { search?: string; categoryId?: string; status?: PostStatus; authorId?: string }
export interface IReviewDraftData { action: DraftAction; rejectionNote?: string }
export type DraftAction = 'approve' | 'reject'
export interface IReactionSummary { emoji: EmojiReaction; count: number; userReacted: boolean }
```

**`apps/api/src/modules/blog/interfaces/blog.repository.ts`**
Abstract repositories using `RepositoryMethod<[...args], TReturn>`:
- `IPostRepository` — findById, findMany(filters), create, update, softDelete
- `ICategoryRepository` — findAll, findById, create, update, softDelete
- `IReactionRepository` — findByPostAndUser, findSummaryByPost, upsert, delete
- `ICommentRepository` — findByPost, create, update, softDelete

**`apps/api/src/modules/blog/types/`** (GraphQL `@ObjectType` classes):
- `post.type.ts`, `post-preview.type.ts`, `category.type.ts`
- `reaction-summary.type.ts`, `comment.type.ts`, `draft-queue-item.type.ts`

**`apps/api/src/modules/blog/repositories/`** (Prisma implementations):
- `post.repository.ts`, `category.repository.ts`, `reaction.repository.ts`, `comment.repository.ts`
- All methods: `where: { deletedAt: null }` for soft delete filtering

**`apps/api/src/modules/blog/blog.module.ts`**
```typescript
@Module({
  imports: [CqrsModule],
  providers: [
    BlogResolver,
    { provide: IPostRepository, useClass: PostRepository },
    { provide: ICategoryRepository, useClass: CategoryRepository },
    { provide: IReactionRepository, useClass: ReactionRepository },
    { provide: ICommentRepository, useClass: CommentRepository },
    // ...all handlers
  ],
})
export class BlogModule {}
```

---

## Task 2: Blog API — Read Queries

All extend `BaseQueryHandler`, CASL check inside `handle()`.

| Query | File | Returns | Auth |
|---|---|---|---|
| `GetPostsQuery` | `queries/get-posts/` | `IPost[]` filtered by `IPostFilters` | Students see only published; Admin/Teacher see all published |
| `GetPostByIdQuery` | `queries/get-post-by-id/` | `IPost` + reactions summary + comments | Student: only published; Author: own drafts |
| `GetCategoriesQuery` | `queries/get-categories/` | `ICategory[]` | All authenticated |
| `GetDraftQueueQuery` | `queries/get-draft-queue/` | `IPost[]` where status=draft | Admin/Teacher only |
| `GetMyDraftsQuery` | `queries/get-my-drafts/` | `IPost[]` where authorId=userId | Student only, own posts only |

---

## Task 3: Blog API — Post Write Commands

All extend `BaseCommandHandler`, transaction-first, CASL enforced.

| Command | File | Business Logic |
|---|---|---|
| `CreatePostCommand` | `commands/create-post/` | Admin/Teacher -> status=published; Student -> status=draft; creates PostCategory links |
| `UpdatePostCommand` | `commands/update-post/` | Author or Admin only; replaces all PostCategory links |
| `DeletePostCommand` | `commands/delete-post/` | Soft delete; Admin any, author own draft only |
| `ReviewDraftCommand` | `commands/review-draft/` | Admin/Teacher only; action=approve -> published; action=reject -> rejected + rejectionNote |

---

## Task 4: Blog API — Social Commands

| Command | File | Business Logic |
|---|---|---|
| `ToggleReactionCommand` | `commands/toggle-reaction/` | Same emoji -> remove; different emoji -> upsert |
| `AddCommentCommand` | `commands/add-comment/` | Post must be published; parentId must have no parent (max 1 level) |
| `UpdateCommentCommand` | `commands/update-comment/` | Author only |
| `DeleteCommentCommand` | `commands/delete-comment/` | Soft delete; author or Admin |

---

## Task 5: Blog API — Category Commands + Resolver

| Command | Auth |
|---|---|
| `CreateCategoryCommand` | Admin only |
| `UpdateCategoryCommand` | Admin only |
| `DeleteCategoryCommand` | Admin only; soft delete |

**`apps/api/src/modules/blog/resolvers/blog.resolver.ts`** — single resolver with all GraphQL operations:
- Queries: `posts`, `post`, `categories`, `draftQueue`, `myDrafts`
- Mutations: `createPost`, `updatePost`, `deletePost`, `reviewDraft`, `toggleReaction`, `addComment`, `updateComment`, `deleteComment`, `createCategory`, `updateCategory`, `deleteCategory`
- GraphQL `@InputType()` classes with `class-validator` decorators co-located in each command folder

**Register in `apps/api/src/app.module.ts`:** `BlogModule`

---

## Task 6: Frontend — Post Feed Page

**`apps/web/src/features/blog/graphql/queries.ts`**
```typescript
import { graphql } from '@/generated/gql'

export const GET_POSTS = graphql(`
  query GetPosts($filters: PostFiltersInput) {
  posts(filters: $filters) {
    id title excerpt coverImageUrl status createdAt
    author { id name avatarUrl role }
    categories { id name }
    reactionSummary { emoji count userReacted }
    commentCount
  }
}
`)

export const GET_CATEGORIES = graphql(`
  query GetCategories { categories { id name } }
`)
```

**`apps/web/src/features/blog/hooks/useBlogFeed.ts`**
Encapsulates `GET_POSTS` + `GET_CATEGORIES` + local filter state (search string, selected categoryId).

**`apps/web/src/features/blog/BlogPage.tsx`**
- Four-state rendering: loading -> error -> empty -> grid
- Integrates `BlogFeed` from `product-plan/sections/blog/components/BlogFeed.tsx`
- Passes `onPostClick(id)` -> `navigate('/blog/:id')`
- `ability.can(Action.CREATE, Subject.POST)` -> show "+ Nuevo articulo" button -> `navigate('/blog/new')`

---

## Task 7: Frontend — Post Detail Page

**`apps/web/src/features/blog/pages/PostDetailPage.tsx`**
- Route: `/blog/:id`
- `useQuery(GET_POST_BY_ID, { variables: { id } })`
- Four-state rendering
- Renders: cover image, category badge, title, author chip with role badge, rich HTML content
- Back button -> `navigate(-1)`; Edit button (if `ability.can(Action.UPDATE, Subject.POST)`) -> `/blog/:id/edit`

**`apps/web/src/features/blog/components/ReactionBar.tsx`**
- 5 emoji buttons with counts
- Highlighted if `userReacted`; `useMutation(TOGGLE_REACTION)` on click

**`apps/web/src/features/blog/components/CommentList.tsx`**
- Flat list of top-level comments; replies indented (1 level)
- Each comment has Responder button that opens inline `CommentForm`

**`apps/web/src/features/blog/components/CommentForm.tsx`**
- Textarea + submit; `useMutation(ADD_COMMENT)` with optional `parentId`

**GraphQL additions in `queries.ts`:**
```typescript
export const GET_POST_BY_ID = graphql(`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id title excerpt content coverImageUrl status createdAt updatedAt
      author { id name avatarUrl role }
      categories { id name }
      reactionSummary { emoji count userReacted }
      comments {
        id text parentId createdAt updatedAt
        author { id name avatarUrl role }
        replies { id text createdAt author { id name avatarUrl role } }
      }
    }
  }
`)
```

---

## Task 8: Frontend — Create/Edit Post Form

**`apps/web/src/features/blog/pages/CreatePostPage.tsx`** (route: `/blog/new`)
- Form: title, excerpt, categories (multi-select chips from `GET_CATEGORIES`), coverImageUrl, rich text content (Tiptap)
- Admin/Teacher: submit button says `t('actions.publish')` -> `publish: true`
- Student: submit button says `t('actions.submitForReview')` -> `publish: false`
- Secondary: `t('actions.saveDraft')` -> `publish: false` for all roles
- On success: navigate to post detail (published) or my drafts (draft)

**`apps/web/src/features/blog/pages/EditPostPage.tsx`** (route: `/blog/:id/edit`)
- Pre-populate form via `GET_POST_BY_ID`
- `useMutation(UPDATE_POST)` on submit

**`apps/web/src/features/blog/graphql/mutations.ts`**
```typescript
import { graphql } from '@/generated/gql'

export const CREATE_POST = graphql(`
  mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { id status } }
`)
export const UPDATE_POST = graphql(`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) { updatePost(id: $id, input: $input) { id } }
`)
export const DELETE_POST = graphql(`
  mutation DeletePost($id: ID!) { deletePost(id: $id) }
`)
export const TOGGLE_REACTION = graphql(`
  mutation ToggleReaction($postId: ID!, $emoji: EmojiReaction!) { toggleReaction(postId: $postId, emoji: $emoji) { emoji count userReacted } }
`)
export const ADD_COMMENT = graphql(`
  mutation AddComment($input: AddCommentInput!) { addComment(input: $input) { id text parentId createdAt author { id name avatarUrl role } } }
`)
export const UPDATE_COMMENT = graphql(`
  mutation UpdateComment($id: ID!, $text: String!) { updateComment(id: $id, text: $text) { id text } }
`)
export const DELETE_COMMENT = graphql(`
  mutation DeleteComment($id: ID!) { deleteComment(id: $id) }
`)
```

---

## Task 9: Frontend — Draft Workflow UI

**`apps/web/src/features/blog/pages/DraftQueuePage.tsx`** (route: `/blog/queue`, guard: Admin/Teacher)
- `useQuery(GET_DRAFT_QUEUE)` -> list of pending draft cards
- Each card: title, author, date, excerpt; Approve button + Reject button
- Reject opens shadcn Dialog with `rejectionNote` textarea -> `useMutation(REVIEW_DRAFT, { action: 'reject', rejectionNote })`
- Approve -> `useMutation(REVIEW_DRAFT, { action: 'approve' })`

**`apps/web/src/features/blog/pages/MyDraftsPage.tsx`** (route: `/blog/drafts`, guard: Student)
- `useQuery(GET_MY_DRAFTS)` -> own posts with all statuses
- Status badge: published=green, draft=slate, rejected=red
- Rejected posts show `rejectionNote` in amber callout
- Edit button on draft and rejected posts -> `/blog/:id/edit`
- `t('actions.submitForReview')` button on saved drafts

**GraphQL additions in `queries.ts`:**
```typescript
export const GET_DRAFT_QUEUE = graphql(`
  query GetDraftQueue { draftQueue { id title excerpt createdAt author { id name avatarUrl } categories { id name } } }
`)
export const GET_MY_DRAFTS = graphql(`
  query GetMyDrafts { myDrafts { id title status rejectionNote createdAt updatedAt categories { id name } } }
`)
```

**Additions to `mutations.ts`:**
```typescript
export const REVIEW_DRAFT = graphql(`
  mutation ReviewDraft($id: ID!, $input: ReviewDraftInput!) { reviewDraft(id: $id, input: $input) { id status } }
`)
```

---

## Task 10: Frontend — Category Management + Routing

**`apps/web/src/features/blog/pages/CategoryManagementPage.tsx`** (route: `/blog/categories`, guard: Admin)
- `useQuery(GET_CATEGORIES)` -> table with name, post count, edit/delete actions
- Inline edit: click edit -> input field in-row -> `useMutation(UPDATE_CATEGORY)`
- Delete: confirmation Dialog -> `useMutation(DELETE_CATEGORY)`
- Create form at bottom: name input + `t('actions.add')` button -> `useMutation(CREATE_CATEGORY)`

**Additions to `mutations.ts`:**
```typescript
export const CREATE_CATEGORY = graphql(`
  mutation CreateCategory($name: String!) { createCategory(name: $name) { id name } }
`)
export const UPDATE_CATEGORY = graphql(`
  mutation UpdateCategory($id: ID!, $name: String!) { updateCategory(id: $id, name: $name) { id name } }
`)
export const DELETE_CATEGORY = graphql(`
  mutation DeleteCategory($id: ID!) { deleteCategory(id: $id) }
`)
```

**`apps/web/src/router/` — add blog routes:**
```
/blog                -> BlogPage (lazy)
/blog/new            -> CreatePostPage (lazy, guard: authenticated)
/blog/queue          -> DraftQueuePage (lazy, guard: Admin/Teacher)
/blog/drafts         -> MyDraftsPage (lazy, guard: Student)
/blog/categories     -> CategoryManagementPage (lazy, guard: Admin)
/blog/:id            -> PostDetailPage (lazy)
/blog/:id/edit       -> EditPostPage (lazy, guard: author or Admin)
```

Note: `/blog/new`, `/blog/queue`, `/blog/drafts`, `/blog/categories` must be registered **before** `/blog/:id` to avoid param capture.

---

## i18n

`apps/web/src/i18n/es/blog.json`:
```json
{
  "title": "Blog",
  "newPost": "+ Nuevo artículo",
  "actions": {
    "publish": "Publicar",
    "submitForReview": "Enviar a revisión",
    "saveDraft": "Guardar borrador",
    "edit": "Editar",
    "delete": "Eliminar",
    "add": "Agregar",
    "reply": "Responder",
    "approve": "Aprobar",
    "reject": "Rechazar"
  },
  "pages": {
    "feed": "Publicaciones",
    "detail": "Detalle",
    "create": "Nuevo artículo",
    "edit": "Editar artículo",
    "drafts": "Mis borradores",
    "queue": "Cola de moderación",
    "categories": "Gestión de categorías"
  },
  "status": {
    "published": "Publicado",
    "draft": "Borrador",
    "rejected": "Rechazado"
  },
  "drafts": {
    "rejectionNote": "Nota de rechazo",
    "rejectDialog": { "title": "Rechazar borrador", "placeholder": "Razón del rechazo..." }
  },
  "categories": {
    "name": "Nombre",
    "postCount": "Publicaciones",
    "addCategory": "Agregar categoría"
  },
  "comments": {
    "title": "Comentarios",
    "placeholder": "Escribe un comentario...",
    "reply": "Responder"
  },
  "empty": {
    "noPosts": "No hay publicaciones todavía",
    "noDrafts": "No tienes borradores",
    "noComments": "Sé el primero en comentar"
  },
  "filters": {
    "search": "Buscar publicaciones...",
    "allCategories": "Todas las categorías"
  }
}
```

`apps/web/src/i18n/en/blog.json` — English equivalents with same key structure.

All code in this spec MUST use `const { t } = useTranslation('blog')` — never hardcoded Spanish strings.

---

## Critical Files

| File | Status | Action |
|---|---|---|
| `apps/api/src/modules/blog/blog.module.ts` | Empty stub | Replace |
| `apps/web/src/features/blog/BlogPage.tsx` | Empty stub | Replace |
| `packages/db/prisma/schema.prisma` | Complete | Read-only reference |
| `apps/api/src/common/cqrs/base-command.handler.ts` | Complete | Extend in all command handlers |
| `apps/api/src/common/cqrs/base-query.handler.ts` | Complete | Extend in all query handlers |
| `apps/api/src/common/cqrs/types.ts` | Complete | Import `RepositoryMethod`, `TxClient`, `IBaseRepository` |
| `product-plan/sections/blog/components/BlogFeed.tsx` | Complete | Import in BlogPage |
| `product-plan/sections/blog/components/PostCard.tsx` | Complete | Used by BlogFeed |
| `apps/api/src/modules/blog/` | New | Create all files |
| `apps/web/src/features/blog/` | New | Create all files |

---

## Verification

1. `pnpm --filter @ceicavs/api typecheck` — zero errors
2. After backend merge: `pnpm --filter @ceicavs/web generate` — regenerates typed operations from `schema.gql`
3. `pnpm --filter @ceicavs/web typecheck` — zero errors
4. **E2E flow:**
   - Login as Admin -> create post -> verify appears in feed with categories
   - Login as Student -> submit draft -> login as Teacher -> approve -> verify published
   - Login as Student -> submit draft -> Teacher rejects with note -> Student sees rejection note in My Drafts
   - Add reaction to post -> verify count updates; toggle same emoji removes it
   - Add top-level comment -> add reply -> verify 1-level threading
   - Admin creates/edits/deletes category -> verify soft delete
4. **GraphQL Playground:** query `posts`, `post(id)`, `categories`, `draftQueue`, `myDrafts`
