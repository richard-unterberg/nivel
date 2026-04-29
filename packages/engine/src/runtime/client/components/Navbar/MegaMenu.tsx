import { cmMerge } from '@classmatejs/react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { getDocsIconMapKey } from '../../../../docs/iconKeys.js'
import type {
  DocsIconMap,
  ResolvedDocsSection,
  ResolvedSidebarGroup,
  ResolvedSidebarNode,
} from '../../../../docs/types.js'
import { withSiteBaseUrl } from '../../../../shared/assets.js'
import { renderInlineMarkdown } from '../../../../shared/renderInlineMarkdown.js'
import { useDocsGlobalContext } from '../../docsGlobalContext.js'
import { containsActiveHref, getGroupHref, getVisibleGroupItems, getVisibleNavItems } from '../docsNavigation.js'
import { LayoutComponent } from '../LayoutComponent.js'

const detailsTransitionDurationMs = 260

const findActiveItemId = (section: ResolvedDocsSection | undefined, currentHref: string): string | undefined => {
  if (!section) {
    return undefined
  }

  const findActiveNodeId = (items: ResolvedSidebarNode[]): string | undefined => {
    for (const item of items) {
      if (item.href === currentHref) {
        return item.id
      }

      if (item.kind === 'group') {
        const activeChildId = findActiveNodeId(item.items)

        if (activeChildId) {
          return activeChildId
        }
      }
    }

    return undefined
  }

  return findActiveNodeId(section.items)
}

interface MegaMenuNodeLinkProps {
  title?: string
  href?: string
  icon?: LucideIcon
  isActive: boolean
  className?: string
  onClose: () => void
}

const MegaMenuNodeLink = ({ title, href, icon: Icon, isActive, className, onClose }: MegaMenuNodeLinkProps) => {
  const content = (
    <span className="flex min-w-0 items-center gap-2">
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
      <span className="min-w-0">{title ? renderInlineMarkdown(title, { codeClassName: 'text-sm!' }) : null}</span>
    </span>
  )

  if (href) {
    return (
      <a
        className={cmMerge(
          'flex min-w-0 items-center text-base-muted hover:text-base-content',
          isActive && 'text-primary! font-semibold',
          className,
        )}
        href={withSiteBaseUrl(href)}
        onClick={onClose}
      >
        {content}
      </a>
    )
  }

  return (
    <span
      className={cmMerge(
        'flex min-w-0 items-center text-base-content',
        isActive && 'text-primary! font-semibold',
        className,
      )}
    >
      {content}
    </span>
  )
}

interface MegaMenuNodeListProps {
  items: ResolvedSidebarNode[]
  activeItemId?: string
  currentHref: string
  docsIconMap: DocsIconMap
  onClose: () => void
  onContentHeightChange: (isOpening: boolean) => void
  openGroupId: string | null
  onOpenGroupChange: (groupId: string | null) => void
  depth?: number
}

const MegaMenuNodeList = ({
  items,
  activeItemId,
  currentHref,
  docsIconMap,
  onClose,
  onContentHeightChange,
  openGroupId,
  onOpenGroupChange,
  depth = 0,
}: MegaMenuNodeListProps) => {
  const visibleItems = getVisibleNavItems(items)

  if (visibleItems.length === 0) {
    return null
  }

  return (
    <ul className={cmMerge('menu menu-sm w-full p-0', depth > 0 && 'mt-1 border-l border-base-muted-light pl-3')}>
      {visibleItems.map((item) => (
        <MegaMenuNode
          key={item.id}
          item={item}
          activeItemId={activeItemId}
          currentHref={currentHref}
          docsIconMap={docsIconMap}
          onClose={onClose}
          onContentHeightChange={onContentHeightChange}
          openGroupId={openGroupId}
          onOpenGroupChange={onOpenGroupChange}
          depth={depth}
        />
      ))}
    </ul>
  )
}

interface MegaMenuNodeProps {
  item: ResolvedSidebarNode
  activeItemId?: string
  currentHref: string
  docsIconMap: DocsIconMap
  onClose: () => void
  onContentHeightChange: (isOpening: boolean) => void
  openGroupId: string | null
  onOpenGroupChange: (groupId: string | null) => void
  depth: number
}

const MegaMenuNode = ({
  item,
  activeItemId,
  currentHref,
  docsIconMap,
  onClose,
  onContentHeightChange,
  openGroupId,
  onOpenGroupChange,
  depth,
}: MegaMenuNodeProps) => {
  if (item.kind === 'page') {
    const PageIcon = docsIconMap[getDocsIconMapKey('page', item.id)]

    return (
      <li>
        <MegaMenuNodeLink
          title={item.navTitle || item.title}
          href={item.href}
          icon={PageIcon}
          isActive={activeItemId === item.id}
          className="rounded-field px-2 py-1.5 text-sm"
          onClose={onClose}
        />
      </li>
    )
  }

  return (
    <MegaMenuGroup
      group={item}
      activeItemId={activeItemId}
      currentHref={currentHref}
      docsIconMap={docsIconMap}
      onClose={onClose}
      onContentHeightChange={onContentHeightChange}
      openGroupId={openGroupId}
      onOpenGroupChange={onOpenGroupChange}
      depth={depth}
    />
  )
}

interface MegaMenuGroupProps {
  group: ResolvedSidebarGroup
  activeItemId?: string
  currentHref: string
  docsIconMap: DocsIconMap
  onClose: () => void
  onContentHeightChange: (isOpening: boolean) => void
  openGroupId: string | null
  onOpenGroupChange: (groupId: string | null) => void
  depth: number
}

const MegaMenuGroup = ({
  group,
  activeItemId,
  currentHref,
  docsIconMap,
  onClose,
  onContentHeightChange,
  openGroupId,
  onOpenGroupChange,
  depth,
}: MegaMenuGroupProps) => {
  const groupHref = getGroupHref(group)
  const visibleItems = getVisibleGroupItems(group)
  const GroupIcon = docsIconMap[getDocsIconMapKey('group', group.id)]
  const isActive = groupHref === currentHref || containsActiveHref(group.items, currentHref)
  const isCollapsible = group.collapsible !== undefined
  const isOpen = openGroupId === group.id

  if (!group.title) {
    return (
      <>
        {visibleItems.map((item) => (
          <MegaMenuNode
            key={item.id}
            item={item}
            activeItemId={activeItemId}
            currentHref={currentHref}
            docsIconMap={docsIconMap}
            onClose={onClose}
            onContentHeightChange={onContentHeightChange}
            openGroupId={openGroupId}
            onOpenGroupChange={onOpenGroupChange}
            depth={depth}
          />
        ))}
      </>
    )
  }

  const title = (
    <MegaMenuNodeLink
      title={group.title}
      href={groupHref ?? undefined}
      icon={GroupIcon}
      isActive={isActive}
      className={cmMerge(
        depth === 0
          ? cmMerge(!isCollapsible && 'mb-2', 'text-lg font-semibold tracking-tight')
          : cmMerge(!isCollapsible && 'rounded-field px-2 py-1.5', 'text-sm font-semibold'),
      )}
      onClose={onClose}
    />
  )
  const nestedItems =
    visibleItems.length > 0 ? (
      <MegaMenuNodeList
        items={visibleItems}
        activeItemId={activeItemId}
        currentHref={currentHref}
        docsIconMap={docsIconMap}
        onClose={onClose}
        onContentHeightChange={onContentHeightChange}
        openGroupId={openGroupId}
        onOpenGroupChange={onOpenGroupChange}
        depth={depth + 1}
      />
    ) : null

  if (isCollapsible) {
    return (
      <li>
        <details
          open={isOpen}
          onToggle={(event) => {
            if (event.target !== event.currentTarget) {
              return
            }

            if (!event.nativeEvent.isTrusted) {
              return
            }

            const isOpening = event.currentTarget.open
            if (isOpening) {
              onOpenGroupChange(group.id)
              onContentHeightChange(true)
              return
            }

            if (openGroupId === group.id) {
              onOpenGroupChange(null)
              onContentHeightChange(false)
            }
          }}
        >
          <summary className={cmMerge('rounded-field flex min-h-0 items-center py-1.5', depth === 0 ? 'px-0' : 'px-2')}>
            {title}
          </summary>
          {nestedItems}
        </details>
      </li>
    )
  }

  return (
    <li>
      {title}
      {nestedItems}
    </li>
  )
}

interface MegaMenuColumnProps {
  item: ResolvedSidebarNode
  activeItemId?: string
  currentHref: string
  docsIconMap: DocsIconMap
  onClose: () => void
  onContentHeightChange: (isOpening: boolean) => void
  openGroupId: string | null
  onOpenGroupChange: (groupId: string | null) => void
}

const MegaMenuPageColumn = ({
  item,
  activeItemId,
  docsIconMap,
  onClose,
}: MegaMenuColumnProps & { item: Extract<ResolvedSidebarNode, { kind: 'page' }> }) => {
  const PageIcon = docsIconMap[getDocsIconMapKey('page', item.id)]

  return (
    <li className="mb-6 flex-1 px-4 py-3">
      <MegaMenuNodeLink
        title={item.navTitle || item.title}
        href={item.href}
        icon={PageIcon}
        isActive={activeItemId === item.id}
        className="text-lg font-semibold tracking-tight"
        onClose={onClose}
      />
    </li>
  )
}

const MegaMenuGroupColumn = ({
  item,
  activeItemId,
  currentHref,
  docsIconMap,
  onClose,
  onContentHeightChange,
  openGroupId,
  onOpenGroupChange,
}: MegaMenuColumnProps & { item: ResolvedSidebarGroup }) => {
  const groupHref = getGroupHref(item)
  const visibleItems = getVisibleGroupItems(item)
  const GroupIcon = docsIconMap[getDocsIconMapKey('group', item.id)]
  const isActive = groupHref === currentHref || containsActiveHref(item.items, currentHref)
  const isCollapsible = item.collapsible !== undefined
  const isOpen = openGroupId === item.id

  if (!item.title) {
    return (
      <>
        {visibleItems.map((child) => (
          <MegaMenuColumn
            key={child.id}
            item={child}
            activeItemId={activeItemId}
            currentHref={currentHref}
            docsIconMap={docsIconMap}
            onClose={onClose}
            onContentHeightChange={onContentHeightChange}
            openGroupId={openGroupId}
            onOpenGroupChange={onOpenGroupChange}
          />
        ))}
      </>
    )
  }

  const title = (
    <MegaMenuNodeLink
      title={item.title}
      href={groupHref ?? undefined}
      icon={GroupIcon}
      isActive={isActive}
      className={cmMerge(!isCollapsible && 'mb-4', 'text-lg font-semibold tracking-tight')}
      onClose={onClose}
    />
  )
  const nestedItems =
    visibleItems.length > 0 ? (
      <MegaMenuNodeList
        items={visibleItems}
        activeItemId={activeItemId}
        currentHref={currentHref}
        docsIconMap={docsIconMap}
        onClose={onClose}
        onContentHeightChange={onContentHeightChange}
        openGroupId={openGroupId}
        onOpenGroupChange={onOpenGroupChange}
        depth={1}
      />
    ) : null

  if (isCollapsible) {
    return (
      <li className="mb-6 flex-1 px-4 py-3">
        <ul className="menu w-full p-0">
          <li>
            <details
              open={isOpen}
              onToggle={(event) => {
                if (event.target !== event.currentTarget) {
                  return
                }

                if (!event.nativeEvent.isTrusted) {
                  return
                }

                const isOpening = event.currentTarget.open
                if (isOpening) {
                  onOpenGroupChange(item.id)
                  onContentHeightChange(true)
                  return
                }

                if (openGroupId === item.id) {
                  onOpenGroupChange(null)
                  onContentHeightChange(false)
                }
              }}
            >
              <summary className="rounded-field mb-4 flex min-h-0 items-center px-0 py-1.5">{title}</summary>
              {nestedItems}
            </details>
          </li>
        </ul>
      </li>
    )
  }

  return (
    <li className="mb-6 flex-1 px-4 py-3">
      {title}
      {nestedItems}
    </li>
  )
}

const MegaMenuColumn = ({
  item,
  activeItemId,
  currentHref,
  docsIconMap,
  onClose,
  onContentHeightChange,
  openGroupId,
  onOpenGroupChange,
}: MegaMenuColumnProps) => {
  if (item.kind === 'page') {
    return (
      <MegaMenuPageColumn
        item={item}
        activeItemId={activeItemId}
        currentHref={currentHref}
        docsIconMap={docsIconMap}
        onClose={onClose}
        onContentHeightChange={onContentHeightChange}
        openGroupId={openGroupId}
        onOpenGroupChange={onOpenGroupChange}
      />
    )
  }

  return (
    <MegaMenuGroupColumn
      item={item}
      activeItemId={activeItemId}
      currentHref={currentHref}
      docsIconMap={docsIconMap}
      onClose={onClose}
      onContentHeightChange={onContentHeightChange}
      openGroupId={openGroupId}
      onOpenGroupChange={onOpenGroupChange}
    />
  )
}

const hasVisibleItems = (items: ResolvedSidebarNode[]): boolean => {
  return items.some((item) => {
    if (!item.showInNav) {
      return false
    }

    if (item.kind === 'group') {
      return Boolean(item.title || item.href || hasVisibleItems(item.items))
    }

    return true
  })
}

export const MegaMenu = ({
  isActive,
  onOpen,
  onClose,
  sections,
  activeSectionId,
  hoveredSectionId,
  isLandingPage,
}: {
  isActive: boolean
  onOpen: (sectionId?: string) => void
  onClose: () => void
  sections: ResolvedDocsSection[]
  activeSectionId?: string
  hoveredSectionId?: string
  isLandingPage: boolean
}) => {
  const docs = useDocsGlobalContext()
  const { urlPathname } = usePageContext()
  const visibleSectionId = hoveredSectionId ?? activeSectionId ?? sections[0]?.id
  const [visibleSectionElement, setVisibleSectionElement] = useState<HTMLDivElement | null>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const [openGroupId, setOpenGroupId] = useState<string | null>(null)
  const contentHeightAnimationFrameRef = useRef<number | null>(null)
  const contentHeightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeItemId = useMemo(
    () =>
      findActiveItemId(
        sections.find((section) => section.id === visibleSectionId),
        urlPathname,
      ),
    [sections, visibleSectionId, urlPathname],
  )

  const clearScheduledContentHeightUpdate = useCallback(() => {
    if (contentHeightAnimationFrameRef.current !== null) {
      cancelAnimationFrame(contentHeightAnimationFrameRef.current)
      contentHeightAnimationFrameRef.current = null
    }

    if (contentHeightTimeoutRef.current !== null) {
      clearTimeout(contentHeightTimeoutRef.current)
      contentHeightTimeoutRef.current = null
    }
  }, [])

  const setContentHeightFromDisplayedHeight = useCallback(() => {
    if (visibleSectionElement === null) {
      return
    }

    setContentHeight(Math.ceil(visibleSectionElement.offsetHeight))
  }, [visibleSectionElement])

  const setContentHeightFromFullHeight = useCallback(() => {
    if (visibleSectionElement === null) {
      return
    }

    setContentHeight(Math.ceil(visibleSectionElement.scrollHeight))
  }, [visibleSectionElement])

  const scheduleContentHeightUpdate = useCallback(
    (isOpening: boolean) => {
      clearScheduledContentHeightUpdate()

      if (isOpening) {
        contentHeightAnimationFrameRef.current = requestAnimationFrame(() => {
          setContentHeightFromFullHeight()
          contentHeightAnimationFrameRef.current = null
        })
      }

      contentHeightTimeoutRef.current = setTimeout(() => {
        setContentHeightFromDisplayedHeight()
        contentHeightTimeoutRef.current = null
      }, detailsTransitionDurationMs)
    },
    [clearScheduledContentHeightUpdate, setContentHeightFromDisplayedHeight, setContentHeightFromFullHeight],
  )

  const closeMegaMenu = useCallback(() => {
    setOpenGroupId(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isActive || !visibleSectionId || visibleSectionElement === null) {
      return
    }

    contentHeightAnimationFrameRef.current = requestAnimationFrame(() => {
      setContentHeightFromDisplayedHeight()
      contentHeightAnimationFrameRef.current = null
    })

    return clearScheduledContentHeightUpdate
  }, [
    clearScheduledContentHeightUpdate,
    isActive,
    setContentHeightFromDisplayedHeight,
    visibleSectionElement,
    visibleSectionId,
  ])

  useEffect(() => clearScheduledContentHeightUpdate, [clearScheduledContentHeightUpdate])

  useEffect(() => {
    if (!visibleSectionId) {
      return
    }

    setOpenGroupId(null)
  }, [visibleSectionId])

  useEffect(() => {
    if (!isActive) {
      setOpenGroupId(null)
    }
  }, [isActive])

  return (
    <div
      className={cmMerge('fixed top-14 left-0 z-3 w-full', isActive ? 'pointer-events-auto' : 'pointer-events-none')}
      onPointerEnter={() => onOpen(visibleSectionId)}
      onPointerLeave={closeMegaMenu}
    >
      <div
        className={cmMerge(
          isActive ? 'opacity-100' : 'opacity-0',
          'pointer-events-none absolute top-0 left-0 h-svh w-full bg-linear-to-t from-base-100/60 to-base-100 transition-opacity duration-200 backdrop-blur-md',
        )}
      />
      <div
        className={cmMerge(
          'relative z-4 overflow-hidden transition-[height] bg-base-100 duration-300 ease-out pointer-events-none',
          isLandingPage && !isActive ? '' : 'pointer-events-auto lg:border-b lg:border-base-muted-light',
        )}
        // biome-ignore lint/nursery/noInlineStyles: needed here
        style={{ height: isActive ? contentHeight : 0 }}
      >
        <LayoutComponent $size="sm">
          <div
            className={cmMerge(
              isActive ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0',
              'relative z-4 transition-all duration-300',
            )}
          >
            {sections.map((section) => (
              <div
                key={section.id}
                ref={section.id === visibleSectionId ? setVisibleSectionElement : undefined}
                className={cmMerge(
                  section.id === visibleSectionId ? 'opacity-100' : 'opacity-0 pointer-events-none',
                  'transition-all absolute w-full duration-300',
                )}
              >
                {hasVisibleItems(section.items) && (
                  <ul className="menu mt-2 flex-row items-start p-0 w-full">
                    {getVisibleNavItems(section.items).map((child) => (
                      <MegaMenuColumn
                        key={child.id}
                        item={child}
                        activeItemId={activeItemId}
                        currentHref={urlPathname}
                        docsIconMap={docs.docsIconMap}
                        onClose={closeMegaMenu}
                        onContentHeightChange={scheduleContentHeightUpdate}
                        openGroupId={openGroupId}
                        onOpenGroupChange={setOpenGroupId}
                      />
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </LayoutComponent>
      </div>
    </div>
  )
}
