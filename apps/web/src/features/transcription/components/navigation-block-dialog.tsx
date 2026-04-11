import { useTranslation } from 'react-i18next'
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

interface NavigationBlockDialogProps {
  open: boolean
  onLeave: () => void
  onStay: () => void
}

export function NavigationBlockDialog({ open, onLeave, onStay }: NavigationBlockDialogProps) {
  const { t } = useTranslation('transcription')

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('navigation.blockTitle')}</AlertDialogTitle>
          <AlertDialogDescription>{t('navigation.blockMessage')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onStay}>{t('navigation.stay')}</AlertDialogCancel>
          <AlertDialogAction onClick={onLeave}>{t('navigation.leave')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
