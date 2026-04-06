import type { ResolvedSidebarGroup, ResolvedSidebarNode } from '../../../docs/types.js'

export const containsActiveHref = (items: ResolvedSidebarNode[], currentHref: string): boolean => {
  return items.some((item) => {
    if (item.kind === 'page') {
      return item.href === currentHref
    }

    return item.href === currentHref || containsActiveHref(item.items, currentHref)
  })
}

export const hasActiveItem = (items: ResolvedSidebarNode[], activeHref: string) => containsActiveHref(items, activeHref)

export const getVisibleNavItems = (items: ResolvedSidebarNode[]) => items.filter((item) => item.showInNav)

export const getVisibleGroupItems = (group: ResolvedSidebarGroup) => {
  const visibleItems = getVisibleNavItems(group.items)

  if (!group.href) {
    return visibleItems
  }

  return visibleItems.filter((item): item is ResolvedSidebarNode => {
    if (item.kind !== 'page') {
      return true
    }

    return item.href !== group.href
  })
}

export const getGroupHref = (group: ResolvedSidebarGroup): string | null => group.href ?? null
