import cm, { cmMerge } from '@classmatejs/react'
import { ChevronDown, Menu, TextSearch } from 'lucide-react'
import { useCallback } from 'react'
import { withSiteBaseUrl } from '../../../../shared/assets'
import { renderInlineMarkdown } from '../../../../shared/renderInlineMarkdown'
import { useDocsGlobalContext } from '../../docsGlobalContext'
import { Brand } from '../Brand'
import AsideButtons from './AsideButtons'

const StyledNav = cm.nav`
  gap-4
  flex-1 lg:pl-6 xl:pl-10 items-center justify-center
`

const StyledNavList = cm.ul`
  inline-flex items-center gap-2 font-semibold 
`

interface LandingPageNavbarProps {
  scheduleMegaMenuClose?: () => void
  scheduleMegaMenuOpen: (id?: string) => void
  openMegaMenu: (id?: string) => void
  toggleSearch: () => void
  closeMegaMenu?: () => void
  hoveredSectionId?: string
  isMegaMenuOpen: boolean
}

const LandingPageNavbar = ({
  closeMegaMenu,
  openMegaMenu,
  scheduleMegaMenuOpen,
  scheduleMegaMenuClose,
  toggleSearch,
  hoveredSectionId,
  isMegaMenuOpen,
}: LandingPageNavbarProps) => {
  const docs = useDocsGlobalContext()

  const handleClick = useCallback(() => {
    alert('TODO: Open mobile menu')
  }, [])

  return (
    <div className="flex flex-1 gap-4 pt-3 justify-between">
      <div className="min-w-40">
        <Brand brand={docs.brand} />
      </div>
      <StyledNav aria-label="Primary" className="flex-1 flex hidden lg:flex">
        <StyledNavList className="justify-end ">
          {docs.navbarItems.map((item) => {
            const isMegaMenuItemActive = isMegaMenuOpen && hoveredSectionId === item.id

            return (
              <li key={item.id}>
                <a
                  href={withSiteBaseUrl(item.href)}
                  className={'block'}
                  onPointerEnter={() => scheduleMegaMenuOpen(item.id)}
                  onPointerLeave={scheduleMegaMenuClose}
                  onFocus={() => openMegaMenu(item.id)}
                  onBlur={scheduleMegaMenuClose}
                  onClick={closeMegaMenu}
                >
                  <span
                    className={cmMerge(
                      'btn btn-ghost text-base lg:text-lg btn-sm lg:min-w-30 px-2 whitespace-nowrap tracking-tight',
                    )}
                  >
                    {renderInlineMarkdown(item.title)}
                    <ChevronDown
                      className={cmMerge(
                        'h-4 w-4 shrink-0 transition-transform duration-200',
                        isMegaMenuItemActive ? 'rotate-180' : 'rotate-0',
                      )}
                    />
                  </span>
                </a>
              </li>
            )
          })}
          {docs.algolia ? (
            <li>
              <button
                type="button"
                onClick={toggleSearch}
                className="btn btn-ghost btn-sm text-base lg:text-lg lg:min-w-30 px-2 whitespace-nowrap tracking-tight"
              >
                Search
                <TextSearch className="h-4 w-4" />
              </button>
            </li>
          ) : null}
        </StyledNavList>
      </StyledNav>
      <div className="min-w-40 hidden lg:block">
        <AsideButtons />
      </div>
      <button type="button" className="block lg:hidden" onClick={handleClick}>
        <Menu className="w-6 h-6" />
      </button>
    </div>
  )
}

export default LandingPageNavbar
