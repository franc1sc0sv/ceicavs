import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import { LoginPage } from '@/features/auth/LoginPage'
import { ProtectedLayout } from '@/router/ProtectedLayout'
import { RequireAbility } from '@/router/RequireAbility'
import { Action, Subject } from '@ceicavs/shared'

const DashboardPage = React.lazy(() => import('@/features/dashboard/DashboardPage'))
const AttendancePage = React.lazy(() => import('@/features/attendance/AttendancePage'))
const AttendanceDetailPage = React.lazy(() => import('@/features/attendance/pages/attendance-detail-page'))
const PeoplePage = React.lazy(() => import('@/features/people/PeoplePage'))
const BlogPage = React.lazy(() => import('@/features/blog/BlogPage'))
const PostDetailPage = React.lazy(() => import('@/features/blog/pages/post-detail-page'))
const CreatePostPage = React.lazy(() => import('@/features/blog/pages/create-post-page'))
const EditPostPage = React.lazy(() => import('@/features/blog/pages/edit-post-page'))
const DraftQueuePage = React.lazy(() => import('@/features/blog/pages/draft-queue-page'))
const MyDraftsPage = React.lazy(() => import('@/features/blog/pages/my-drafts-page'))
const CategoryManagementPage = React.lazy(() => import('@/features/blog/pages/category-management-page'))
const ToolsPage = React.lazy(() => import('@/features/tools/ToolsPage'))
const ToolDetailPage = React.lazy(() => import('@/features/tools/pages/tool-detail-page'))
const TranscriptionPage = React.lazy(() => import('@/features/transcription/TranscriptionPage'))

function PageFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}

function withSuspense(node: React.ReactNode) {
  return <React.Suspense fallback={<PageFallback />}>{node}</React.Suspense>
}

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    Component: LoginPage,
  },
  {
    path: '/',
    Component: ProtectedLayout,
    children: [
      { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
      { path: 'dashboard', element: withSuspense(<DashboardPage />) },
      { path: 'attendance', element: withSuspense(<AttendancePage />) },
      { path: 'attendance/:id', element: withSuspense(<AttendanceDetailPage />) },
      {
        element: <RequireAbility action={Action.CREATE} subject={Subject.GROUP} />,
        children: [
          { path: 'people', element: withSuspense(<PeoplePage />) },
        ],
      },
      { path: 'blog', element: withSuspense(<BlogPage />) },
      { path: 'blog/new', element: withSuspense(<CreatePostPage />) },
      { path: 'blog/queue', element: withSuspense(<DraftQueuePage />) },
      { path: 'blog/drafts', element: withSuspense(<MyDraftsPage />) },
      { path: 'blog/categories', element: withSuspense(<CategoryManagementPage />) },
      { path: 'blog/:id/edit', element: withSuspense(<EditPostPage />) },
      { path: 'blog/:id', element: withSuspense(<PostDetailPage />) },
      { path: 'tools', element: withSuspense(<ToolsPage />) },
      { path: 'tools/:toolId', element: withSuspense(<ToolDetailPage />) },
      {
        element: <RequireAbility action={Action.CREATE} subject={Subject.RECORDING} />,
        children: [
          { path: 'transcription', element: withSuspense(<TranscriptionPage />) },
        ],
      },
    ],
  },
])
