import { maMerge } from '@marmo/react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { memo, useEffect, useRef } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { getDocsIconMapKey } from '../../../docs/iconKeys.js'
import { getActiveSectionByPathname } from '../../../docs/runtime.js'
import type {
  DocsIconMap,
  ResolvedDocsSection,
  ResolvedSidebarGroup,
  ResolvedSidebarNode,
} from '../../../docs/types.js'
import { withSiteBaseUrl } from '../../../shared/assets.js'
import { renderInlineMarkdown } from '../../../shared/renderInlineMarkdown.js'
import { useDocsGlobalContext } from '../docsGlobalContext.js'
import { useDocsSidebarActions, useDocsSidebarStore } from '../store/runtime-store.js'
import {
  containsActiveHref,
  getGroupHref,
  getVisibleGroupItems,
  getVisibleNavItems,
  hasActiveItem,
} from './docsNavigation.js'
import StickyContent from './StickyContent.js'

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
  icon?: LucideIcon
  onNavigate?: () => void
}

const SidebarPageLink = ({ title, href, currentHref, icon: Icon, onNavigate }: SidebarPageLinkProps) => {
  return (
    <li className="rounded-none">
      <a
        href={withSiteBaseUrl(href)}
        onClick={onNavigate}
        className={maMerge(
          'rounded-field py-1.5 text-base-muted hover:text-base-content justify-start hover:bg-base-200',
          href === currentHref && 'text-primary! bg-base-200',
        )}
      >
        <span className="flex items-center gap-2">
          {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
          <span>{renderInlineMarkdown(title, { codeClassName: 'text-sm!' })}</span>
        </span>
      </a>
    </li>
  )
}

const SidebarGroupDivider = ({ title, icon: Icon }: { title: string; icon?: LucideIcon }) => {
  return (
    <li className="ml-3 mt-2 mb-2 border-b border-base-muted-light text-xs text-base-muted-medium pointer-events-none font-semibold">
      <span className="-ml-3 flex items-center gap-2">
        {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
        <span>{renderInlineMarkdown(title, { codeClassName: 'text-sm!' })}</span>
      </span>
    </li>
  )
}

interface SidebarGroupTitleProps {
  title?: string
  href?: string
  isActive: boolean
  allowNavigation?: boolean
  icon?: LucideIcon
  onNavigate?: () => void
}

const SidebarGroupTitle = ({
  title,
  href,
  isActive,
  allowNavigation = false,
  icon: Icon,
  onNavigate,
}: SidebarGroupTitleProps) => {
  const content = (
    <span className="flex items-center gap-2 font-base">
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
      <span className={maMerge(isActive && allowNavigation && 'text-primary!')}>
        {title ? renderInlineMarkdown(title, { codeClassName: 'text-sm!' }) : null}
      </span>
    </span>
  )

  if (allowNavigation && href) {
    return (
      <a
        href={withSiteBaseUrl(href)}
        onClick={onNavigate}
        className={maMerge(
          'flex items-center gap-2 rounded-field py-1 text-base-muted hover:text-base-content no-underline',
          isActive && 'text-primary!',
        )}
      >
        {content}
      </a>
    )
  }

  return <span className="flex  items-center gap-2 rounded-field py-1 text-base-content">{content}</span>
}

const renderSidebarItems = (
  items: ResolvedSidebarNode[],
  currentHref: string,
  docsIconMap: DocsIconMap,
  onNavigate?: () => void,
): ReactNode[] => {
  return items.map((item) => {
    if (item.kind === 'page') {
      return (
        <SidebarPageLink
          key={item.id}
          title={item.navTitle}
          href={item.href}
          currentHref={currentHref}
          icon={docsIconMap[getDocsIconMapKey('page', item.id)]}
          onNavigate={onNavigate}
        />
      )
    }

    return (
      <SidebarNestedGroup
        key={item.id}
        group={item}
        currentHref={currentHref}
        docsIconMap={docsIconMap}
        onNavigate={onNavigate}
      />
    )
  })
}

interface SidebarItemListProps {
  items: ResolvedSidebarNode[]
  currentHref: string
  docsIconMap: DocsIconMap
  onNavigate?: () => void
}

const SidebarItemList = ({ items, currentHref, docsIconMap, onNavigate }: SidebarItemListProps) => {
  const visibleItems = getVisibleNavItems(items)

  return (
    <ul className="menu py-0.5 lg:w-[97%]">{renderSidebarItems(visibleItems, currentHref, docsIconMap, onNavigate)}</ul>
  )
}

interface SidebarNestedGroupProps {
  group: ResolvedSidebarGroup
  currentHref: string
  docsIconMap: DocsIconMap
  onNavigate?: () => void
}

const SidebarNestedGroup = ({ group, currentHref, docsIconMap, onNavigate }: SidebarNestedGroupProps) => {
  const groupHref = getGroupHref(group)
  const visibleItems = getVisibleGroupItems(group)
  const isCollapsible = group.collapsible !== undefined
  const isOpenByDefault = group.collapsible?.isDefaultOpen ?? true
  const nestedHasActiveItem = groupHref === currentHref || hasActiveItem(group.items, currentHref)
  const { isOpen, setIsOpen } = useAutoOpenDetails(`group:${group.id}`, isOpenByDefault, nestedHasActiveItem)
  const GroupIcon = docsIconMap[getDocsIconMapKey('group', group.id)]

  if (!isCollapsible) {
    if (!group.title) {
      return <>{renderSidebarItems(visibleItems, currentHref, docsIconMap, onNavigate)}</>
    }

    return (
      <>
        <SidebarGroupDivider title={group.title} icon={GroupIcon} />
        {renderSidebarItems(visibleItems, currentHref, docsIconMap, onNavigate)}
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
        <summary className="py-0.5 rounded-field py-0 flex items-center">
          <SidebarGroupTitle
            title={group.title}
            href={groupHref ?? undefined}
            isActive={nestedHasActiveItem}
            allowNavigation={Boolean(groupHref)}
            icon={GroupIcon}
            onNavigate={onNavigate}
          />
        </summary>
        {visibleItems.length > 0 ? (
          <SidebarItemList
            items={visibleItems}
            currentHref={currentHref}
            docsIconMap={docsIconMap}
            onNavigate={onNavigate}
          />
        ) : null}
      </details>
    </li>
  )
}

interface SidebarSectionGroupProps {
  section: ResolvedDocsSection
  currentHref: string
  activeSectionId: string
  onNavigate?: () => void
}

const SidebarSectionGroup = ({ section, currentHref, activeSectionId, onNavigate }: SidebarSectionGroupProps) => {
  const docs = useDocsGlobalContext()
  const SectionIcon = docs.docsIconMap[getDocsIconMapKey('section', section.id)]
  const sectionHasActiveItem = section.id === activeSectionId || containsActiveHref(section.items, currentHref)
  const { isOpen, setIsOpen } = useAutoOpenDetails(
    `section:${section.id}`,
    section.id === activeSectionId,
    sectionHasActiveItem,
  )

  if (!section.title) {
    return <>{renderSidebarItems(getVisibleNavItems(section.items), currentHref, docs.docsIconMap, onNavigate)}</>
  }

  return (
    <li className="pb-1">
      <details
        open={isOpen}
        onToggle={(event) => {
          setIsOpen(event.currentTarget.open)
        }}
      >
        <summary className="rounded-field py-0 flex items-center">
          <SidebarGroupTitle title={section.title} isActive={sectionHasActiveItem} icon={SectionIcon} />
        </summary>
        <SidebarItemList
          items={section.items}
          currentHref={currentHref}
          docsIconMap={docs.docsIconMap}
          onNavigate={onNavigate}
        />
      </details>
    </li>
  )
}

interface SidebarContentProps {
  currentHref?: string
  activeSectionId?: string
  onNavigate?: () => void
}

export const SidebarContent = ({
  currentHref: currentHrefProp = '',
  activeSectionId: activeSectionIdProp = '',
  onNavigate,
}: SidebarContentProps) => {
  const { urlPathname } = usePageContext()
  const currentHref = currentHrefProp || urlPathname
  const docs = useDocsGlobalContext()
  const activeSectionId = activeSectionIdProp || getActiveSectionByPathname(docs, currentHref)?.id || ''
  const { sidebarSections } = docs

  return (
    <ul className={maMerge('menu p-0 m-0 w-full px-0 pt-3 li:last-child:border-0 pb-4')}>
      {sidebarSections.map((section) => (
        <SidebarSectionGroup
          key={section.id}
          section={section}
          currentHref={currentHref}
          activeSectionId={activeSectionId}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  )
}

interface SidebarProps {
  currentHref?: string
  activeSectionId?: string
}

export const Sidebar = memo(
  ({ currentHref: currentHrefProp = '', activeSectionId: activeSectionIdProp = '' }: SidebarProps) => {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)

    return (
      <aside className="hidden basis-76 shrink-0 lg:block">
        <div className="-ml-3 sticky top-14 relative">
          <div className="absolute left-0 bottom-0 bg-linear-to-t h-10 w-full from-base-100 z-20 pointer-events-none" />
          <div className="absolute right-px top-px bg-linear-to-t h-4 w-full to-base-100 z-20 pointer-events-none" />
          <div className="absolute h-full w-px right-0 top-0 bg-linear-to-t to-base-muted-light via-base-muted-light pointer-events-none z-1" />
          <StickyContent ref={scrollContainerRef} className="pr-4 relative z-10">
            <SidebarContent currentHref={currentHrefProp} activeSectionId={activeSectionIdProp} />
          </StickyContent>
        </div>
      </aside>
    )
  },
)
