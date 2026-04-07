import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/auth.context'
import { UserRole } from '@ceicavs/shared'
import { AdminDashboard } from './components/admin-dashboard'
import { TeacherDashboard } from './components/teacher-dashboard'
import { StudentDashboard } from './components/student-dashboard'

export default function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const { t: tc } = useTranslation('common')
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('welcome', { name: user.name })}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t(`role.${user.role}`)}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {tc(`roles.${user.role}`)}
        </Badge>
      </div>

      {user.role === UserRole.ADMIN && <AdminDashboard />}
      {user.role === UserRole.TEACHER && <TeacherDashboard />}
      {user.role === UserRole.STUDENT && <StudentDashboard />}
    </div>
  )
}
