import { cmMerge } from '@classmatejs/react'
import { useEffect, useState } from 'react'
import type { ResolvedDocsSection } from '../../../../docs/types.js'
import { withSiteBaseUrl } from '../../../../shared/assets.js'
import { renderInlineMarkdown } from '../../../../shared/renderInlineMarkdown.js'
import { LayoutComponent } from '../LayoutComponent.js'

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
  const visibleSectionId = hoveredSectionId ?? activeSectionId ?? sections[0]?.id
  const [visibleSectionElement, setVisibleSectionElement] = useState<HTMLDivElement | null>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (!visibleSectionId || visibleSectionElement === null) {
      return
    }

    const updateContentHeight = () => {
      setContentHeight(visibleSectionElement.offsetHeight)
    }

    updateContentHeight()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      updateContentHeight()
    })

    resizeObserver.observe(visibleSectionElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [visibleSectionElement, visibleSectionId])

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: ok
    <div
      className={cmMerge(
        'fixed top-13 left-0 z-3 w-full pt-3',
        isActive ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      onPointerEnter={() => onOpen(visibleSectionId)}
      onPointerLeave={onClose}
    >
      <div
        className={cmMerge(
          isActive ? 'opacity-100' : 'opacity-0',
          'pointer-events-none absolute top-0 left-0 h-svh w-full bg-linear-to-t from-base-100/60 to-base-100 transition-opacity duration-200 backdrop-blur-md',
        )}
      />
      <div
        className={cmMerge(
          'relative z-4 overflow-hidden transition-[height] bg-base-100 duration-300',
          isLandingPage && !isActive ? '' : 'border-b border-base-muted-light ease-out',
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
                {section.items.length > 0 && (
                  <ul className="mt-2 flex ">
                    {section.items.map(
                      (child) =>
                        child.showInNav !== false && (
                          <li key={child.id} className="flex-1 py-3 mb-6 px-4">
                            {child.href ? (
                              <a
                                className="mb-4 block text-lg font-semibold tracking-tight"
                                href={withSiteBaseUrl(child.href)}
                              >
                                {child.title}
                              </a>
                            ) : (
                              <span className="mb-4 block text-lg font-semibold tracking-tight">{child.title}</span>
                            )}
                            {child.kind === 'group' && child.items.length > 0 && (
                              <ul className="menu border-l border-base-muted-light py-0 w-full">
                                {child.items.map((subChild) => (
                                  <li key={subChild.id}>
                                    {subChild.href ? (
                                      <a href={withSiteBaseUrl(subChild.href)} onClick={onClose}>
                                        {renderInlineMarkdown(subChild.title)}
                                      </a>
                                    ) : (
                                      <span>{renderInlineMarkdown(subChild.title)}</span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ),
                    )}
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
