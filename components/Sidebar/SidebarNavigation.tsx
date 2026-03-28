import { cmMerge } from '@classmatejs/react'
import { Fragment, type ReactNode, useEffect, useRef } from 'react'
import { getLogicalPathname } from '@/lib/i18n/routing'
import type { MenuRendererGroup, SidebarItem, SidebarLinkItem } from '@/lib/types'

const isSidebarLink = (item: SidebarItem): item is SidebarLinkItem => 'href' in item

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

const getActiveHref = (groups: MenuRendererGroup[], currentPathname: string) => {
  let activeHref: string | null = null
  let activeHrefLength = -1

  for (const group of groups) {
    for (const link of group.links ?? []) {
      if (!isSidebarLink(link)) {
        continue
      }

      if (!isActiveHref(currentPathname, link.href)) {
        continue
      }

      const hrefLength = getLogicalPathname(link.href).length

      if (hrefLength > activeHrefLength) {
        activeHref = link.href
        activeHrefLength = hrefLength
      }
    }
  }

  return activeHref
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

const getSidebarItemKey = (item: SidebarItem, index: number) =>
  ('href' in item ? item.href : item.id) ?? `sidebar-item-${index}`

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
    <li className="ml-3 mt-2 text-xs text-base-muted-medium pointer-events-none font-semibold border-b border-base-muted-light mb-2">
      <span className="-ml-3">{renderInlineMarkdown(props.title)}</span>
    </li>
  )
}

const SidebarGroupLabel = (props: Pick<MenuRendererGroup, 'icon' | 'title'>) => {
  const Icon = props.icon

  return (
    <>
      {Icon && <Icon className="inline w-3 h-3" />}
      <span className="text-base-content font-semibold">{renderInlineMarkdown(props.title)}</span>
    </>
  )
}

const SidebarGroupComponent = (props: MenuRendererGroup & { activeHref: string | null; showSeparator: boolean }) => {
  const isCollapsible = props.collapsible !== false && props.collapsible !== undefined
  const isOpenByDefault = typeof props.collapsible === 'object' ? (props.collapsible.isDefaultOpen ?? true) : false
  const hasActiveLink = (props.links ?? []).some((link) => isSidebarLink(link) && link.href === props.activeHref)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const hasMountedRef = useRef(false)
  const wasActiveRef = useRef(hasActiveLink)

  useEffect(() => {
    if (!isCollapsible || !detailsRef.current) {
      return
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true

      if (isOpenByDefault || hasActiveLink) {
        detailsRef.current.open = true
      }

      wasActiveRef.current = hasActiveLink
      return
    }

    if (hasActiveLink && !wasActiveRef.current) {
      detailsRef.current.open = true
    }

    wasActiveRef.current = hasActiveLink
  }, [hasActiveLink, isCollapsible, isOpenByDefault])

  return (
    <li className="pb-4">
      {isCollapsible ? (
        <details ref={detailsRef}>
          <summary>
            <SidebarGroupLabel icon={props.icon} title={props.title} />
          </summary>
          <ul>
            {props.links?.map((item, index) =>
              isSidebarLink(item) ? (
                <SidebarLink key={getSidebarItemKey(item, index)} {...item} activeHref={props.activeHref} />
              ) : (
                <SidebarDivider key={getSidebarItemKey(item, index)} title={item.title} />
              ),
            )}
          </ul>
        </details>
      ) : (
        <>
          <span className="pointer-events-none">
            <SidebarGroupLabel icon={props.icon} title={props.title} />
          </span>
          <ul>
            {props.links?.map((item, index) =>
              isSidebarLink(item) ? (
                <SidebarLink key={getSidebarItemKey(item, index)} {...item} activeHref={props.activeHref} />
              ) : (
                <SidebarDivider key={getSidebarItemKey(item, index)} title={item.title} />
              ),
            )}
          </ul>
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
