import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import { LoginPage } from '@/features/auth/LoginPage'
import { ProtectedLayout } from '@/router/ProtectedLayout'
import { RequireAbility } from '@/router/RequireAbility'

const DashboardPage = React.lazy(() => import('@/features/dashboard/DashboardPage'))
const AttendancePage = React.lazy(() => import('@/features/attendance/AttendancePage'))
const PeoplePage = React.lazy(() => import('@/features/people/PeoplePage'))
const BlogPage = React.lazy(() => import('@/features/blog/BlogPage'))
const ToolsPage = React.lazy(() => import('@/features/tools/ToolsPage'))
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
      {
        element: <RequireAbility action="create" subject="Group" />,
        children: [
          { path: 'people', element: withSuspense(<PeoplePage />) },
        ],
      },
      { path: 'blog', element: withSuspense(<BlogPage />) },
      { path: 'tools', element: withSuspense(<ToolsPage />) },
      {
        element: <RequireAbility action="create" subject="Recording" />,
        children: [
          { path: 'transcription', element: withSuspense(<TranscriptionPage />) },
        ],
      },
    ],
  },
])
