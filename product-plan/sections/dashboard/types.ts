/** A single summary statistic displayed as a card */
export interface StatCard {
  id: string
  label: string
  value: string | number
  /** Optional trend: positive = up arrow, negative = down arrow */
  trend?: {
    direction: 'up' | 'down'
    percentage: number
  }
  icon?: string
}

/** A single item in the activity feed */
export interface ActivityItem {
  id: string
  type: 'attendance' | 'post_published' | 'draft_submitted' | 'user_registered' | 'recording_created'
  description: string
  actorName: string
  actorRole: 'admin' | 'teacher' | 'student'
  timestamp: string
}

/** A quick action shortcut button */
export interface QuickAction {
  id: string
  label: string
  href: string
  icon: string
}

/** A student's blog draft with its current status */
export interface DraftStatus {
  id: string
  title: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
}

/** A recent blog post shown in the student feed */
export interface RecentPost {
  id: string
  title: string
  authorName: string
  publishedAt: string
  categoryName: string
}

/** Student welcome/motivational data */
export interface StudentWelcome {
  studentName: string
  attendanceStreak: number
  groupCount: number
}

/** Dashboard data scoped to the Admin role */
export interface AdminDashboardData {
  stats: StatCard[]
  activityFeed: ActivityItem[]
  quickActions: QuickAction[]
}

/** Dashboard data scoped to the Teacher role */
export interface TeacherDashboardData {
  stats: StatCard[]
  activityFeed: ActivityItem[]
  quickActions: QuickAction[]
}

/** Dashboard data scoped to the Student role */
export interface StudentDashboardData {
  welcome: StudentWelcome
  stats: StatCard[]
  recentPosts: RecentPost[]
  draftStatuses: DraftStatus[]
  quickActions: QuickAction[]
}

export interface DashboardProps {
  role: 'admin' | 'teacher' | 'student'
  adminData?: AdminDashboardData
  teacherData?: TeacherDashboardData
  studentData?: StudentDashboardData
  /** Called when a quick action is clicked */
  onQuickAction?: (href: string) => void
  /** Called when an activity feed item is clicked */
  onActivityClick?: (item: ActivityItem) => void
  /** Called when a draft status card is clicked */
  onDraftClick?: (draft: DraftStatus) => void
  /** Called when a recent post is clicked */
  onPostClick?: (post: RecentPost) => void
}
