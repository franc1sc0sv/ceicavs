import { Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@apollo/client/react'
import type { GetToolsQuery } from '@/generated/graphql'
import { useSetBreadcrumb } from '@/context/breadcrumb.context'
import { GET_TOOLS } from '../graphql/tools.queries'
import { getToolComponent } from '../tool-registry'

type ToolItem = GetToolsQuery['tools'][number]

export default function ToolDetailPage() {
  const { toolId } = useParams<{ toolId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('tools')

  const { data, loading } = useQuery(GET_TOOLS)

  const tool = data?.tools.find((item: ToolItem) => item.id === toolId)
  const ToolComponent = tool ? getToolComponent(tool.slug) : null

  useSetBreadcrumb([
    { label: t('title'), to: '/tools' },
    { label: tool?.name ?? '' },
  ])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    )
  }

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
