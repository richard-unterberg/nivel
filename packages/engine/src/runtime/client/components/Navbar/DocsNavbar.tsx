import cm, { cmMerge } from '@classmatejs/react'
import { ChevronDown, Menu, TextSearch } from 'lucide-react'
import { useCallback } from 'react'
import type { ResolvedDocsSection } from '../../../../docs/types'
import { withSiteBaseUrl } from '../../../../shared/assets'
import { renderInlineMarkdown } from '../../../../shared/renderInlineMarkdown'
import { useDocsGlobalContext } from '../../docsGlobalContext'
import { Brand } from '../Brand'
import AsideButtons from './AsideButtons'

const StyledNav = cm.nav`
  gap-4
  flex-1 pl-10 items-center justify-end lg:justify-start 
  hidden lg:flex
`

const StyledNavList = cm.ul`
  inline-flex items-center gap-2 font-semibold 
`

interface DocsNavbarProps {
  scheduleMegaMenuClose?: () => void
  openMegaMenu: (id?: string) => void
  toggleSearch: () => void
  closeMegaMenu?: () => void
  activeSection?: ResolvedDocsSection | null
}

const DocsNavbar = ({
  closeMegaMenu,
  openMegaMenu,
  scheduleMegaMenuClose,
  toggleSearch,
  activeSection,
}: DocsNavbarProps) => {
  const docs = useDocsGlobalContext()

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
          {docs.navbarItems.map((item) => (
            <li key={item.id}>
              <a
                href={withSiteBaseUrl(item.href)}
                className={'block'}
                onPointerEnter={() => openMegaMenu(item.id)}
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
                className="btn btn-ghost btn-sm text-base md:min-w-30 px-2 whitespace-nowrap tracking-tight"
              >
                Search
                <TextSearch className="h-4 w-4" />
              </button>
            </li>
          ) : null}
        </StyledNavList>
      </StyledNav>
      <button type="button" className="block lg:hidden" onClick={handleClick}>
        <Menu className="w-6 h-6" />
      </button>
      <div className="lg:min-w-40 hidden lg:block">
        <AsideButtons />
      </div>
    </div>
  )
}

export default DocsNavbar
