import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation } from '@apollo/client/react'
import { UserMinus, UserPlus, Search } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  GET_GROUP,
  GET_USERS,
  UPDATE_GROUP,
  ADD_MEMBER,
  REMOVE_MEMBER,
} from '@/features/people/graphql/people.operations'

interface GroupEditSheetProps {
  groupId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

interface Member {
  id: string
  name: string
  email: string
  role: string
  avatarUrl: string | null
}

function MemberAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
      {initials}
    </span>
  )
}

export function GroupEditSheet({ groupId, open, onOpenChange, onSaved }: GroupEditSheetProps) {
  const { t } = useTranslation('attendance')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameInitialized, setNameInitialized] = useState(false)
  const [search, setSearch] = useState('')

  const { data: groupData, loading: groupLoading, refetch: refetchGroup } = useQuery(GET_GROUP, {
    variables: { id: groupId },
    skip: !open,
  })

  useEffect(() => {
    const group = groupData?.getGroup
    if (!nameInitialized && group) {
      setName(group.name ?? '')
      setDescription(group.description ?? '')
      setNameInitialized(true)
    }
  }, [groupData, nameInitialized])

  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
    variables: {
      filters: {
        search: search.trim() || undefined,
        groupId: undefined,
        role: undefined,
        isDeactivated: undefined,
      },
    },
    skip: !open || search.trim().length < 2,
  })

  const [updateGroup, { loading: updating }] = useMutation(UPDATE_GROUP, {
    onCompleted: () => onSaved(),
  })

  const [addMember, { loading: adding }] = useMutation(ADD_MEMBER, {
    onCompleted: () => void refetchGroup(),
  })

  const [removeMember, { loading: removing }] = useMutation(REMOVE_MEMBER, {
    onCompleted: () => void refetchGroup(),
  })

  const group = groupData?.getGroup
  const members = (group?.members ?? []) as Member[]
  const currentMemberIds = new Set(members.map((m) => m.id))
  const searchResults = ((usersData?.getUsers ?? []) as Member[]).filter(
    (u) => !currentMemberIds.has(u.id),
  )

  const handleSave = () => {
    updateGroup({
      variables: { id: groupId, input: { name, description } },
    })
  }

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setNameInitialized(false)
      setSearch('')
    }
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:w-[480px] flex flex-col p-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
          <SheetTitle>{t('sheet.title')}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="group-name" className="text-sm font-medium text-foreground">
                {t('sheet.name')}
              </label>
              <Input
                id="group-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={groupLoading}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="group-description" className="text-sm font-medium text-foreground">
                {t('sheet.description')}
              </label>
              <Textarea
                id="group-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={groupLoading}
                className="resize-none"
              />
            </div>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!name.trim() || updating}
              className="w-full"
            >
              {t('sheet.save')}
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">{t('sheet.members')}</p>

            {groupLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-lg" />
                ))}
              </div>
            ) : (
              <ul className="space-y-1" role="list">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50"
                  >
                    <MemberAvatar name={member.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{member.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={removing}
                      onClick={() => removeMember({ variables: { groupId, userId: member.id } })}
                      aria-label={t('sheet.removeMember')}
                      className="size-8 shrink-0"
                    >
                      <UserMinus className="size-4 text-muted-foreground" />
                    </Button>
                  </li>
                ))}
                {members.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">{t('sheet.noMembers')}</p>
                )}
              </ul>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">{t('sheet.addMember')}</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('sheet.searchPlaceholder')}
                className="pl-9"
              />
            </div>

            {search.trim().length >= 2 && (
              <ul className="space-y-1" role="list">
                {usersLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 rounded-lg" />
                  ))
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">{t('sheet.noResults')}</p>
                ) : (
                  searchResults.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50"
                    >
                      <MemberAvatar name={user.name} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={adding}
                        onClick={() => addMember({ variables: { groupId, userId: user.id } })}
                        aria-label={t('sheet.addMember')}
                        className="size-8 shrink-0"
                      >
                        <UserPlus className="size-4 text-muted-foreground" />
                      </Button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
