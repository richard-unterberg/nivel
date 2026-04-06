import { cmMerge } from '@classmatejs/react'
import { useEffect } from 'react'
import { create } from 'zustand'
import type { ResolvedDocsSection, ResolvedSidebarGroup, ResolvedSidebarNode } from '../../../docs/types.js'
import { withSiteBaseUrl } from '../../../shared/assets.js'
import { renderInlineMarkdown } from '../../../shared/renderInlineMarkdown.js'
import { containsActiveHref, getGroupLandingPage, getVisibleGroupItems, hasActiveItem } from './docsNavigation.js'

type SidebarDisclosureState = {
  openNodes: Record<string, boolean>
  setNodeOpen: (nodeId: string, isOpen: boolean) => void
}

const useSidebarDisclosureStore = create<SidebarDisclosureState>()((set) => ({
  openNodes: {},
  setNodeOpen: (nodeId, isOpen) =>
    set((state) => {
      if (state.openNodes[nodeId] === isOpen) {
        return state
      }

      return {
        openNodes: {
          ...state.openNodes,
          [nodeId]: isOpen,
        },
      }
    }),
}))

const useAutoOpenDetails = (nodeId: string, isOpenByDefault: boolean, hasActiveDescendant: boolean) => {
  const storedOpen = useSidebarDisclosureStore((state) => state.openNodes[nodeId])
  const setNodeOpen = useSidebarDisclosureStore((state) => state.setNodeOpen)
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

const SidebarDivider = ({ title }: { title: string }) => {
  return (
    <li className="ml-3 mt-2 mb-2 border-b border-base-muted-light text-xs text-base-muted-medium pointer-events-none font-semibold">
      <span className="-ml-3">{renderInlineMarkdown(title, { codeClassName: 'text-sm!' })}</span>
    </li>
  )
}

interface SidebarGroupTitleProps {
  title: string
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
      {renderInlineMarkdown(title, { codeClassName: 'text-sm!' })}
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

interface SidebarItemListProps {
  items: ResolvedSidebarNode[]
  currentHref: string
}

const SidebarItemList = ({ items, currentHref }: SidebarItemListProps) => {
  return (
    <ul className="menu">
      {items.map((item) => {
        if (item.kind === 'divider') {
          return <SidebarDivider key={item.id} title={item.title} />
        }

        if (item.kind === 'page') {
          return <SidebarPageLink key={item.id} title={item.navTitle} href={item.href} currentHref={currentHref} />
        }

        return <SidebarNestedGroup key={item.id} group={item} currentHref={currentHref} />
      })}
    </ul>
  )
}

interface SidebarNestedGroupProps {
  group: ResolvedSidebarGroup
  currentHref: string
}

const SidebarNestedGroup = ({ group, currentHref }: SidebarNestedGroupProps) => {
  const landingPage = getGroupLandingPage(group)
  const visibleItems = getVisibleGroupItems(group, landingPage)
  const isCollapsible = group.collapsible !== undefined
  const isOpenByDefault = group.collapsible?.isDefaultOpen ?? true
  const nestedHasActiveItem = landingPage?.href === currentHref || hasActiveItem(visibleItems, currentHref)
  const { isOpen, setIsOpen } = useAutoOpenDetails(`group:${group.id}`, isOpenByDefault, nestedHasActiveItem)

  if (!isCollapsible) {
    return (
      <li>
        <div className="px-4 py-2">
          <SidebarGroupTitle
            title={group.title}
            href={landingPage?.href}
            isActive={nestedHasActiveItem}
            allowNavigation={Boolean(landingPage)}
          />
        </div>
        {visibleItems.length > 0 ? <SidebarItemList items={visibleItems} currentHref={currentHref} /> : null}
      </li>
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
            href={landingPage?.href}
            isActive={nestedHasActiveItem}
            allowNavigation={Boolean(landingPage)}
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
  sections: ResolvedDocsSection[]
  activeSectionId: string
  currentHref: string
  horizontal?: boolean
}

export const Sidebar = ({ sections, activeSectionId, currentHref, horizontal }: SidebarProps) => {
  return (
    <aside className="hidden basis-76 shrink-0 lg:block">
      <div className="-ml-3 sticky top-16">
        <div className="absolute h-full w-px right-0 top-0 bg-linear-to-t to-base-muted-light via-base-muted-light pointer-events-none z-1" />
        <div className="pr-4 h-[calc(100svh-16*var(--spacing))] overflow-y-scroll overflow-x-hidden relative z-10">
          <ul className={cmMerge('menu w-full px-0 py-5 li:last-child:border-0')}>
            {sections.map((section) => (
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
}
