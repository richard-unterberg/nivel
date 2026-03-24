import type { LucideIcon } from 'lucide-react'
import { Compass, Map as MapIcon, Plug, Rocket, Sprout } from 'lucide-react'
import { getHeadingData, type HeadingKey } from '@/lib/headings'
import type { Locale } from '@/lib/i18n/config'
import { t } from '@/lib/i18n/messages'
import type { SidebarCategory, SidebarGroup } from '@/pages/(docs)/(components)/Sidebar/SidebarNavigation'

type MenuCategoryDefinition = {
  titleKey: 'basics' | 'routing' | 'more' | 'staticHosts' | 'serverless' | 'selfHosted'
  headings: HeadingKey[]
}

type MenuItemDefinition = HeadingKey | MenuCategoryDefinition

type MenuGroupDefinition = {
  icon?: LucideIcon
  titleKey: 'getStarted' | 'overview' | 'guides' | 'deploy' | 'integration'
  links: MenuItemDefinition[]
}

const isCategoryDefinition = (item: MenuItemDefinition): item is MenuCategoryDefinition => typeof item !== 'string'

const menuGroups: MenuGroupDefinition[] = [
  {
    icon: Sprout,
    titleKey: 'getStarted',
    links: ['getStarted'],
  },
  {
    icon: Compass,
    titleKey: 'overview',
    links: [],
  },
  {
    icon: MapIcon,
    titleKey: 'guides',
    links: [],
  },
  {
    icon: Rocket,
    titleKey: 'deploy',
    links: [],
  },
  {
    icon: Plug,
    titleKey: 'integration',
    links: [],
  },
]

const resolveMenuItem = (item: MenuItemDefinition, locale: Locale) => {
  if (!isCategoryDefinition(item)) {
    return getHeadingData(item, locale)
  }

  const category: SidebarCategory = {
    title: t(locale, 'sidebar', item.titleKey),
    children: item.headings.map((headingKey) => getHeadingData(headingKey, locale)),
  }

  return category
}

export const getMenuNavigation = (locale: Locale): SidebarGroup[] => {
  return menuGroups.map((group) => ({
    icon: group.icon,
    title: t(locale, 'sidebar', group.titleKey),
    links: group.links.map((item) => resolveMenuItem(item, locale)),
  }))
}
