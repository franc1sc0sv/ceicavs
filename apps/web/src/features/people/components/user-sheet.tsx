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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserRole } from '@ceicavs/shared'

interface UserSheetUser {
  id: string
  name: string
  email: string
  role: string
}

interface UserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserSheetUser | null
  onSave: (data: {
    name: string
    email: string
    password?: string
    role: UserRole
  }) => Promise<void>
  loading: boolean
}

const ROLES = [
  { value: UserRole.ADMIN, labelKey: 'roles.admin' },
  { value: UserRole.TEACHER, labelKey: 'roles.teacher' },
  { value: UserRole.STUDENT, labelKey: 'roles.student' },
] as const

export function UserSheet({
  open,
  onOpenChange,
  user,
  onSave,
  loading,
}: UserSheetProps) {
  const { t } = useTranslation('people')
  const isEdit = user !== null

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setRole((user.role as UserRole) ?? UserRole.STUDENT)
      setPassword('')
    } else {
      setName('')
      setEmail('')
      setPassword('')
      setRole(UserRole.STUDENT)
    }
    setErrors({})
  }, [user, open])

  function validate() {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = t('form.name')
    if (!email.trim()) next.email = t('form.email')
    if (!isEdit && !password.trim()) next.password = t('form.password')
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
      email: email.trim(),
      role,
      ...(isEdit ? {} : { password }),
    })
  }

  const titleKey = isEdit ? 'dialogs.editUser.title' : 'dialogs.addUser.title'
  const descKey = isEdit ? undefined : 'dialogs.addUser.description'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t(titleKey)}</SheetTitle>
          {descKey && (
            <SheetDescription>{t(descKey)}</SheetDescription>
          )}
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-name">{t('form.name')}</Label>
            <Input
              id="user-name"
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
            <Label htmlFor="user-email">{t('form.email')}</Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-xs text-destructive" role="alert">{errors.email}</p>
            )}
          </div>
          {!isEdit && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-password">{t('form.password')}</Label>
              <Input
                id="user-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-xs text-destructive" role="alert">{errors.password}</p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-role">{t('form.role')}</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)} disabled={loading}>
              <SelectTrigger id="user-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{t(r.labelKey)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
