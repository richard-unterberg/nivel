import type { LucideIcon } from 'lucide-react'
import { Compass, Map, Plug, Rocket, Sprout } from 'lucide-react'
import type { SidebarCategory, SidebarGroup } from '@/docs/(components)/Sidebar/SidebarNavigation'
import { getHeadingData, type HeadingKey } from '@/lib/headings-flat'
import type { Locale } from '@/lib/i18n/config'
import { t } from '@/lib/i18n/messages'

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
    links: ['scaffoldNewVikeApp', 'addSsrSsgToVite'],
  },
  {
    icon: Compass,
    titleKey: 'overview',
    links: ['whyVike', 'faq', 'openSourcePricing', 'freeProgram', 'extensions', 'team'],
  },
  {
    icon: Map,
    titleKey: 'guides',
    links: [
      {
        titleKey: 'basics',
        headings: ['dataFetching', 'preRendering', 'ssrVsSpa', 'headTags', 'commonIssues'],
      },
      {
        titleKey: 'routing',
        headings: ['routing', 'baseUrl', 'activeLinks'],
      },
      {
        titleKey: 'more',
        headings: [
          'staticDirectory',
          'serverClient',
          'environmentVariables',
          'httpHeaders',
          'i18n',
          'pathAliases',
          'preloading',
          'apiRoutes',
        ],
      },
    ],
  },
  {
    icon: Rocket,
    titleKey: 'deploy',
    links: [
      {
        titleKey: 'staticHosts',
        headings: ['staticHostsOverview', 'githubPages', 'netlify', 'cloudflarePages'],
      },
      {
        titleKey: 'serverless',
        headings: ['cloudflare', 'vercel', 'awsLambda', 'netlifyFunctions', 'edgeonePages'],
      },
      {
        titleKey: 'selfHosted',
        headings: ['aws', 'docker', 'selfHostedOther'],
      },
      'otherDeployment',
    ],
  },
  {
    icon: Plug,
    titleKey: 'integration',
    links: [
      'authentication',
      'serverIntegration',
      'errorTracking',
      'cssInJs',
      'markdown',
      'store',
      'graphql',
      'vanillaUiTools',
      'analytics',
      'componentLibraries',
      'dataFetchingIntegration',
      'serviceWorker',
      'viewTransitions',
      'uiFramework',
      'seeAlso',
    ],
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
