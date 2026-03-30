import { Map as MapIcon, Sprout } from 'lucide-react'
import { getHeadingData, getHeadingLinkData, type HeadingKey } from '@/lib/docs/headings'
import type { TelefuncSystemConfig } from '@/lib/docs/systemConfig'
import type { Locale } from '@/lib/i18n/config'
import { t } from '@/lib/messages'
import type { MenuGroupShared, MenuRendererGroup } from '@/lib/navigation/navigation'

const GroupKeys = {
  getStarted: 'getStarted',
  api: 'api',
  maintainers: 'maintainers',
} as const
type GroupKeys = (typeof GroupKeys)[keyof typeof GroupKeys]

type MenuGroupDefinition = MenuGroupShared & {
  groupKey: GroupKeys
  links: (HeadingKey | { dividerText: string })[]
}
const menuGroups: MenuGroupDefinition[] = [
  {
    id: 'get-started',
    icon: Sprout,
    groupKey: 'getStarted',
    links: [
      'quickStart',
      'concepts',
      'bestPractices',
      { dividerText: 'Guides' },
      'serverIntegration',
      'initialData',
      'permissions',
      'validation',
      'fileUploads',
      'errorHandling',
      { dividerText: 'Learn More' },
      'whySchemaless',
      'howItWorks',
    ],
  },
  {
    id: 'guides',
    icon: MapIcon,
    groupKey: 'api',
    collapsible: {
      isDefaultOpen: true,
    },
    links: [
      { dividerText: 'Server' },
      'apiTelefunc',
      'throwAbort',
      'getContext',
      'shield',
      'onBug',
      { dividerText: 'Client' },
      'onAbort',
      { dividerText: 'Config' },
      'telefuncUrl',
      'disableNamingConvention',
      'httpHeaders',
      'fetch',
      'telefuncFiles',
      'root',
      'configShield',
      'log',
    ],
  },
  {
    id: 'maintainers',
    icon: Sprout,
    groupKey: 'maintainers',
    links: ['getStarted'],
  },
]

export type MenuDocLink = ReturnType<typeof getHeadingLinkData>

export const getHeadingGroupTitle = (headingKey: HeadingKey, locale: Locale) => {
  const group = menuGroups.find((menuGroup) => menuGroup.links.some((item) => item === headingKey))
  return group ? t(locale, 'sidebar', group.groupKey) : null
}

export const getMenuDocLinks = (locale: Locale, telefuncConfig?: TelefuncSystemConfig): MenuDocLink[] => {
  return menuGroups.flatMap((group) =>
    group.links.flatMap((item) => {
      if (typeof item === 'object' && 'dividerText' in item) {
        return []
      }

      return [getHeadingLinkData(item, locale, telefuncConfig)]
    }),
  )
}

export const getMenuNavigation = (locale: Locale, telefuncConfig?: TelefuncSystemConfig): MenuRendererGroup[] => {
  return menuGroups.map((group) => ({
    id: group.id,
    icon: group.icon,
    title: t(locale, 'sidebar', group.groupKey),
    collapsible: group.collapsible,
    links: group.links.map((item) => {
      if (typeof item === 'object' && 'dividerText' in item) {
        return {
          id: `divider-${item.dividerText}`,
          title: item.dividerText,
          isDivider: true,
        }
      }
      return getHeadingData(item, locale, telefuncConfig)
    }),
  }))
}
