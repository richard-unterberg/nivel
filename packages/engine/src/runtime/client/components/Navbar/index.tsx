import cm, { cmMerge } from '@classmatejs/react'
import { ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import type {
  DocsThemeConfig,
  ResolvedDocsAlgoliaConfig,
  ResolvedDocsBrandConfig,
  ResolvedDocsSection,
  ResolvedNavbarItem,
} from '../../../../docs/types.js'
import { withSiteBaseUrl } from '../../../../shared/assets.js'
import { renderInlineMarkdown } from '../../../../shared/renderInlineMarkdown.js'
import { Brand } from '../Brand.js'
import { LayoutComponent } from '../LayoutComponent.js'
import { Search } from '../Search.js'
import { ThemeSwitch } from '../ThemeSwitch.js'
import { MegaMenu } from './MegaMenu/index.js'
import { useNavbarScroll } from './useNavbarScroll.js'

interface NavbarProps {
  brand: ResolvedDocsBrandConfig
  activeSectionId: string | null
  algolia: ResolvedDocsAlgoliaConfig | null
  navbarItems: ResolvedNavbarItem[]
  theme: Required<DocsThemeConfig>
  sections: ResolvedDocsSection[]
}

export const Navbar = ({ brand, activeSectionId, algolia, navbarItems, theme, sections }: NavbarProps) => {
  const { urlPathname } = usePageContext()
  const isLandingPage = urlPathname === '/'
  const { isLandingPageScrolled } = useNavbarScroll(isLandingPage)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const megaMenuCloseTimeoutRef = useRef<number | null>(null)

  const showChrome = useMemo(
    () => !isLandingPage || isLandingPageScrolled || isMegaMenuOpen,
    [isLandingPage, isLandingPageScrolled, isMegaMenuOpen],
  )

  const clearMegaMenuCloseTimeout = useCallback(() => {
    if (megaMenuCloseTimeoutRef.current === null) {
      return
    }

    window.clearTimeout(megaMenuCloseTimeoutRef.current)
    megaMenuCloseTimeoutRef.current = null
  }, [])

  const openMegaMenu = () => {
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
    }, 120)
  }

  useEffect(() => {
    return () => {
      clearMegaMenuCloseTimeout()
    }
  }, [clearMegaMenuCloseTimeout])

  return (
    <>
      <StyledNavbar>
        <LayoutComponent className="h-full">
          {isLandingPage ? (
            <div className="relative z-3 flex h-full items-center justify-between py-4">
              <div className="flex flex-1 items-center gap-4">
                <Brand brand={brand} />
              </div>
              <nav
                aria-label="Primary"
                className="top-0 left-0 flex min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto"
              >
                <ul className="flex items-center font-semibold">
                  {navbarItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={withSiteBaseUrl(item.href)}
                        className={'h-full block py-3.25'}
                        onPointerEnter={openMegaMenu}
                        onPointerLeave={scheduleMegaMenuClose}
                        onFocus={openMegaMenu}
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
                </ul>
              </nav>
              <div className="flex flex-1 items-center justify-end gap-2">
                <Search algolia={algolia} />
                <ThemeSwitch theme={theme} />
              </div>
            </div>
          ) : (
            <div className="relative z-3 flex h-full items-center justify-between py-4">
              <div className="flex w-80 flex-1 items-center justify-between gap-2 lg:flex-none">
                <Brand brand={brand} />
              </div>
              <nav
                aria-label="Primary"
                className="top-0 left-0 flex flex-1 items-center justify-start gap-4 overflow-x-auto lg:pl-6 xl:pl-10"
              >
                <ul className="flex items-center gap-2 font-semibold">
                  {navbarItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={withSiteBaseUrl(item.href)}
                        onPointerEnter={openMegaMenu}
                        onPointerLeave={scheduleMegaMenuClose}
                        onFocus={openMegaMenu}
                        onBlur={scheduleMegaMenuClose}
                        onClick={closeMegaMenu}
                        className={cmMerge(
                          'btn btn-sm px-2 whitespace-nowrap text-base tracking-tight',
                          item.id === activeSectionId ? 'btn-primary btn-soft' : 'btn-ghost',
                        )}
                      >
                        {renderInlineMarkdown(item.title)}
                      </a>
                    </li>
                  ))}
                </ul>
                <Search algolia={algolia} />
              </nav>
              <div className="flex w-78 flex-1 items-center justify-end gap-2 lg:flex-none">
                <ThemeSwitch theme={theme} />
              </div>
            </div>
          )}
        </LayoutComponent>
      </StyledNavbar>
      <MegaMenu
        showChrome={showChrome}
        sections={sections}
        isActive={isMegaMenuOpen}
        onOpen={openMegaMenu}
        onClose={scheduleMegaMenuClose}
      />
    </>
  )
}

const StyledNavbar = cm.header`
  fixed top-0 left-0 z-20 h-16 w-full bg-base-100
`
