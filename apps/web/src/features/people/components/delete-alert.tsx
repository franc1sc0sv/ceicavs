import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

interface DeleteAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  loading: boolean
  type: 'user' | 'group' | 'bulk'
  count?: number
}

export function DeleteAlert({
  open,
  onOpenChange,
  onConfirm,
  loading,
  type,
  count = 0,
}: DeleteAlertProps) {
  const { t } = useTranslation('people')

  const warningKey =
    type === 'bulk'
      ? t('dialogs.delete.bulkWarning', { count })
      : type === 'user'
      ? t('dialogs.delete.userWarning')
      : t('dialogs.delete.groupWarning')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('dialogs.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>{warningKey}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" size="default">{t('dialogs.delete.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('dialogs.delete.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
