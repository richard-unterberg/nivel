import { cmMerge } from '@classmatejs/react'
import { Fragment, type MouseEvent, type ReactNode, useEffect, useRef } from 'react'
import { navigate } from 'vike/client/router'
import { getLogicalPathname } from '@/lib/i18n/routing'
import type { MenuRendererGroup, SidebarGroupItem, SidebarItem, SidebarLinkItem } from '@/lib/navigation/navigation'

const isSidebarLink = (item: SidebarItem): item is SidebarLinkItem => 'href' in item && !('items' in item)

const isSidebarGroup = (item: SidebarItem): item is SidebarGroupItem => 'items' in item

const isActiveHref = (currentPathname: string, href: string) => {
  const normalizeLogicalPathname = (pathname: string) => {
    const logicalPathname = getLogicalPathname(pathname)
    return logicalPathname === '/' ? '/' : logicalPathname.replace(/\/+$/g, '')
  }
  const currentLogicalPathname = normalizeLogicalPathname(currentPathname)
  const hrefLogicalPathname = normalizeLogicalPathname(href)

  if (hrefLogicalPathname === '/') {
    return currentLogicalPathname === hrefLogicalPathname
  }

  return currentLogicalPathname === hrefLogicalPathname || currentLogicalPathname.startsWith(`${hrefLogicalPathname}/`)
}

const getActiveHrefFromItems = (items: SidebarItem[] | undefined, currentPathname: string) => {
  let activeHref: string | null = null
  let activeHrefLength = -1

  for (const item of items ?? []) {
    if (isSidebarGroup(item)) {
      if (item.href && isActiveHref(currentPathname, item.href)) {
        const hrefLength = getLogicalPathname(item.href).length

        if (hrefLength > activeHrefLength) {
          activeHref = item.href
          activeHrefLength = hrefLength
        }
      }

      const nestedActiveHref = getActiveHrefFromItems(item.items, currentPathname)

      if (!nestedActiveHref) {
        continue
      }

      const nestedHrefLength = getLogicalPathname(nestedActiveHref).length

      if (nestedHrefLength > activeHrefLength) {
        activeHref = nestedActiveHref
        activeHrefLength = nestedHrefLength
      }

      continue
    }

    if (!isSidebarLink(item) || !isActiveHref(currentPathname, item.href)) {
      continue
    }

    const hrefLength = getLogicalPathname(item.href).length

    if (hrefLength > activeHrefLength) {
      activeHref = item.href
      activeHrefLength = hrefLength
    }
  }

  return activeHref
}

const getActiveHref = (groups: MenuRendererGroup[], currentPathname: string) => {
  let activeHref: string | null = null
  let activeHrefLength = -1

  for (const group of groups) {
    const groupActiveHref = getActiveHrefFromItems(group.items, currentPathname)

    if (!groupActiveHref) {
      continue
    }

    const hrefLength = getLogicalPathname(groupActiveHref).length

    if (hrefLength > activeHrefLength) {
      activeHref = groupActiveHref
      activeHrefLength = hrefLength
    }
  }

  return activeHref
}

const hasActiveItem = (items: SidebarItem[] | undefined, activeHref: string | null): boolean => {
  return (items ?? []).some((item) => {
    if (isSidebarGroup(item)) {
      return item.href === activeHref || hasActiveItem(item.items, activeHref)
    }

    return isSidebarLink(item) && item.href === activeHref
  })
}

const renderInlineMarkdown = (title: ReactNode): ReactNode => {
  if (typeof title !== 'string') return title

  return title.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: not worth the effort
        <code className="text-sm!" key={index}>
          {part.slice(1, -1)}
        </code>
      )
    }

    // biome-ignore lint/suspicious/noArrayIndexKey: not worth the effort
    return <Fragment key={index}>{part}</Fragment>
  })
}

const getSidebarItemKey = (item: SidebarItem, index: number) => {
  if (isSidebarGroup(item)) {
    return item.id
  }

  return ('href' in item ? item.href : item.id) ?? `sidebar-item-${index}`
}

const SidebarLink = (props: SidebarLinkItem & { activeHref: string | null }) => {
  return (
    <li>
      <a
        href={props.href}
        className={cmMerge(
          'text-base-muted hover:text-base-content justify-start hover:bg-base-200',
          props.activeHref === props.href && 'text-primary! font-semibold bg-base-200',
        )}
      >
        {renderInlineMarkdown(props.title)}
      </a>
    </li>
  )
}

const SidebarDivider = (props: { title: ReactNode }) => {
  return (
    <li className="ml-3 mt-2 mb-2 border-b border-base-muted-light text-xs text-base-muted-medium pointer-events-none font-semibold">
      <span className="-ml-3">{renderInlineMarkdown(props.title)}</span>
    </li>
  )
}

const shouldUseClientNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  )
}

const SidebarGroupTitle = (props: {
  title: ReactNode
  icon?: MenuRendererGroup['icon']
  href?: string
  activeHref: string | null
  isActive: boolean
  allowNavigation?: boolean
}) => {
  const content = (
    <>
      {props.icon && <props.icon className="inline w-3 h-3" />}
      <span
        className={cmMerge(
          props.allowNavigation ? 'font-medium' : 'font-semibold',
          props.isActive && (props.allowNavigation ? 'text-primary!' : 'text-base-content'),
        )}
      >
        {renderInlineMarkdown(props.title)}
      </span>
    </>
  )

  if (props.allowNavigation && props.href) {
    const href = props.href

    return (
      <a
        href={href}
        onClick={(event) => {
          event.stopPropagation()

          if (!shouldUseClientNavigation(event)) {
            return
          }

          event.preventDefault()
          void navigate(href)
        }}
        className={cmMerge(
          'flex items-center gap-2 text-base-muted hover:text-base-content no-underline',
          props.activeHref === href && 'text-primary! font-semibold',
        )}
      >
        {content}
      </a>
    )
  }

  return (
    <span className={cmMerge('flex items-center gap-2 text-base-content', !props.allowNavigation && 'font-semibold')}>
      {content}
    </span>
  )
}

const SidebarItemList = (props: { items: SidebarItem[]; activeHref: string | null }) => {
  return (
    <ul>
      {props.items.map((item, index) => {
        if (isSidebarGroup(item)) {
          return <SidebarNestedGroup key={getSidebarItemKey(item, index)} {...item} activeHref={props.activeHref} />
        }

        if (isSidebarLink(item)) {
          return <SidebarLink key={getSidebarItemKey(item, index)} {...item} activeHref={props.activeHref} />
        }

        return <SidebarDivider key={getSidebarItemKey(item, index)} title={item.title} />
      })}
    </ul>
  )
}

const SidebarNestedGroup = (props: SidebarGroupItem & { activeHref: string | null }) => {
  const isCollapsible = props.collapsible !== false && props.collapsible !== undefined
  const isOpenByDefault = typeof props.collapsible === 'object' ? (props.collapsible.isDefaultOpen ?? true) : false
  const nestedHasActiveItem = props.href === props.activeHref || hasActiveItem(props.items, props.activeHref)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const hasMountedRef = useRef(false)
  const wasActiveRef = useRef(nestedHasActiveItem)

  useEffect(() => {
    if (!isCollapsible || !detailsRef.current) {
      return
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true

      if (isOpenByDefault || nestedHasActiveItem) {
        detailsRef.current.open = true
      }

      wasActiveRef.current = nestedHasActiveItem
      return
    }

    if (nestedHasActiveItem && !wasActiveRef.current) {
      detailsRef.current.open = true
    }

    wasActiveRef.current = nestedHasActiveItem
  }, [isCollapsible, isOpenByDefault, nestedHasActiveItem])

  return (
    <li>
      {isCollapsible ? (
        <details ref={detailsRef}>
          <summary>
            <SidebarGroupTitle
              title={props.title}
              href={props.href}
              activeHref={props.activeHref}
              isActive={nestedHasActiveItem}
              allowNavigation
            />
          </summary>
          <SidebarItemList items={props.items} activeHref={props.activeHref} />
        </details>
      ) : (
        <>
          <div className="px-4 py-2">
            <SidebarGroupTitle
              title={props.title}
              href={props.href}
              activeHref={props.activeHref}
              isActive={nestedHasActiveItem}
              allowNavigation
            />
          </div>
          <SidebarItemList items={props.items} activeHref={props.activeHref} />
        </>
      )}
    </li>
  )
}

const SidebarGroupComponent = (props: MenuRendererGroup & { activeHref: string | null; showSeparator: boolean }) => {
  const isCollapsible = props.collapsible !== false && props.collapsible !== undefined
  const isOpenByDefault = typeof props.collapsible === 'object' ? (props.collapsible.isDefaultOpen ?? true) : false
  const groupHasActiveItem = hasActiveItem(props.items, props.activeHref)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const hasMountedRef = useRef(false)
  const wasActiveRef = useRef(groupHasActiveItem)

  useEffect(() => {
    if (!isCollapsible || !detailsRef.current) {
      return
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true

      if (isOpenByDefault || groupHasActiveItem) {
        detailsRef.current.open = true
      }

      wasActiveRef.current = groupHasActiveItem
      return
    }

    if (groupHasActiveItem && !wasActiveRef.current) {
      detailsRef.current.open = true
    }

    wasActiveRef.current = groupHasActiveItem
  }, [groupHasActiveItem, isCollapsible, isOpenByDefault])

  return (
    <li className="pb-4">
      {isCollapsible ? (
        <details ref={detailsRef}>
          <summary>
            <SidebarGroupTitle
              icon={props.icon}
              title={props.title}
              activeHref={props.activeHref}
              isActive={groupHasActiveItem}
            />
          </summary>
          <SidebarItemList items={props.items ?? []} activeHref={props.activeHref} />
        </details>
      ) : (
        <>
          <span className="pointer-events-none">
            <SidebarGroupTitle
              icon={props.icon}
              title={props.title}
              activeHref={props.activeHref}
              isActive={groupHasActiveItem}
            />
          </span>
          <SidebarItemList items={props.items ?? []} activeHref={props.activeHref} />
        </>
      )}
      {props.showSeparator && (
        <span className="pointer-events-none absolute -bottom-1 block rounded-none w-full mx-auto mb-3"></span>
      )}
    </li>
  )
}

const SidebarNavigation = (props: { groups: MenuRendererGroup[]; currentPathname: string }) => {
  const activeHref = getActiveHref(props.groups, props.currentPathname)

  return (
    <ul className="menu w-full px-0 py-5 li:last-child:border-0">
      {props.groups.map((group, index) => (
        <SidebarGroupComponent
          key={`sidebar-group-${group.id}`}
          {...group}
          activeHref={activeHref}
          showSeparator={index !== props.groups.length - 1}
        />
      ))}
    </ul>
  )
}

export default SidebarNavigation
