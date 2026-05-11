import cm, { cmMerge } from '@classmatejs/react'
import { ChevronDown, Menu } from 'lucide-react'
import { useCallback } from 'react'
import { getDocsIconMapKey } from '../../../../docs/iconKeys.js'
import type { ResolvedDocsSection } from '../../../../docs/types'
import { withSiteBaseUrl } from '../../../../shared/assets'
import { renderInlineMarkdown } from '../../../../shared/renderInlineMarkdown'
import { useDocsGlobalContext } from '../../docsGlobalContext'
import { Brand } from '../Brand'
import AsideButtons from './AsideButtons'
import { TopBarNavLinks } from './TopBarNavLinks'

const StyledNav = cm.nav`
  gap-4 flex-1 
  hidden lg:flex
  pl-6 xl:pl-12
  items-center 
  justify-end lg:justify-start 
`

const StyledNavList = cm.ul`
  inline-flex items-center gap-2 font-semibold 
`

interface DocsNavbarProps {
  scheduleMegaMenuClose?: () => void
  scheduleMegaMenuOpen: (id?: string) => void
  openMegaMenu: (id?: string) => void
  closeMegaMenu?: () => void
  activeSection?: ResolvedDocsSection | null
  hoveredSectionId?: string
  isMegaMenuOpen: boolean
}

const DocsNavbar = ({
  closeMegaMenu,
  openMegaMenu,
  scheduleMegaMenuOpen,
  scheduleMegaMenuClose,
  activeSection,
  hoveredSectionId,
  isMegaMenuOpen,
}: DocsNavbarProps) => {
  const docs = useDocsGlobalContext()
  const TopBarNavComponent = docs.topBarNavComponent

  const handleClick = useCallback(() => {
    alert('TODO: Open mobile menu')
  }, [])

  return (
    <div className="flex flex-1 gap-4 pt-3 justify-between">
      <div className="lg:min-w-76 min-w-none">
        <Brand brand={docs.brand} />
      </div>
      <StyledNav aria-label="Primary">
        <StyledNavList className="">
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
                          'btn text-base btn-sm md:min-w-30 px-2 whitespace-nowrap tracking-tight',
                          activeSection?.id === item.id ? 'btn-primary btn-soft' : 'btn-ghost ',
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
            <TopBarNavLinks items={docs.topBarNav.items} minWidthClass="md:min-w-30" />
          ) : null}
          {docs.topBarNav.kind === 'component' && TopBarNavComponent ? (
            <li>
              <TopBarNavComponent
                activeSection={activeSection ?? null}
                buttonClassName="btn btn-ghost btn-sm text-base md:min-w-30 px-2 whitespace-nowrap tracking-tight"
                docs={docs}
                isLandingPage={false}
              />
            </li>
          ) : null}
        </StyledNavList>
      </StyledNav>
      <button type="button" className="block lg:hidden" aria-label="Open navigation menu" onClick={handleClick}>
        <Menu className="w-6 h-6" />
      </button>
      <div className="lg:min-w-40 hidden lg:block">
        <AsideButtons />
      </div>
    </div>
  )
}

export default DocsNavbar
