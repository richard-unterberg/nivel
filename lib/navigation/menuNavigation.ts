import type { LucideIcon } from 'lucide-react'
import { Compass, Map as MapIcon, Sprout } from 'lucide-react'
import type { SidebarGroup } from '@/components/Sidebar/SidebarNavigation'
import { getHeadingData, type HeadingKey } from '@/lib/headings'
import type { Locale } from '@/lib/i18n/config'
import { t } from '@/lib/messages'

type MenuGroupDefinition = {
  id: string
  icon?: LucideIcon
  titleKey: 'getStarted' | 'components' | 'guides'
  links: HeadingKey[]
}

const menuGroups: MenuGroupDefinition[] = [
  {
    id: 'get-started',
    icon: Sprout,
    titleKey: 'getStarted',
    links: ['getStarted'],
  },
  {
    id: 'components',
    icon: Compass,
    titleKey: 'components',
    links: ['components', 'alert'],
  },
  {
    id: 'guides',
    icon: MapIcon,
    titleKey: 'guides',
    links: [],
  },
]

export const getMenuNavigation = (locale: Locale): SidebarGroup[] => {
  return menuGroups.map((group) => ({
    id: group.id,
    icon: group.icon,
    title: t(locale, 'sidebar', group.titleKey),
    links: group.links.map((item) => getHeadingData(item, locale)),
  }))
}
