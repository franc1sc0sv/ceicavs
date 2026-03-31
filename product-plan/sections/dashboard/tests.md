# Dashboard Tests

## Overview

Tests verify that the Dashboard renders the correct role-based view (admin, teacher, or student), displays stat cards with proper values and trends, shows the activity feed with formatted timestamps, exposes quick actions appropriate to each role, and fires callbacks correctly on user interaction.

---

## User Flow Tests

### Flow 1: Admin views system-wide dashboard

**Success Path**

1. Render `Dashboard` with `role="admin"` and `adminData` containing 7 stat cards, 5 activity items, and 2 quick actions
2. - [ ] All 7 stat cards are visible in a grid layout
3. - [ ] Each stat card displays its `label` and `value` (e.g., "Total Students" / "245")
4. - [ ] Stat cards with a `trend` show an up or down arrow with the percentage (e.g., "+5%")
5. - [ ] The activity feed lists 5 items, each showing the description, actor name, and relative timestamp
6. - [ ] Quick actions "Manage Users" and "Approve Pending Drafts" are visible as buttons
7. - [ ] The `WelcomeBanner`, `RecentPosts`, and `DraftTracker` components are NOT rendered

**Failure Path**

1. Render `Dashboard` with `role="admin"` and `adminData` containing an empty `stats` array and empty `activityFeed`
2. - [ ] The stat card grid area is empty or shows a placeholder
3. - [ ] The activity feed shows an empty state (no items rendered, no errors)
4. - [ ] Quick actions still render if provided

### Flow 2: Student views personal dashboard

**Success Path**

1. Render `Dashboard` with `role="student"` and `studentData` including `welcome`, `stats`, `recentPosts`, `draftStatuses`, and `quickActions`
2. - [ ] The `WelcomeBanner` displays the student's name (e.g., "Welcome back, Maria")
3. - [ ] The attendance streak badge shows the streak count (e.g., "12 days")
4. - [ ] Stat cards display personal metrics (e.g., "Attendance Rate" / "94%", "Groups" / "3")
5. - [ ] `RecentPosts` shows a list of recent blog posts with title, author, date, and category
6. - [ ] `DraftTracker` shows draft cards with color-coded status: pending (amber), approved (green), rejected (red)
7. - [ ] The `ActivityFeed` component is NOT rendered for students
8. Click on a draft card with status "pending"
9. - [ ] `onDraftClick` is called with the corresponding `DraftStatus` object
10. Click on a recent post
11. - [ ] `onPostClick` is called with the corresponding `RecentPost` object

**Failure Path**

1. Render `Dashboard` with `role="student"` and `studentData` containing empty `recentPosts` and empty `draftStatuses`
2. - [ ] `RecentPosts` area shows an empty state or is hidden
3. - [ ] `DraftTracker` area shows an empty state or is hidden
4. - [ ] Welcome banner and stats still render normally

### Flow 3: Teacher views scoped dashboard

**Success Path**

1. Render `Dashboard` with `role="teacher"` and `teacherData` containing scoped stats, activity feed, and quick actions
2. - [ ] Stat cards show teacher-scoped data (e.g., "My Attendance Rate" / "91%", "My Posts" / "8")
3. - [ ] Activity feed shows only events scoped to the teacher's groups and content
4. - [ ] Quick actions include "Mark Attendance" and "New Post"
5. Click on an activity feed item
6. - [ ] `onActivityClick` is called with the corresponding `ActivityItem` object
7. Click on the "Mark Attendance" quick action
8. - [ ] `onQuickAction` is called with the quick action's `href` value

---

## Empty State Tests

- [ ] When `adminData.stats` is empty, the stat grid renders without errors
- [ ] When `adminData.activityFeed` is empty, the feed area renders without errors
- [ ] When `studentData.recentPosts` is empty, no post cards are rendered
- [ ] When `studentData.draftStatuses` is empty, no draft cards are rendered
- [ ] When `quickActions` is empty, the quick actions row is hidden or empty

---

## Component Interaction Tests

- [ ] `StatCardGrid` renders 1 column on mobile (<640px), 2 columns on tablet (640-1023px), 3-4 columns on desktop (1024px+)
- [ ] Trend indicators show a green up arrow for positive trends and a red down arrow for negative trends
- [ ] Activity feed items display timestamps in relative format (e.g., "2 hours ago", "Yesterday")
- [ ] Quick action buttons are styled as icon+label cards in a horizontal row
- [ ] Draft status badges use correct colors: `pending` = amber/yellow, `approved` = green, `rejected` = red

---

## Edge Cases

- [ ] Dashboard with no data props for the given role renders gracefully (no crash)
- [ ] Stat card with a `value` of `0` renders correctly (not blank)
- [ ] Trend percentage of `0` does not show an arrow
- [ ] Very long activity descriptions truncate or wrap properly without overflow
- [ ] Very long student names in the welcome banner do not break the layout
- [ ] Draft with a very long title truncates with ellipsis in the DraftTracker

---

## Accessibility Checks

- [ ] All stat cards have accessible labels (e.g., `aria-label` describing the metric)
- [ ] Trend arrows include screen reader text (e.g., "up 5 percent")
- [ ] Quick action buttons are keyboard-focusable and have descriptive labels
- [ ] Activity feed items are keyboard-navigable
- [ ] Color-coded draft statuses include a text label (not color alone)
- [ ] All interactive elements have visible focus indicators

---

## Sample Test Data

```typescript
import type {
  StatCard,
  ActivityItem,
  QuickAction,
  DraftStatus,
  RecentPost,
  StudentWelcome,
  AdminDashboardData,
  StudentDashboardData,
} from "./types";

const mockAdminStats: StatCard[] = [
  { id: "s1", label: "Total Students", value: 245, trend: { direction: "up", percentage: 5 } },
  { id: "s2", label: "Total Teachers", value: 18 },
  { id: "s3", label: "Attendance Today", value: "92%", trend: { direction: "down", percentage: 2 } },
  { id: "s4", label: "Blog Posts This Week", value: 12 },
  { id: "s5", label: "Pending Drafts", value: 3 },
  { id: "s6", label: "Total Recordings", value: 47 },
  { id: "s7", label: "Total Groups", value: 14 },
];

const mockActivityFeed: ActivityItem[] = [
  { id: "a1", type: "user_registered", description: "Carlos Mendez joined as a student", actorName: "Carlos Mendez", actorRole: "student", timestamp: "2026-03-28T08:30:00Z" },
  { id: "a2", type: "post_published", description: "Ana Lopez published 'Science Fair Results'", actorName: "Ana Lopez", actorRole: "teacher", timestamp: "2026-03-28T07:15:00Z" },
  { id: "a3", type: "attendance", description: "Attendance marked for Group 7A", actorName: "Prof. Rivera", actorRole: "teacher", timestamp: "2026-03-27T14:00:00Z" },
];

const mockQuickActions: QuickAction[] = [
  { id: "qa1", label: "Manage Users", href: "/people", icon: "users" },
  { id: "qa2", label: "Approve Pending Drafts", href: "/blog/drafts", icon: "check-circle" },
];

const mockAdminData: AdminDashboardData = {
  stats: mockAdminStats,
  activityFeed: mockActivityFeed,
  quickActions: mockQuickActions,
};

const mockStudentWelcome: StudentWelcome = {
  studentName: "Maria Fernandez",
  attendanceStreak: 12,
  groupCount: 3,
};

const mockDrafts: DraftStatus[] = [
  { id: "d1", title: "My Trip to the Museum", status: "pending", submittedAt: "2026-03-27T10:00:00Z" },
  { id: "d2", title: "Book Review: Don Quixote", status: "approved", submittedAt: "2026-03-25T09:00:00Z" },
  { id: "d3", title: "Why I Love Science", status: "rejected", submittedAt: "2026-03-20T11:00:00Z" },
];

const mockRecentPosts: RecentPost[] = [
  { id: "p1", title: "Science Fair Results", authorName: "Ana Lopez", publishedAt: "2026-03-28T07:15:00Z", categoryName: "School Events" },
  { id: "p2", title: "Sports Day Recap", authorName: "Coach Garcia", publishedAt: "2026-03-27T16:00:00Z", categoryName: "Sports" },
];

const mockStudentData: StudentDashboardData = {
  welcome: mockStudentWelcome,
  stats: [
    { id: "ss1", label: "Attendance Rate", value: "94%" },
    { id: "ss2", label: "Current Streak", value: 12, icon: "flame" },
    { id: "ss3", label: "My Groups", value: 3 },
  ],
  recentPosts: mockRecentPosts,
  draftStatuses: mockDrafts,
  quickActions: [
    { id: "sqa1", label: "Submit New Draft", href: "/blog/new", icon: "edit" },
    { id: "sqa2", label: "View Attendance", href: "/attendance", icon: "calendar" },
  ],
};
```
