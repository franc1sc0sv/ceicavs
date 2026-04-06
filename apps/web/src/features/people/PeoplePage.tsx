import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Can, useAbility } from '@/context/ability.context'
import { Action, Subject } from '@ceicavs/shared'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsersTable } from './components/users-table'
import { GroupsGrid } from './components/groups-grid'

type TabValue = 'users' | 'groups'

export default function PeoplePage() {
  const { t } = useTranslation('people')
  const ability = useAbility()
  const canManageUsers = ability.can(Action.MANAGE, Subject.USER)
  const [activeTab, setActiveTab] = useState<TabValue>(canManageUsers ? 'users' : 'groups')
  const [isDeactivated, setIsDeactivated] = useState(false)

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <div className="flex flex-wrap items-center gap-3">
          <TabsList>
            <Can I={Action.MANAGE} a={Subject.USER}>
              <TabsTrigger value="users">{t('tabs.users')}</TabsTrigger>
            </Can>
            <TabsTrigger value="groups">{t('tabs.groups')}</TabsTrigger>
          </TabsList>

          {activeTab === 'users' && (
            <Can I={Action.MANAGE} a={Subject.USER}>
              <Tabs
                value={isDeactivated ? 'deactivated' : 'active'}
                onValueChange={(v) => setIsDeactivated(v === 'deactivated')}
              >
                <TabsList>
                  <TabsTrigger value="active">{t('users.active')}</TabsTrigger>
                  <TabsTrigger value="deactivated">{t('users.deactivated')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </Can>
          )}
        </div>

        <Can I={Action.MANAGE} a={Subject.USER}>
          <div role="tabpanel" id="tabpanel-users" hidden={activeTab !== 'users'}>
            {activeTab === 'users' && <UsersTable isDeactivated={isDeactivated} />}
          </div>
        </Can>
        <div role="tabpanel" id="tabpanel-groups" hidden={activeTab !== 'groups'}>
          {activeTab === 'groups' && <GroupsGrid />}
        </div>
      </Tabs>
    </div>
  )
}
