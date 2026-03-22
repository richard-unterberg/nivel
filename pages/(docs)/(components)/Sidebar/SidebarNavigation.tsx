import { cmMerge } from '@classmatejs/react'
import type { LucideIcon } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { getLogicalPathname } from '@/lib/i18n/routing'

export type SidebarHeading = {
  title: ReactNode
  href: string
}

export type SidebarCategory = {
  title: ReactNode
  children?: SidebarHeading[]
}

export type SidebarGroup = {
  icon?: LucideIcon
  title: ReactNode
  links?: (SidebarHeading | SidebarCategory)[]
}

const isCategory = (item: SidebarHeading | SidebarCategory): item is SidebarCategory => 'children' in item

const isActiveHref = (currentPathname: string, href: string) => {
  const currentLogicalPathname = getLogicalPathname(currentPathname)
  const hrefLogicalPathname = getLogicalPathname(href)
  return hrefLogicalPathname === '/'
    ? currentLogicalPathname === hrefLogicalPathname
    : currentLogicalPathname.startsWith(hrefLogicalPathname)
}

const hasActiveChild = (items: (SidebarHeading | SidebarCategory)[], currentPathname: string): boolean => {
  return items.some((item) =>
    isCategory(item)
      ? Boolean(item.children) && hasActiveChild(item.children as SidebarHeading[], currentPathname)
      : isActiveHref(currentPathname, item.href),
  )
}

export const renderInlineMarkdown = (title: ReactNode): ReactNode => {
  if (typeof title !== 'string') return title

  return title.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>
    }

    return <Fragment key={index}>{part}</Fragment>
  })
}

const getSidebarItemKey = (item: SidebarHeading | SidebarCategory, index: number) => {
  return 'href' in item ? item.href : `category-${index}`
}

const SidebarLink = (props: SidebarHeading & { currentPathname: string }) => {
  return (
    <li>
      <a
        href={props.href}
        className={cmMerge(
          'text-vike-grey-300 justify-start',
          isActiveHref(props.currentPathname, props.href) && 'menu-active',
        )}
      >
        {renderInlineMarkdown(props.title)}
      </a>
    </li>
  )
}

const SidebarCategoryComponent = (props: SidebarCategory & { currentPathname: string }) => {
  const isOpen = props.children ? hasActiveChild(props.children, props.currentPathname) : false

  return (
    <li>
      <details open={isOpen}>
        <summary className="text-vike-grey-200">{renderInlineMarkdown(props.title)}</summary>
        <ul>
          {props.children?.map((item, index) => (
            <SidebarItem key={getSidebarItemKey(item, index)} item={item} currentPathname={props.currentPathname} />
          ))}
        </ul>
      </details>
    </li>
  )
}

const SidebarItem = (props: { item: SidebarHeading | SidebarCategory; currentPathname: string }) => {
  return isCategory(props.item) ? (
    <SidebarCategoryComponent {...props.item} currentPathname={props.currentPathname} />
  ) : (
    <SidebarLink {...props.item} currentPathname={props.currentPathname} />
  )
}

const SidebarGroupComponent = (props: SidebarGroup & { currentPathname: string; showSeparator: boolean }) => {
  const Icon = props.icon

  return (
    <li className="pb-4">
      <details open>
        <summary className="text-vike-grey-100">
          {Icon && <Icon className="inline w-3 h-3" />}
          <span className="text-base-content font-semibold">{renderInlineMarkdown(props.title)}</span>
        </summary>
        <ul>
          {props.links?.map((item, index) => (
            <SidebarItem key={getSidebarItemKey(item, index)} item={item} currentPathname={props.currentPathname} />
          ))}
        </ul>
      </details>
      {props.showSeparator && (
        <span className="pointer-events-none absolute -bottom-1 border-b border-base-200 block rounded-none w-full mx-auto mb-3"></span>
      )}
    </li>
  )
}

const SidebarNavigation = (props: { groups: SidebarGroup[]; currentPathname: string }) => {
  return (
    <ul className="menu w-full px-0 py-5 li:last-child:border-0">
      {props.groups.map((group, index) => (
        <SidebarGroupComponent
          key={`sidebar-group-${index}`}
          {...group}
          currentPathname={props.currentPathname}
          showSeparator={index !== props.groups.length - 1}
        />
      ))}
    </ul>
  )
}

export default SidebarNavigation
