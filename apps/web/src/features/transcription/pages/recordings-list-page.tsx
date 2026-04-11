import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Mic } from 'lucide-react'
import { Can } from '@/context/ability.context'
import { Action, Subject } from '@ceicavs/shared'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecordings } from '../hooks/use-recordings'
import { RecordingsTable } from '../components/recordings-table'

export default function RecordingsListPage() {
  const { t } = useTranslation('transcription')
  const navigate = useNavigate()
  const { recordings, loading, refetch } = useRecordings()

  return (
    <main className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{t('listPage.title')}</h1>
        <Can I={Action.CREATE} a={Subject.RECORDING}>
          <Button onClick={() => navigate('/transcription/new')}>
            <Plus className="h-4 w-4 mr-2" />
            {t('listPage.newRecording')}
          </Button>
        </Can>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : recordings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Mic className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">{t('listPage.empty')}</p>
          <Can I={Action.CREATE} a={Subject.RECORDING}>
            <Button onClick={() => navigate('/transcription/new')}>
              <Plus className="h-4 w-4 mr-2" />
              {t('listPage.emptyAction')}
            </Button>
          </Can>
        </div>
      ) : (
        <RecordingsTable recordings={recordings} onDeleted={() => void refetch()} />
      )}
    </main>
  )
}
