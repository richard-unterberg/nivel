import type { ResolvedSidebarGroup, ResolvedSidebarNode, ResolvedSidebarPage } from '../../../docs/types.js'

export const containsActiveHref = (items: ResolvedSidebarNode[], currentHref: string): boolean => {
  return items.some((item) => {
    if (item.kind === 'page') {
      return item.href === currentHref
    }

    if (item.kind === 'group') {
      return containsActiveHref(item.items, currentHref)
    }

    return false
  })
}

export const hasActiveItem = (items: ResolvedSidebarNode[], activeHref: string) => {
  return items.some((item) => {
    if (item.kind === 'group') {
      return containsActiveHref(item.items, activeHref)
    }

    return item.kind === 'page' && item.href === activeHref
  })
}

export const getGroupLandingPage = (group: ResolvedSidebarGroup) => {
  return (
    group.items.find((item): item is ResolvedSidebarPage => {
      if (item.kind !== 'page') {
        return false
      }

      return item.navTitle === group.title || item.title === group.title
    }) ?? null
  )
}

export const getVisibleGroupItems = (group: ResolvedSidebarGroup, landingPage: ResolvedSidebarPage | null) => {
  if (!landingPage) {
    return group.items
  }

  return group.items.filter((item) => item.id !== landingPage.id)
}
