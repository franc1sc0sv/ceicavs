import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MoreHorizontal, Search, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Can } from '@/context/ability.context'
import { Action, Subject, UserRole } from '@ceicavs/shared'
import { RoleBadge } from './role-badge'
import { BulkToolbar } from './bulk-toolbar'
import { UserSheet } from './user-sheet'
import { DeleteAlert } from './delete-alert'
import { CsvImportSheet } from './csv-import-sheet'
import { usePeopleUsers } from '../hooks/use-people-users'
import { useUserMutations } from '../hooks/use-user-mutations'

interface UserRow {
  id: string
  name: string
  email: string
  role: string
  avatarUrl: string | null
  groups: { id: string; name: string }[]
}

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="size-8 rounded-full object-cover"
      />
    )
  }

  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
      {initials}
    </span>
  )
}

interface UsersTableProps {
  isDeactivated: boolean
}

export function UsersTable({ isDeactivated }: UsersTableProps) {
  const { t } = useTranslation('people')
  const { users, loading, error, refetch, filters, setFilters } = usePeopleUsers(isDeactivated)
  const mutations = useUserMutations()

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [userSheetOpen, setUserSheetOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserRow | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set((users as UserRow[]).map((u: UserRow) => u.id)))
    }
  }

  async function handleSaveUser(data: {
    name: string
    email: string
    password?: string
    role: UserRole
  }) {
    if (editingUser) {
      await mutations.updateUser(editingUser.id, {
        name: data.name,
        email: data.email,
        role: data.role,
      })
    } else {
      await mutations.createUser({
        name: data.name,
        email: data.email,
        password: data.password!,
        role: data.role,
      })
    }
    setUserSheetOpen(false)
    setEditingUser(null)
  }

  async function handleDeleteConfirm() {
    if (deletingId) {
      await mutations.deleteUser(deletingId)
      setDeletingId(null)
    }
    setDeleteOpen(false)
  }

  async function handleBulkDeleteConfirm() {
    await mutations.bulkDeleteUsers({ ids: Array.from(selectedIds) })
    setSelectedIds(new Set())
    setBulkDeleteOpen(false)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <p className="text-sm text-muted-foreground">{t('error.title')}</p>
        <Button variant="outline" onClick={() => refetch()}>{t('error.retry')}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-8"
            placeholder={t('users.searchPlaceholder')}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Select
          value={filters.role === '' ? 'all' : filters.role}
          onValueChange={(v) =>
            setFilters({ ...filters, role: v === 'all' ? '' : (v as UserRole) })
          }
        >
          <SelectTrigger className="h-8 w-32">
            <SelectValue placeholder={t('filters.all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.all')}</SelectItem>
            <SelectItem value={UserRole.ADMIN}>{t('roles.admin')}</SelectItem>
            <SelectItem value={UserRole.TEACHER}>{t('roles.teacher')}</SelectItem>
            <SelectItem value={UserRole.STUDENT}>{t('roles.student')}</SelectItem>
          </SelectContent>
        </Select>
        <Can I={Action.CREATE} a={Subject.USER}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportOpen(true)}
            className="gap-1.5"
          >
            <Upload className="size-4" />
            CSV
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingUser(null)
              setUserSheetOpen(true)
            }}
          >
            {t('users.addUser')}
          </Button>
        </Can>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2.5 w-10">
                <Checkbox
                  checked={users.length > 0 && selectedIds.size === users.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">
                {t('users.columns.name')}
              </th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">
                {t('users.columns.email')}
              </th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">
                {t('users.columns.role')}
              </th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground hidden md:table-cell">
                {t('users.columns.groups')}
              </th>
              <th className="px-3 py-2.5 w-10">
                <span className="sr-only">{t('users.columns.actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="px-3 py-3"><Skeleton className="size-4" /></td>
                  <td className="px-3 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-3 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-3 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-3 py-3 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-3 py-3"><Skeleton className="size-6 rounded" /></td>
                </tr>
              ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-12 text-center text-sm text-muted-foreground">
                  {t('empty.noUsers')}
                </td>
              </tr>
            )}
            {!loading &&
              (users as UserRow[]).map((user: UserRow) => (
                <tr
                  key={user.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-3 py-3">
                    <Checkbox
                      checked={selectedIds.has(user.id)}
                      onCheckedChange={() => toggleSelect(user.id)}
                      aria-label={user.name}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-3 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {user.groups.map((g: { id: string; name: string }) => (
                        <span
                          key={g.id}
                          className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={t('users.columns.actions')}
                          />
                        }
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Can I={Action.UPDATE} a={Subject.USER}>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingUser(user)
                              setUserSheetOpen(true)
                            }}
                          >
                            {t('users.edit')}
                          </DropdownMenuItem>
                        </Can>
                        <Can I={Action.DELETE} a={Subject.USER}>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              setDeletingId(user.id)
                              setDeleteOpen(true)
                            }}
                          >
                            {isDeactivated ? t('users.activate') : t('users.deactivate')}
                          </DropdownMenuItem>
                        </Can>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <BulkToolbar
        selectedCount={selectedIds.size}
        onDeactivate={() => setBulkDeleteOpen(true)}
        loading={mutations.loading}
      />

      <UserSheet
        open={userSheetOpen}
        onOpenChange={(open) => {
          setUserSheetOpen(open)
          if (!open) setEditingUser(null)
        }}
        user={editingUser}
        onSave={handleSaveUser}
        loading={mutations.loading}
      />

      <DeleteAlert
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={mutations.loading}
        type="user"
      />

      <DeleteAlert
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={handleBulkDeleteConfirm}
        loading={mutations.loading}
        type="bulk"
        count={selectedIds.size}
      />

      <CsvImportSheet
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={mutations.importUsers}
        loading={mutations.loading}
      />
    </div>
  )
}
