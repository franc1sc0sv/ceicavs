import { Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { useSetBreadcrumb } from '@/context/breadcrumb.context'
import { TOOLS } from '../data/tools-data'
import { getToolComponent } from '../tool-registry'

export default function ToolDetailPage() {
  const { toolId } = useParams<{ toolId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('tools')

  const tool = TOOLS.find((item) => item.id === toolId)
  const ToolComponent = toolId ? getToolComponent(toolId) : null

  useSetBreadcrumb([
    { label: t('title'), to: '/tools' },
    { label: tool?.name ?? '' },
  ])

  if (!tool || !ToolComponent) {
    navigate('/tools', { replace: true })
    return null
  }

  return (
    <div className="min-w-0 overflow-hidden p-4 sm:p-6 lg:p-8">
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        }
      >
        <ToolComponent />
      </Suspense>
    </div>
  )
}
