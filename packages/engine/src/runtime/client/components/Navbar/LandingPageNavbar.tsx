import cm, { cmMerge } from '@classmatejs/react'
import { ChevronDown, Menu } from 'lucide-react'
import { useCallback } from 'react'
import { getDocsIconMapKey } from '../../../../docs/iconKeys.js'
import { withSiteBaseUrl } from '../../../../shared/assets'
import { renderInlineMarkdown } from '../../../../shared/renderInlineMarkdown'
import { useDocsGlobalContext } from '../../docsGlobalContext'
import { Brand } from '../Brand'
import AsideButtons from './AsideButtons'
import { TopBarNavLinks } from './TopBarNavLinks'

const StyledNav = cm.nav`
  gap-4
  flex-1 items-center justify-center
`

const StyledNavList = cm.ul`
  inline-flex items-center gap-2 font-semibold 
`

interface LandingPageNavbarProps {
  scheduleMegaMenuClose?: () => void
  scheduleMegaMenuOpen: (id?: string) => void
  openMegaMenu: (id?: string) => void
  closeMegaMenu?: () => void
  hoveredSectionId?: string
  isMegaMenuOpen: boolean
}

const LandingPageNavbar = ({
  closeMegaMenu,
  openMegaMenu,
  scheduleMegaMenuOpen,
  scheduleMegaMenuClose,
  hoveredSectionId,
  isMegaMenuOpen,
}: LandingPageNavbarProps) => {
  const docs = useDocsGlobalContext()
  const TopBarNavComponent = docs.topBarNavComponent

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
          {docs.topBarNav.kind === 'mega'
            ? docs.topBarNav.items.map((item) => {
                const ItemIcon = docs.docsIconMap[getDocsIconMapKey('section', item.id)]
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
                          'btn btn-ghost text-base btn-sm lg:min-w-30 px-2 whitespace-nowrap tracking-tight',
                        )}
                      >
                        {ItemIcon ? <ItemIcon className="size-4 shrink-0" aria-hidden="true" /> : null}
                        {renderInlineMarkdown(item.title)}
                        <ChevronDown
                          className={cmMerge(
                            'size-4 shrink-0 transition-transform duration-200',
                            isMegaMenuItemActive ? 'rotate-180' : 'rotate-0',
                          )}
                        />
                      </span>
                    </a>
                  </li>
                )
              })
            : null}
          {docs.topBarNav.kind === 'links' ? (
            <TopBarNavLinks items={docs.topBarNav.items} minWidthClass="lg:min-w-30" />
          ) : null}
          {docs.topBarNav.kind === 'component' && TopBarNavComponent ? (
            <li>
              <TopBarNavComponent
                activeSection={null}
                buttonClassName="btn btn-ghost btn-sm text-base lg:min-w-30 px-2 whitespace-nowrap tracking-tight"
                docs={docs}
                isLandingPage={true}
              />
            </li>
          ) : null}
        </StyledNavList>
      </StyledNav>
      <div className="min-w-40 hidden lg:block">
        <AsideButtons />
      </div>
      <button type="button" className="block lg:hidden" aria-label="Open navigation menu" onClick={handleClick}>
        <Menu className="w-6 h-6" />
      </button>
    </div>
  )
}

export default LandingPageNavbar
