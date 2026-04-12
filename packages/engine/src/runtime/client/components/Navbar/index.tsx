import cm, { cmMerge } from '@classmatejs/react'
import { ChevronDown, TextSearch } from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { getActiveSectionByPathname } from '../../../../docs/resolveDocsConfig.js'
import { withSiteBaseUrl } from '../../../../shared/assets.js'
import { renderInlineMarkdown } from '../../../../shared/renderInlineMarkdown.js'
import { useDocsGlobalContext } from '../../docsGlobalContext.js'
import { useDocsRouteStore, useDocsSearchActions } from '../../store/runtime-store.js'
import { Brand } from '../Brand.js'
import { LayoutComponent } from '../LayoutComponent.js'
import { Search, SearchTrigger } from '../Search.js'
import SocialIcons from '../SocialLinks.js'
import { ThemeSwitch } from '../ThemeSwitch.js'
import { MegaMenu } from './MegaMenu.js'

export const Navbar = memo(() => {
  const docs = useDocsGlobalContext()
  const { urlPathname, urlParsed } = usePageContext()
  const activeSectionId = useDocsRouteStore((state) => state.currentSectionId)
  const isLandingPage = urlParsed.pathname === '/'
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const megaMenuCloseTimeoutRef = useRef<number | null>(null)
  const sections = docs.sidebarSections
  const activeSection =
    sections.find((section) => section.id === activeSectionId) ?? getActiveSectionByPathname(docs, urlPathname)
  const [hoveredSectionId, setHoveredSectionId] = useState<string | undefined>(activeSection?.id ?? sections[0]?.id)
  const { toggle: toggleSearch } = useDocsSearchActions()

  const clearMegaMenuCloseTimeout = useCallback(() => {
    if (megaMenuCloseTimeoutRef.current === null) {
      return
    }

    window.clearTimeout(megaMenuCloseTimeoutRef.current)
    megaMenuCloseTimeoutRef.current = null
  }, [])

  const openMegaMenu = (currentSectionId?: string) => {
    if (currentSectionId !== undefined) {
      setHoveredSectionId(currentSectionId)
    }

    clearMegaMenuCloseTimeout()
    setIsMegaMenuOpen(true)
  }

  const closeMegaMenu = () => {
    clearMegaMenuCloseTimeout()
    setIsMegaMenuOpen(false)
  }

  const scheduleMegaMenuClose = () => {
    clearMegaMenuCloseTimeout()
    megaMenuCloseTimeoutRef.current = window.setTimeout(() => {
      setIsMegaMenuOpen(false)
      megaMenuCloseTimeoutRef.current = null
    }, 140)
  }

  useEffect(() => {
    return () => {
      clearMegaMenuCloseTimeout()
    }
  }, [clearMegaMenuCloseTimeout])

  useEffect(() => {
    setHoveredSectionId(activeSection?.id ?? sections[0]?.id)
  }, [activeSection?.id, sections])

  return (
    <>
      <StyledNavbar $border={isLandingPage}>
        <LayoutComponent className="h-full">
          {isLandingPage ? (
            <div className="relative z-3 flex h-full items-center justify-between py-4">
              <div className="flex flex-1 items-center gap-4">
                <Brand brand={docs.brand} />
              </div>
              <nav
                aria-label="Primary"
                className="top-0 left-0 flex min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto"
              >
                <ul className="flex items-center font-semibold">
                  {docs.navbarItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={withSiteBaseUrl(item.href)}
                        className={'h-full block py-3.25'}
                        onPointerEnter={() => openMegaMenu(item.id)}
                        onPointerLeave={scheduleMegaMenuClose}
                        onFocus={() => openMegaMenu(item.id)}
                        onBlur={scheduleMegaMenuClose}
                        onClick={closeMegaMenu}
                      >
                        <span
                          className={cmMerge('btn text-lg btn-ghost min-w-30 px-2 whitespace-nowrap tracking-tight')}
                        >
                          {renderInlineMarkdown(item.title)}
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        </span>
                      </a>
                    </li>
                  ))}
                  {docs.algolia ? (
                    <li>
                      <button
                        type="button"
                        onClick={toggleSearch}
                        className="btn btn-ghost min-w-30 px-2 text-lg whitespace-nowrap tracking-tight"
                      >
                        Search
                        <TextSearch className="h-4 w-4" />
                      </button>
                    </li>
                  ) : null}
                </ul>
              </nav>
              <div className="flex flex-1 items-center justify-end gap-2">
                <SocialIcons />
                <ThemeSwitch theme={docs.theme} />
              </div>
            </div>
          ) : (
            <div className="relative z-3 flex h-full items-center justify-between py-4">
              <div className="flex w-80 flex-1 items-center justify-between gap-2 lg:flex-none">
                <Brand brand={docs.brand} />
              </div>
              <nav
                aria-label="Primary"
                className="top-0 left-0 flex flex-1 items-center justify-start gap-4 overflow-x-auto lg:pl-6 xl:pl-10"
              >
                <ul className="flex items-center gap-2 font-semibold">
                  {docs.navbarItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={withSiteBaseUrl(item.href)}
                        onPointerEnter={() => openMegaMenu(item.id)}
                        onPointerLeave={scheduleMegaMenuClose}
                        onFocus={() => openMegaMenu(item.id)}
                        onBlur={scheduleMegaMenuClose}
                        onClick={closeMegaMenu}
                        className={cmMerge(
                          'btn btn-sm px-2 whitespace-nowrap text-base tracking-tight',
                          item.id === activeSection?.id ? 'btn-primary btn-soft' : 'btn-ghost',
                        )}
                      >
                        {renderInlineMarkdown(item.title)}
                      </a>
                    </li>
                  ))}
                </ul>
                <SearchTrigger />
              </nav>
              <div className="flex w-78 flex-1 items-center justify-end gap-2 lg:flex-none">
                <SocialIcons />
                <ThemeSwitch theme={docs.theme} />
              </div>
            </div>
          )}
        </LayoutComponent>
      </StyledNavbar>
      <Search />
      <MegaMenu
        sections={sections}
        activeSectionId={activeSection?.id}
        hoveredSectionId={hoveredSectionId}
        isActive={isMegaMenuOpen}
        onOpen={openMegaMenu}
        onClose={scheduleMegaMenuClose}
        isLandingPage={isLandingPage}
      />
    </>
  )
})

const StyledNavbar = cm.header<{ $border: boolean }>`
  top-0 left-0 z-20 h-16 w-full bg-base-100
  ${({ $border }) => ($border ? 'relative' : 'fixed')}
`
