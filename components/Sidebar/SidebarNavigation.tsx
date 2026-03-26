import { cmMerge } from '@classmatejs/react'
import type { LucideIcon } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { getLogicalPathname } from '@/lib/i18n/routing'

export type SidebarHeading = {
  title: ReactNode
  href: string
}

export type SidebarGroup = {
  id: string
  icon?: LucideIcon
  title: ReactNode
  links?: SidebarHeading[]
}

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

const getActiveHref = (groups: SidebarGroup[], currentPathname: string) => {
  let activeHref: string | null = null
  let activeHrefLength = -1

  for (const group of groups) {
    for (const link of group.links ?? []) {
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

const getSidebarItemKey = (item: SidebarHeading, index: number) => `${item.href}::${index}`

const SidebarLink = (props: SidebarHeading & { activeHref: string | null }) => {
  return (
    <li>
      <a
        href={props.href}
        className={cmMerge(
          'text-vike-grey-200 justify-start hover:bg-base-200',
          props.activeHref === props.href && 'menu-active text-accent font-semibold bg-base-200',
        )}
      >
        {renderInlineMarkdown(props.title)}
      </a>
    </li>
  )
}

const SidebarGroupComponent = (props: SidebarGroup & { activeHref: string | null; showSeparator: boolean }) => {
  const Icon = props.icon

  return (
    <li className="pb-4">
      <span className="text-vike-grey-100 pointer-events-none">
        {Icon && <Icon className="inline w-3 h-3" />}
        <span className="text-base-content font-semibold">{renderInlineMarkdown(props.title)}</span>
      </span>
      <ul>
        {props.links?.map((item, index) => (
          <SidebarLink key={getSidebarItemKey(item, index)} {...item} activeHref={props.activeHref} />
        ))}
      </ul>
      {props.showSeparator && (
        <span className="pointer-events-none absolute -bottom-1 border-b border-base-200 block rounded-none w-full mx-auto mb-3"></span>
      )}
    </li>
  )
}

const SidebarNavigation = (props: { groups: SidebarGroup[]; currentPathname: string }) => {
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
