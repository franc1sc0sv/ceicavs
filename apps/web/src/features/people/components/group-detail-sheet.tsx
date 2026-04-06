import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client/react'
import { UserMinus, UserPlus, Search } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { RoleBadge } from './role-badge'
import { GET_GROUP, GET_USERS } from '../graphql/people.operations'
import { useGroupMutations } from '../hooks/use-group-mutations'

interface GroupDetailSheetProps {
  groupId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRemoveMember: (groupId: string, userId: string) => Promise<void>
  removingMember: boolean
}

interface GroupMember {
  id: string
  name: string
  email: string
  role: string
  avatarUrl: string | null
}

interface UserRow {
  id: string
  name: string
  email: string
  role: string
  avatarUrl: string | null
}

interface GroupDetailData {
  getGroup: {
    id: string
    name: string
    description: string | null
    memberCount: number
    members: GroupMember[] | undefined
  } | null
}

interface UsersData {
  getUsers: UserRow[]
}

function PersonAvatar({ name }: { name: string }) {
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

export function GroupDetailSheet({
  groupId,
  open,
  onOpenChange,
  onRemoveMember,
  removingMember,
}: GroupDetailSheetProps) {
  const { t } = useTranslation('people')
  const { addMember } = useGroupMutations()
  const [userSearch, setUserSearch] = useState('')
  const [addingUserId, setAddingUserId] = useState<string | null>(null)

  const { data: groupData, loading: loadingGroup } = useQuery(GET_GROUP, {
    variables: { id: groupId ?? '' },
    skip: !groupId || !open,
  })

  const { data: usersData, loading: loadingUsers } = useQuery(GET_USERS, {
    variables: { filters: { search: userSearch || undefined, groupId: undefined, role: undefined, isDeactivated: undefined } },
    skip: !open,
    fetchPolicy: 'cache-and-network',
  })

  const typedGroup = groupData as GroupDetailData | undefined
  const typedUsers = usersData as UsersData | undefined
  const group = typedGroup?.getGroup
  const memberIds = new Set(group?.members?.map((m) => m.id) ?? [])
  const availableUsers = (typedUsers?.getUsers ?? []).filter((u) => !memberIds.has(u.id))

  async function handleAdd(userId: string) {
    if (!groupId) return
    setAddingUserId(userId)
    try {
      await addMember(groupId, userId)
    } finally {
      setAddingUserId(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] sm:w-[560px] overflow-y-auto flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>
            {group ? group.name : t('dialogs.groupDetail.title')}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto divide-y">
          <section className="px-6 py-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">{t('groups.membersTitle')}</h3>

            {loadingGroup && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            )}

            {!loadingGroup && (!group?.members || group.members.length === 0) && (
              <p className="text-sm text-muted-foreground py-2">{t('empty.noUsers')}</p>
            )}

            {!loadingGroup && group?.members && group.members.length > 0 && (
              <ul className="space-y-1" role="list">
                {group.members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50"
                  >
                    <PersonAvatar name={member.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{member.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <RoleBadge role={member.role} />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={removingMember}
                      onClick={() => onRemoveMember(groupId!, member.id)}
                      aria-label={t('dialogs.groupDetail.removeMember')}
                    >
                      <UserMinus className="size-4 text-muted-foreground" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Separator />

          <section className="px-6 py-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">{t('groups.addMember')}</h3>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-8"
                placeholder={t('groups.searchUsers')}
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            {loadingUsers && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            )}

            {!loadingUsers && availableUsers.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">{t('groups.noUsersFound')}</p>
            )}

            {!loadingUsers && availableUsers.length > 0 && (
              <ul className="space-y-1" role="list">
                {availableUsers.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50"
                  >
                    <PersonAvatar name={user.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <RoleBadge role={user.role} />
                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={addingUserId === user.id}
                      onClick={() => handleAdd(user.id)}
                      aria-label={t('groups.addMember')}
                    >
                      <UserPlus className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
