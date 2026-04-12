import { cmMerge } from '@classmatejs/react'
import type { ReactNode } from 'react'
import { memo, useEffect, useRef } from 'react'
import type { ResolvedDocsSection, ResolvedSidebarGroup, ResolvedSidebarNode } from '../../../docs/types.js'
import { withSiteBaseUrl } from '../../../shared/assets.js'
import { renderInlineMarkdown } from '../../../shared/renderInlineMarkdown.js'
import { useDocsGlobalContext } from '../docsGlobalContext.js'
import { useDocsRouteStore, useDocsSidebarActions, useDocsSidebarStore } from '../store/runtime-store.js'
import {
  containsActiveHref,
  getGroupHref,
  getVisibleGroupItems,
  getVisibleNavItems,
  hasActiveItem,
} from './docsNavigation.js'

const useAutoOpenDetails = (nodeId: string, isOpenByDefault: boolean, hasActiveDescendant: boolean) => {
  const storedOpen = useDocsSidebarStore((state) => state.openNodes[nodeId])
  const { setNodeOpen } = useDocsSidebarActions()
  const isOpen = storedOpen === undefined ? isOpenByDefault || hasActiveDescendant : storedOpen || hasActiveDescendant

  useEffect(() => {
    if (hasActiveDescendant) {
      setNodeOpen(nodeId, true)
      return
    }

    if (storedOpen === undefined && isOpenByDefault) {
      setNodeOpen(nodeId, true)
    }
  }, [hasActiveDescendant, isOpenByDefault, nodeId, setNodeOpen, storedOpen])

  return {
    isOpen,
    setIsOpen: (nextOpen: boolean) => setNodeOpen(nodeId, nextOpen),
  }
}

interface SidebarPageLinkProps {
  title: string
  href: string
  currentHref: string
}

const SidebarPageLink = ({ title, href, currentHref }: SidebarPageLinkProps) => {
  return (
    <li>
      <a
        href={withSiteBaseUrl(href)}
        className={cmMerge(
          'text-base-muted hover:text-base-content justify-start hover:bg-base-200',
          href === currentHref && 'text-primary! font-semibold bg-base-200',
        )}
      >
        {renderInlineMarkdown(title, { codeClassName: 'text-sm!' })}
      </a>
    </li>
  )
}

const SidebarGroupDivider = ({ title }: { title: string }) => {
  return (
    <li className="ml-3 mt-2 mb-2 border-b border-base-muted-light text-xs text-base-muted-medium pointer-events-none font-semibold">
      <span className="-ml-3">{renderInlineMarkdown(title, { codeClassName: 'text-sm!' })}</span>
    </li>
  )
}

interface SidebarGroupTitleProps {
  title?: string
  href?: string
  isActive: boolean
  allowNavigation?: boolean
}

const SidebarGroupTitle = ({ title, href, isActive, allowNavigation = false }: SidebarGroupTitleProps) => {
  const content = (
    <span
      className={cmMerge(
        allowNavigation ? 'font-medium' : 'font-semibold',
        isActive && allowNavigation && 'text-primary!',
      )}
    >
      {title ? renderInlineMarkdown(title, { codeClassName: 'text-sm!' }) : null}
    </span>
  )

  if (allowNavigation && href) {
    return (
      <a
        href={withSiteBaseUrl(href)}
        className={cmMerge(
          'flex items-center gap-2 text-base-muted hover:text-base-content no-underline',
          isActive && 'text-primary! font-semibold',
        )}
      >
        {content}
      </a>
    )
  }

  return <span className="flex items-center gap-2 text-base-content">{content}</span>
}

const renderSidebarItems = (items: ResolvedSidebarNode[], currentHref: string): ReactNode[] => {
  return items.map((item) => {
    if (item.kind === 'page') {
      return <SidebarPageLink key={item.id} title={item.navTitle} href={item.href} currentHref={currentHref} />
    }

    return <SidebarNestedGroup key={item.id} group={item} currentHref={currentHref} />
  })
}

interface SidebarItemListProps {
  items: ResolvedSidebarNode[]
  currentHref: string
}

const SidebarItemList = ({ items, currentHref }: SidebarItemListProps) => {
  const visibleItems = getVisibleNavItems(items)

  return <ul className="menu w-full">{renderSidebarItems(visibleItems, currentHref)}</ul>
}

interface SidebarNestedGroupProps {
  group: ResolvedSidebarGroup
  currentHref: string
}

const SidebarNestedGroup = ({ group, currentHref }: SidebarNestedGroupProps) => {
  const groupHref = getGroupHref(group)
  const visibleItems = getVisibleGroupItems(group)
  const isCollapsible = group.collapsible !== undefined
  const isOpenByDefault = group.collapsible?.isDefaultOpen ?? true
  const nestedHasActiveItem = groupHref === currentHref || hasActiveItem(group.items, currentHref)
  const { isOpen, setIsOpen } = useAutoOpenDetails(`group:${group.id}`, isOpenByDefault, nestedHasActiveItem)

  if (!isCollapsible) {
    if (!group.title) {
      return <>{renderSidebarItems(visibleItems, currentHref)}</>
    }

    return (
      <>
        <SidebarGroupDivider title={group.title} />
        {renderSidebarItems(visibleItems, currentHref)}
      </>
    )
  }

  return (
    <li>
      <details
        open={isOpen}
        onToggle={(event) => {
          setIsOpen(event.currentTarget.open)
        }}
      >
        <summary>
          <SidebarGroupTitle
            title={group.title}
            href={groupHref ?? undefined}
            isActive={nestedHasActiveItem}
            allowNavigation={Boolean(groupHref)}
          />
        </summary>
        {visibleItems.length > 0 ? <SidebarItemList items={visibleItems} currentHref={currentHref} /> : null}
      </details>
    </li>
  )
}

interface SidebarSectionGroupProps {
  section: ResolvedDocsSection
  currentHref: string
  activeSectionId: string
}

const SidebarSectionGroup = ({ section, currentHref, activeSectionId }: SidebarSectionGroupProps) => {
  const sectionHasActiveItem = section.id === activeSectionId || containsActiveHref(section.items, currentHref)
  const { isOpen, setIsOpen } = useAutoOpenDetails(
    `section:${section.id}`,
    section.id === activeSectionId,
    sectionHasActiveItem,
  )

  return (
    <li className="pb-4">
      <details
        open={isOpen}
        onToggle={(event) => {
          setIsOpen(event.currentTarget.open)
        }}
      >
        <summary>
          <SidebarGroupTitle title={section.title} isActive={sectionHasActiveItem} />
        </summary>
        <SidebarItemList items={section.items} currentHref={currentHref} />
      </details>
    </li>
  )
}

interface SidebarProps {
  currentHref?: string
  activeSectionId?: string
}

export const Sidebar = memo(
  ({ currentHref: currentHrefProp = '', activeSectionId: activeSectionIdProp = '' }: SidebarProps) => {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const currentHref = useDocsRouteStore((state) => state.currentHref) || currentHrefProp
    const activeSectionId = useDocsRouteStore((state) => state.currentSectionId ?? '') || activeSectionIdProp
    const { sidebarSections } = useDocsGlobalContext()

    return (
      <aside className="hidden basis-76 shrink-0 lg:block">
        <div className="-ml-3 sticky top-16">
          <div className="absolute h-full w-px right-0 top-0 bg-linear-to-t to-base-muted-light via-base-muted-light pointer-events-none z-1" />
          <div
            ref={scrollContainerRef}
            className="pr-4 h-[calc(100svh-16*var(--spacing))] overflow-y-scroll overflow-x-hidden relative z-10"
          >
            <ul className={cmMerge('menu w-full px-0 py-5 li:last-child:border-0')}>
              {sidebarSections.map((section) => (
                <SidebarSectionGroup
                  key={section.id}
                  section={section}
                  currentHref={currentHref}
                  activeSectionId={activeSectionId}
                />
              ))}
            </ul>
          </div>
        </div>
      </aside>
    )
  },
)
