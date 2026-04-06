import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MoreHorizontal, Search, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Can } from '@/context/ability.context'
import { Action, Subject } from '@ceicavs/shared'
import { GroupSheet } from './group-sheet'
import { GroupDetailSheet } from './group-detail-sheet'
import { DeleteAlert } from './delete-alert'
import { usePeopleGroups } from '../hooks/use-people-groups'
import { useGroupMutations } from '../hooks/use-group-mutations'

interface GroupRow {
  id: string
  name: string
  description: string | null
  memberCount: number
}

export function GroupsGrid() {
  const { t } = useTranslation('people')
  const { groups, loading, error, refetch, filters, setFilters } = usePeopleGroups()
  const mutations = useGroupMutations()

  const [groupSheetOpen, setGroupSheetOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<GroupRow | null>(null)
  const [detailGroupId, setDetailGroupId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleSaveGroup(data: { name: string; description?: string }) {
    if (editingGroup) {
      await mutations.updateGroup(editingGroup.id, { name: data.name, description: data.description ?? undefined })
    } else {
      await mutations.createGroup({ name: data.name, description: data.description ?? undefined })
    }
    setGroupSheetOpen(false)
    setEditingGroup(null)
  }

  async function handleDeleteConfirm() {
    if (deletingId) {
      await mutations.deleteGroup(deletingId)
      setDeletingId(null)
    }
    setDeleteOpen(false)
  }

  async function handleRemoveMember(groupId: string, userId: string) {
    await mutations.removeMember(groupId, userId)
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
            placeholder={t('groups.searchPlaceholder')}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Can I={Action.CREATE} a={Subject.GROUP}>
          <Button
            size="sm"
            onClick={() => {
              setEditingGroup(null)
              setGroupSheetOpen(true)
            }}
          >
            {t('groups.createGroup')}
          </Button>
        </Can>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && groups.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16">
          <p className="text-sm text-muted-foreground">{t('empty.noGroups')}</p>
        </div>
      )}

      {!loading && groups.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(groups as GroupRow[]).map((group: GroupRow) => (
            <Card
              key={group.id}
              className="cursor-pointer transition-colors hover:bg-accent/30"
              onClick={() => {
                setDetailGroupId(group.id)
                setDetailOpen(true)
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">{group.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t('groups.edit')}
                        />
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Can I={Action.UPDATE} a={Subject.GROUP}>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingGroup(group)
                            setGroupSheetOpen(true)
                          }}
                        >
                          {t('groups.edit')}
                        </DropdownMenuItem>
                      </Can>
                      <Can I={Action.DELETE} a={Subject.GROUP}>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeletingId(group.id)
                            setDeleteOpen(true)
                          }}
                        >
                          {t('groups.delete')}
                        </DropdownMenuItem>
                      </Can>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2">
                  {group.description ?? t('groups.noDescription')}
                </CardDescription>
              </CardHeader>
              <CardFooter className="border-t">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="size-3.5" />
                  <span>{t('groups.members', { count: group.memberCount })}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <GroupSheet
        open={groupSheetOpen}
        onOpenChange={(open) => {
          setGroupSheetOpen(open)
          if (!open) setEditingGroup(null)
        }}
        group={editingGroup}
        onSave={handleSaveGroup}
        loading={mutations.loading}
      />

      <GroupDetailSheet
        groupId={detailGroupId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onRemoveMember={handleRemoveMember}
        removingMember={mutations.loading}
      />

      <DeleteAlert
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={mutations.loading}
        type="group"
      />
    </div>
  )
}
