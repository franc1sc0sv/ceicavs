import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface GroupSheetGroup {
  id: string
  name: string
  description: string | null
}

interface GroupSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: GroupSheetGroup | null
  onSave: (data: { name: string; description?: string }) => Promise<void>
  loading: boolean
}

export function GroupSheet({
  open,
  onOpenChange,
  group,
  onSave,
  loading,
}: GroupSheetProps) {
  const { t } = useTranslation('people')
  const isEdit = group !== null

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (group) {
      setName(group.name)
      setDescription(group.description ?? '')
    } else {
      setName('')
      setDescription('')
    }
    setErrors({})
  }, [group, open])

  function validate() {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = t('form.groupName')
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    await onSave({
      name: name.trim(),
      description: description.trim() || undefined,
    })
  }

  const titleKey = isEdit ? 'dialogs.editGroup.title' : 'dialogs.createGroup.title'
  const descKey = isEdit ? undefined : 'dialogs.createGroup.description'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t(titleKey)}</SheetTitle>
          {descKey && <SheetDescription>{t(descKey)}</SheetDescription>}
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="group-name">{t('form.groupName')}</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-xs text-destructive" role="alert">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="group-description">{t('form.description')}</Label>
            <Textarea
              id="group-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
              className="resize-none"
            />
          </div>
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {isEdit ? t('form.save') : t('form.create')}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
