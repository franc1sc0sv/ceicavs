# Blog Tests

## Overview

Tests verify that the Blog section renders the post feed with search and filtering, opens the full immersive reading view with reactions and threaded comments, handles the rich text editor and post creation flow, manages the draft approval queue, and correctly enforces role-based behaviors across admin, teacher, and student views.

---

## User Flow Tests

### Flow 1: User browses and reads a post

**Success Path**

1. Render `BlogFeed` with 5 `PostPreview` items and 3 categories
2. - [ ] 5 `PostCard` components are rendered in a vertical scrollable list
3. - [ ] Each card shows: title, excerpt (first ~2 lines), author avatar + name, date, category badge, and reaction summary (top 3 emojis with counts)
4. - [ ] The search bar and category selector are visible at the top
5. Type "Science" into the search bar
6. - [ ] `onSearch` is called with `"Science"`
7. Select the "School Events" category from the category selector
8. - [ ] `onBlogCategoryFilter` is called with the category's ID
9. Click on a post card titled "Science Fair Results"
10. - [ ] `onPostClick` is called with the post's ID
11. Re-render with `selectedPost` and `comments` data
12. - [ ] The immersive reading view shows the full post content, author info, and emoji reaction bar
13. - [ ] The comments section displays below the post with threaded replies
14. Click the "Back" button
15. - [ ] `onBack` is called to return to the feed

**Failure Path**

1. Render `BlogFeed` with an empty `posts` array
2. - [ ] An empty state message is shown (e.g., "No posts yet. Be the first to publish!")
3. - [ ] The search bar and category selector are still visible

### Flow 2: User interacts with reactions and comments

**Success Path**

1. Open a post detail view with 3 existing reactions and 2 comments
2. - [ ] Reaction bar shows available emojis with counts; emojis the user has reacted to are highlighted
3. Click the "love" emoji reaction
4. - [ ] `onReact` is called with `"love"`
5. Type "Great post!" in the comment input and click "Comment"
6. - [ ] `onComment` is called with `("Great post!", undefined)`
7. Click the GIF button in the comment composer
8. - [ ] A GIPHY search overlay appears
9. Type "applause" in the GIF search and select a GIF
10. - [ ] The selected GIF is attached to the comment preview
11. Submit the comment with the attached GIF
12. - [ ] `onComment` is called with the text and a `GifAttachment` object
13. Click "Reply" on an existing comment
14. Type "I agree!" and submit
15. - [ ] `onReply` is called with `(commentId, "I agree!", undefined)`
16. Click "Reply" on a reply (to create a sub-reply)
17. Type "Me too!" and submit
18. - [ ] `onSubReply` is called with `(commentId, replyId, "Me too!", undefined)`

**Failure Path**

1. Try to submit a comment with empty text and no GIF
2. - [ ] The submit button is disabled or a validation message appears
3. - [ ] `onComment` is NOT called

### Flow 3: Admin/Teacher publishes a new post

**Success Path**

1. Render with `role="teacher"` and click "New Post"
2. - [ ] `onNewPost` is called
3. - [ ] The rich text editor opens with a toolbar (bold, italic, headings, lists, links, image upload, code blocks, tables, embeds, divider)
4. Enter a title, write content using the editor, select a category
5. Click "Publish"
6. - [ ] The post is published directly (no draft queue for teachers)

**Failure Path**

1. Try to publish a post with an empty title
2. - [ ] A validation error is shown (e.g., "Title is required")
3. - [ ] The post is NOT published

### Flow 4: Student submits a draft and admin approves it

**Success Path**

1. Render with `role="student"` and click "New Draft"
2. - [ ] `onNewPost` is called
3. - [ ] The button label says "New Draft" (not "New Post") for students
4. - [ ] The editor opens with a "Submit Draft" button (not "Publish")
5. Switch to admin view — render the pending drafts queue with 3 drafts
6. - [ ] Each draft shows author name, title, submission date
7. Click on a draft to review it
8. - [ ] `onDraftClick` is called with the draft's ID
9. - [ ] The draft content is displayed with "Approve" and "Reject" buttons
10. Click "Approve"
11. - [ ] `onApproveDraft` is called with the draft's ID
12. Alternatively, click "Reject" and enter a rejection note
13. - [ ] `onRejectDraft` is called with `(draftId, "Please revise the introduction")`

**Failure Path**

1. Render the pending drafts queue with an empty `drafts` array
2. - [ ] An empty state is shown (e.g., "No pending drafts to review")

---

## Empty State Tests

- [ ] When `posts` is empty, the feed shows "No posts yet" message
- [ ] When `comments` is empty on a post detail, the comments section shows "No comments yet. Start the conversation!"
- [ ] When `drafts` is empty in the student's "My Drafts" view, a message is shown (e.g., "You haven't submitted any drafts yet")
- [ ] When `drafts` is empty in the admin/teacher queue, a message is shown (e.g., "No pending drafts to review")
- [ ] When category filter returns no results, a message is shown (e.g., "No posts in this category")

---

## Component Interaction Tests

- [ ] `PostCard` shows the cover image if `coverImageUrl` is provided, otherwise hides the image area
- [ ] Category badges on post cards are clickable and trigger `onBlogCategoryFilter`
- [ ] Reaction summary on `PostCard` shows the top 3 emojis by count
- [ ] Comment threading indents replies one level and sub-replies two levels
- [ ] No reply button is shown on sub-replies (max depth reached)
- [ ] The GIF search overlay filters results as the user types (TikTok-style instant search)
- [ ] Draft status badges use correct colors: pending = amber, approved = green, rejected = red
- [ ] The rich text editor toolbar buttons correctly format content (bold, italic, headings, etc.)
- [ ] Admin can see "Edit" and "Delete" buttons on any post; teacher sees them only on their own posts
- [ ] Students do NOT see "Edit" or "Delete" on any posts

---

## Edge Cases

- [ ] A post with no reactions shows an empty reaction bar (no counts)
- [ ] A post with 100+ comments loads without performance issues
- [ ] A comment with only a GIF (no text) is allowed and renders correctly
- [ ] Very long post titles wrap properly on both the feed card and detail view
- [ ] Rich text content with all formatting types (headings, lists, code, tables, images, embeds) renders correctly in the reading view
- [ ] Searching with special characters does not crash the filter
- [ ] A draft with a very long rejection note displays the full note or truncates with "Show more"
- [ ] Category with 0 posts still appears in the category selector
- [ ] Multiple rapid reaction clicks do not cause duplicate calls

---

## Accessibility Checks

- [ ] The emoji reaction bar is keyboard-accessible (Tab to navigate, Enter/Space to toggle)
- [ ] Each reaction emoji has an accessible label (e.g., "Love reaction, 5 reactions, you reacted")
- [ ] Comment reply threading uses proper heading levels or ARIA landmarks for structure
- [ ] The GIF search overlay is keyboard-navigable and GIFs have alt text
- [ ] The rich text editor toolbar buttons have accessible labels
- [ ] Post cards are keyboard-focusable and activatable with Enter
- [ ] Draft status badges include text labels alongside color indicators
- [ ] The "Back" button has a descriptive label (e.g., "Back to feed")

---

## Sample Test Data

```typescript
import type {
  PostPreview,
  PostDetail,
  Comment,
  CommentReply,
  Draft,
  BlogCategory,
  Author,
  ReactionSummary,
  GifAttachment,
} from "./types";

const mockCategories: BlogCategory[] = [
  { id: "cat-1", name: "School Events", postCount: 12 },
  { id: "cat-2", name: "Sports", postCount: 8 },
  { id: "cat-3", name: "Science", postCount: 5 },
  { id: "cat-4", name: "Creative Writing", postCount: 15 },
];

const mockAuthor: Author = {
  id: "author-1",
  name: "Prof. Ana Lopez",
  role: "teacher",
  avatarUrl: "https://example.com/avatar-ana.jpg",
};

const mockReactions: ReactionSummary[] = [
  { emoji: "like", count: 12, userReacted: false },
  { emoji: "love", count: 8, userReacted: true },
  { emoji: "insightful", count: 3, userReacted: false },
];

const mockPosts: PostPreview[] = [
  {
    id: "post-1",
    title: "Science Fair Results",
    excerpt: "This year's science fair was a huge success with over 40 projects presented by students from all grades...",
    coverImageUrl: "https://example.com/science-fair.jpg",
    author: mockAuthor,
    categories: [mockCategories[0], mockCategories[2]],
    reactions: mockReactions,
    commentCount: 7,
    publishedAt: "2026-03-28T07:15:00Z",
  },
  {
    id: "post-2",
    title: "Sports Day Recap",
    excerpt: "An exciting day of competition and sportsmanship as our students competed across six different events...",
    author: { id: "author-2", name: "Coach Garcia", role: "teacher" },
    categories: [mockCategories[1]],
    reactions: [{ emoji: "celebrate", count: 20, userReacted: true }],
    commentCount: 15,
    publishedAt: "2026-03-27T16:00:00Z",
  },
];

const mockPostDetail: PostDetail = {
  id: "post-1",
  title: "Science Fair Results",
  content: "<h2>A Year of Innovation</h2><p>This year's science fair was a huge success...</p>",
  coverImageUrl: "https://example.com/science-fair.jpg",
  author: mockAuthor,
  categories: [mockCategories[0], mockCategories[2]],
  reactions: mockReactions,
  publishedAt: "2026-03-28T07:15:00Z",
};

const mockGif: GifAttachment = {
  id: "gif-1",
  url: "https://media.giphy.com/media/example/giphy.gif",
  alt: "Applause",
  width: 480,
  height: 270,
};

const mockComments: Comment[] = [
  {
    id: "c1",
    author: { id: "u3", name: "Maria Fernandez", role: "student" },
    text: "This was so much fun! Can't wait for next year.",
    createdAt: "2026-03-28T09:00:00Z",
    replies: [
      {
        id: "r1",
        author: mockAuthor,
        text: "Glad you enjoyed it, Maria!",
        createdAt: "2026-03-28T09:30:00Z",
        subReplies: [
          {
            id: "sr1",
            author: { id: "u3", name: "Maria Fernandez", role: "student" },
            text: "Thank you, Prof. Lopez!",
            createdAt: "2026-03-28T10:00:00Z",
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    author: { id: "u4", name: "Carlos Mendez", role: "student" },
    text: "Check out this reaction!",
    gif: mockGif,
    createdAt: "2026-03-28T10:15:00Z",
    replies: [],
  },
];

const mockDrafts: Draft[] = [
  {
    id: "draft-1",
    title: "My Trip to the Museum",
    excerpt: "Last weekend my family and I visited the national history museum...",
    author: { id: "u3", name: "Maria Fernandez", role: "student" },
    category: mockCategories[0],
    status: "draft",
    submittedAt: "2026-03-27T10:00:00Z",
  },
  {
    id: "draft-2",
    title: "Book Review: Don Quixote",
    excerpt: "Miguel de Cervantes' masterpiece is a journey through...",
    author: { id: "u5", name: "Lucia Ramirez", role: "student" },
    category: mockCategories[3],
    status: "draft",
    submittedAt: "2026-03-26T14:00:00Z",
  },
  {
    id: "draft-3",
    title: "Why I Love Basketball",
    excerpt: "Basketball has been my passion since I was seven years old...",
    author: { id: "u4", name: "Carlos Mendez", role: "student" },
    category: mockCategories[1],
    status: "rejected",
    submittedAt: "2026-03-25T11:00:00Z",
    rejectionNote: "Please add more details about your experience on the school team.",
  },
];
```
