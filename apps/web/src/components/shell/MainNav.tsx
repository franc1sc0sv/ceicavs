import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  FileText,
  Wrench,
  AudioLines,
  type LucideIcon,
} from 'lucide-react'
import type { Action, Subject } from '@ceicavs/shared'
import { Can } from '../../context/ability.context'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

interface NavItem {
  to: string
  labelKey: string
  icon: LucideIcon
  permission?: { action: Action; subject: Subject }
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/attendance', labelKey: 'nav.attendance', icon: ClipboardCheck },
  { to: '/people', labelKey: 'nav.people', icon: Users, permission: { action: 'create', subject: 'Group' } },
  { to: '/blog', labelKey: 'nav.blog', icon: FileText },
  { to: '/tools', labelKey: 'nav.tools', icon: Wrench },
  { to: '/transcription', labelKey: 'nav.transcription', icon: AudioLines, permission: { action: 'create', subject: 'Recording' } },
]

export function MainNav() {
  const { t } = useTranslation('common')

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('common.platform')}</SidebarGroupLabel>
      <SidebarMenu className="gap-1.5">
        {NAV_ITEMS.map((item) => {
          const menuItem = (
            <SidebarMenuItem key={item.to}>
              <NavLink to={item.to}>
                {({ isActive }) => (
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={t(item.labelKey)}
                    size="lg"
                    className="text-[14px] py-3"
                  >
                    <item.icon className="!size-5" />
                    <span>{t(item.labelKey)}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          )

          if (item.permission) {
            return (
              <Can key={item.to} I={item.permission.action} a={item.permission.subject}>
                {menuItem}
              </Can>
            )
          }

          return menuItem
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
