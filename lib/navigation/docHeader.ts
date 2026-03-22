import type { ReactNode } from 'react'
import { getHeadingTitleFromHref } from '@/lib/headings'
import { type Locale } from '@/lib/i18n/config'
import { t } from '@/lib/i18n/messages'
import { getLogicalPathname } from '@/lib/i18n/routing'
import { getApiNavigation } from '@/lib/navigation/apiNavigation'
import { getMenuNavigation } from '@/lib/navigation/menuNavigation'
import type {
  SidebarCategory,
  SidebarGroup,
  SidebarHeading,
} from '@/pages/(docs)/(components)/Sidebar/SidebarNavigation'

export type DocHeaderMeta = {
  title: ReactNode
  groupTitle: ReactNode
  categoryTitle?: ReactNode
}

const isCategory = (item: SidebarHeading | SidebarCategory): item is SidebarCategory => 'children' in item

const isSameDocPath = (pathname: string, href: string) => {
  return getLogicalPathname(pathname) === getLogicalPathname(href)
}

const findInGroups = (groups: SidebarGroup[], pathname: string): DocHeaderMeta | null => {
  for (const group of groups) {
    for (const item of group.links ?? []) {
      if (isCategory(item)) {
        for (const child of item.children ?? []) {
          if (isSameDocPath(pathname, child.href)) {
            return {
              title: child.title,
              groupTitle: group.title,
              categoryTitle: item.title,
            }
          }
        }
        continue
      }

      if (isSameDocPath(pathname, item.href)) {
        return {
          title: item.title,
          groupTitle: group.title,
        }
      }
    }
  }

  return null
}

export const getDocHeaderMeta = (pathname: string, locale: Locale): DocHeaderMeta | null => {
  const navigationMeta =
    findInGroups(getMenuNavigation(locale), pathname) ?? findInGroups(getApiNavigation(locale), pathname)
  if (navigationMeta) return navigationMeta

  const title = getHeadingTitleFromHref(pathname, locale)
  if (!title) return null

  return {
    title,
    groupTitle: t(locale, 'sidebar', 'other'),
  }
}
