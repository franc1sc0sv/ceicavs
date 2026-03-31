# Dashboard

## Overview

The Dashboard is the landing page for CEICAVS, displaying role-adapted summary statistics, a recent activity feed, and quick action shortcuts. Admins see system-wide metrics, teachers see their groups and content, and students see a personal summary with motivational elements like attendance streaks.

## Components Provided

- `Dashboard` — Top-level container that switches between admin, teacher, and student views based on the `role` prop
- `StatCardGrid` — Responsive grid of stat cards showing label, value, and optional trend indicator (up/down arrow with percentage)
- `ActivityFeed` — Vertical list of recent activity items with icon, description, actor name, and relative timestamp
- `QuickActions` — Horizontal row of icon+label shortcut buttons scoped to the user's role
- `WelcomeBanner` — Student-only banner showing the student's name and attendance streak badge
- `RecentPosts` — Student-only feed of latest published blog posts
- `DraftTracker` — Student-only list of draft posts with color-coded status badges (pending/approved/rejected)

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onQuickAction(href: string)` | User clicks a quick action shortcut button |
| `onActivityClick(item: ActivityItem)` | User clicks an item in the activity feed |
| `onDraftClick(draft: DraftStatus)` | Student clicks a draft status card in the DraftTracker |
| `onPostClick(post: RecentPost)` | Student clicks a recent blog post in the RecentPosts feed |

## Data Shapes

**`StatCard`** — A single summary statistic: `id`, `label`, `value` (string or number), optional `trend` (`direction` + `percentage`), optional `icon`.

**`ActivityItem`** — A feed entry: `id`, `type` (attendance, post_published, draft_submitted, user_registered, recording_created), `description`, `actorName`, `actorRole`, `timestamp`.

**`QuickAction`** — A shortcut button: `id`, `label`, `href`, `icon`.

**`DraftStatus`** — A student draft: `id`, `title`, `status` (pending/approved/rejected), `submittedAt`.

**`RecentPost`** — A post preview: `id`, `title`, `authorName`, `publishedAt`, `categoryName`.

**`StudentWelcome`** — Welcome data: `studentName`, `attendanceStreak`, `groupCount`.

**`DashboardProps`** — Top-level: `role` (admin/teacher/student), `adminData?`, `teacherData?`, `studentData?`, plus all callbacks.

See `types.ts` for full interface definitions.
