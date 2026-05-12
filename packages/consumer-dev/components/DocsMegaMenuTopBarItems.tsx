import { cmMerge } from '@classmatejs/react'
import { renderInlineMarkdown } from '@unterberg/nivel'
import { useDocsContext } from '@unterberg/nivel/client'
import { ChevronDown } from 'lucide-react'
import { createPortal } from 'react-dom'
import { usePageContext } from 'vike-react/usePageContext'
import DocsMegaMenu from './DocsMegaMenu'
import DocsTopBarSearch from './DocsTopBarSearch'
import {
  getActiveSectionByPathname,
  getActiveTopBarButtonClassName,
  getTopBarButtonClassName,
  useHasMounted,
  withSiteBaseUrl,
} from './topBarNavUtils'
import useDocsMegaMenu from './useDocsMegaMenu'

const DocsMegaMenuTopBarItems = () => {
  const docs = useDocsContext()
  const { urlPathname, urlParsed } = usePageContext()
  const sections = docs.sidebarSections
  const hasMounted = useHasMounted()
  const isLandingPage = urlParsed.pathname === '/'
  const activeSection = getActiveSectionByPathname(docs, urlPathname)
  const buttonClassName = getTopBarButtonClassName()
  const activeButtonClassName = getActiveTopBarButtonClassName()
  const { closeMegaMenu, hoveredSectionId, isMegaMenuOpen, openMegaMenu, scheduleMegaMenuClose, scheduleMegaMenuOpen } =
    useDocsMegaMenu({
      activeSectionId: activeSection?.id,
      sections,
    })

  return (
    <nav aria-label="Primary" className="flex min-w-0 flex-1 items-center justify-center pl-6 xl:pl-12">
      <ul className="flex min-w-0 items-center gap-2 font-semibold">
        {sections.map((section) => {
          const SectionIcon = docs.docsIconMap[`section:${section.id}`]
          const isActiveSection = activeSection?.id === section.id
          const isMegaMenuItemActive = isMegaMenuOpen && hoveredSectionId === section.id

          return (
            <li key={section.id}>
              <a
                href={withSiteBaseUrl(section.href)}
                className="block"
                onPointerEnter={() => scheduleMegaMenuOpen(section.id)}
                onPointerLeave={scheduleMegaMenuClose}
                onFocus={() => openMegaMenu(section.id)}
                onBlur={scheduleMegaMenuClose}
                onClick={closeMegaMenu}
              >
                <span className={isActiveSection ? activeButtonClassName : buttonClassName}>
                  {SectionIcon ? <SectionIcon className="size-4 shrink-0" aria-hidden="true" /> : null}
                  {renderInlineMarkdown(section.navTitle)}
                  <span
                    className={cmMerge(
                      'size-4 shrink-0 transition-transform duration-200',
                      isMegaMenuItemActive ? 'rotate-180' : 'rotate-0',
                    )}
                    aria-hidden="true"
                  >
                    <ChevronDown className="size-4" />
                  </span>
                </span>
              </a>
            </li>
          )
        })}
        <DocsTopBarSearch />
      </ul>
      {hasMounted
        ? createPortal(
            <DocsMegaMenu
              activeSectionId={activeSection?.id}
              docsIconMap={docs.docsIconMap}
              hoveredSectionId={hoveredSectionId}
              isActive={isMegaMenuOpen}
              isLandingPage={isLandingPage}
              onClose={scheduleMegaMenuClose}
              onOpen={openMegaMenu}
              sections={sections}
            />,
            document.body,
          )
        : null}
    </nav>
  )
}

export default DocsMegaMenuTopBarItems
