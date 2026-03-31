# Milestone 2: Dashboard

Provide alongside: `product-overview.md`

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Build the landing page that every user sees after login. The Dashboard adapts its content based on the user's role: admins see system-wide metrics, teachers see scoped stats for their groups, and students see a personalized view with attendance streaks, recent posts, and draft status tracking.

## Overview

The Dashboard is a role-adapted summary page containing stat cards, an activity feed, quick action shortcuts, and (for students) a welcome banner with motivational elements. All data is passed via props and loaded once on page open (no real-time updates). The `role` prop determines which sub-components render.

## Key Functionality

- **Admin dashboard**: 7 stat cards (total students, total teachers, attendance rate today, blog posts this week, pending student drafts, total recordings, total groups), activity feed (new registrations, posts published, attendance marked, recordings created), quick actions (manage users, approve pending drafts)
- **Teacher dashboard**: scoped stat cards (attendance rate for their groups, their blog post count, their recordings, pending drafts from their students), scoped activity feed, quick actions (mark attendance for a group, create a new blog post)
- **Student dashboard**: welcome banner with name and attendance streak counter, personal stat cards (attendance rate, streak, group count), recent blog posts feed, draft status tracker (pending/approved/rejected with color coding), quick actions (submit new draft, view attendance history)
- **Stat cards**: responsive grid (1 col mobile, 2 tablet, 3-4 desktop), each with label, large number, optional trend indicator (up/down arrow + percentage)
- **Activity feed**: vertical list with icon, description, actor name, relative timestamp
- **Quick actions**: horizontal row of icon+label shortcut cards

## Components Provided

| File | Description |
|------|-------------|
| `sections/dashboard/components/Dashboard.tsx` | Root component that switches layout by role |
| `sections/dashboard/components/StatCardGrid.tsx` | Responsive grid of stat cards |
| `sections/dashboard/components/ActivityFeed.tsx` | Vertical activity feed list |
| `sections/dashboard/components/QuickActions.tsx` | Horizontal quick action buttons |
| `sections/dashboard/components/WelcomeBanner.tsx` | Student welcome message with streak |
| `sections/dashboard/components/RecentPosts.tsx` | Student recent blog posts feed |
| `sections/dashboard/components/DraftTracker.tsx` | Student draft status cards |
| `sections/dashboard/components/index.ts` | Barrel exports |

## Props Reference

### Dashboard (top-level)

| Prop | Type | Description |
|------|------|-------------|
| `role` | `'admin' \| 'teacher' \| 'student'` | Determines which layout renders |
| `adminData` | `AdminDashboardData` | Stats, activity, actions for admin |
| `teacherData` | `TeacherDashboardData` | Stats, activity, actions for teacher |
| `studentData` | `StudentDashboardData` | Welcome, stats, posts, drafts, actions for student |
| `onQuickAction` | `(href: string) => void` | Called when a quick action is clicked |
| `onActivityClick` | `(item: ActivityItem) => void` | Called when a feed item is clicked |
| `onDraftClick` | `(draft: DraftStatus) => void` | Called when a student clicks a draft card |
| `onPostClick` | `(post: RecentPost) => void` | Called when a student clicks a recent post |

### StatCard data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Card title text |
| `value` | `string \| number` | Large display value |
| `trend` | `{ direction: 'up' \| 'down', percentage: number }` | Optional trend indicator |
| `icon` | `string` | Optional icon name |

### ActivityItem data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `type` | `'attendance' \| 'post_published' \| 'draft_submitted' \| 'user_registered' \| 'recording_created'` | Event type |
| `description` | `string` | Human-readable event text |
| `actorName` | `string` | Who performed the action |
| `actorRole` | `'admin' \| 'teacher' \| 'student'` | Actor's role |
| `timestamp` | `string` | ISO timestamp |

### QuickAction data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Button label |
| `href` | `string` | Target route path |
| `icon` | `string` | Icon name |

### StudentWelcome data shape

| Field | Type | Description |
|-------|------|-------------|
| `studentName` | `string` | Student's first name |
| `attendanceStreak` | `number` | Current consecutive-day streak |
| `groupCount` | `number` | Number of groups the student belongs to |

## Expected User Flows

### Flow 1: Admin views dashboard and takes action
1. Admin navigates to Dashboard and sees 7 stat cards in a responsive grid (total students, teachers, attendance rate, posts this week, pending drafts, recordings, groups)
2. Admin scrolls down to the activity feed showing recent platform events with icons and timestamps
3. Admin clicks the "Approve Pending Drafts" quick action button
4. The `onQuickAction` callback fires with the drafts queue route

### Flow 2: Teacher uses quick actions
1. Teacher opens Dashboard and sees scoped stat cards (their groups' attendance rate, their post count, pending drafts from their students)
2. Teacher clicks "Mark Attendance" quick action
3. The `onQuickAction` callback fires, navigating to the Attendance section

### Flow 3: Student checks streak and submits draft
1. Student opens Dashboard and sees the welcome banner: "Hola, Maria! 12 dias de racha"
2. Student scrolls past personal stats to the recent posts feed showing latest published blog posts
3. Student views the draft tracker showing their drafts with status badges (green = approved, amber = pending, red = rejected)
4. Student clicks "Submit New Draft" quick action

## Empty States

- **No activity yet**: Show a friendly message ("No hay actividad reciente" / "No recent activity") in the activity feed area
- **No drafts (student)**: Show "No has enviado borradores aun" / "You haven't submitted any drafts yet" with a CTA to create one
- **No recent posts (student)**: Show "No hay publicaciones recientes" / "No recent posts yet"
- **Loading**: Show skeleton cards matching the stat card grid and feed layout

## Testing

Refer to `sections/dashboard/tests.md` for detailed test specs covering:
- Correct layout renders per role
- Stat cards display with proper values and trends
- Quick action callbacks fire with correct href
- Student welcome banner shows name and streak
- Draft tracker shows correct status colors

## Files to Reference

| File | Purpose |
|------|---------|
| `product/sections/dashboard/spec.md` | Full section specification |
| `product/sections/dashboard/types.ts` | TypeScript interfaces |
| `product/sections/dashboard/data.json` | Sample data |
| `sections/dashboard/components/Dashboard.tsx` | Root dashboard component |
| `sections/dashboard/components/StatCardGrid.tsx` | Stat cards grid |
| `sections/dashboard/components/ActivityFeed.tsx` | Activity feed |
| `sections/dashboard/components/QuickActions.tsx` | Quick action buttons |
| `sections/dashboard/components/WelcomeBanner.tsx` | Student welcome banner |
| `sections/dashboard/components/RecentPosts.tsx` | Student recent posts |
| `sections/dashboard/components/DraftTracker.tsx` | Student draft tracker |

## Done When

- [ ] Dashboard renders inside the AppShell
- [ ] Admin sees 7 stat cards, activity feed, and quick actions
- [ ] Teacher sees scoped stats, scoped activity feed, and quick actions
- [ ] Student sees welcome banner with name and attendance streak
- [ ] Student sees personal stat cards (attendance rate, streak, group count)
- [ ] Student sees recent blog posts feed
- [ ] Student sees draft tracker with pending/approved/rejected status badges
- [ ] Stat cards display in a responsive grid (1/2/3-4 columns by breakpoint)
- [ ] Each stat card shows label, value, and optional trend arrow with percentage
- [ ] Quick action callbacks navigate to the correct section
- [ ] Activity feed items show icon, description, actor, and relative timestamp
- [ ] Empty states display for no activity, no drafts, and no posts
- [ ] Loading state shows skeleton placeholders
