import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useMutation } from '@apollo/client/react'
import { graphql } from '@/generated/gql'
import type { GetRecordingsQuery } from '@/generated/graphql'

const DELETE_RECORDING = graphql(`
  mutation DeleteRecording($input: DeleteRecordingInput!) {
    deleteRecording(input: $input)
  }
`)

type Recording = GetRecordingsQuery['getRecordings'][number]

type TranscriptionStatus = 'none' | 'processing' | 'completed'

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation('transcription')

  const variantMap: Record<TranscriptionStatus, 'secondary' | 'outline' | 'default'> = {
    none: 'secondary',
    processing: 'outline',
    completed: 'default',
  }

  const safeStatus = (status as TranscriptionStatus) in variantMap ? (status as TranscriptionStatus) : 'none'
  const variant = variantMap[safeStatus]

  return <Badge variant={variant}>{t(`status.${safeStatus}`)}</Badge>
}

interface RecordingsTableProps {
  recordings: Recording[]
  onDeleted: () => void
}

export function RecordingsTable({ recordings, onDeleted }: RecordingsTableProps) {
  const { t } = useTranslation('transcription')
  const navigate = useNavigate()
  const [deleteRecording, { loading: isDeleting }] = useMutation(DELETE_RECORDING)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return
    await deleteRecording({ variables: { input: { id: pendingDeleteId } } })
    setPendingDeleteId(null)
    onDeleted()
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.name')}</TableHead>
            <TableHead>{t('table.date')}</TableHead>
            <TableHead>{t('table.duration')}</TableHead>
            <TableHead>{t('table.status')}</TableHead>
            <TableHead className="text-right">{t('table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recordings.map((recording) => (
            <TableRow
              key={recording.id}
              className="cursor-pointer"
              onClick={() => navigate(`/transcription/${recording.id}`)}
            >
              <TableCell className="font-medium">{recording.name}</TableCell>
              <TableCell>{format(new Date(recording.createdAt as string), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{formatDuration(recording.duration)}</TableCell>
              <TableCell>
                <StatusBadge status={recording.transcriptionStatus} />
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t('delete.confirm')}
                  onClick={() => setPendingDeleteId(recording.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={pendingDeleteId !== null} onOpenChange={(open) => { if (!open) setPendingDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>{t('delete.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('delete.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleConfirmDelete()} disabled={isDeleting}>
              {t('delete.confirm_action')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
