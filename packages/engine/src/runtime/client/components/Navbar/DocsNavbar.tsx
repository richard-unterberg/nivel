import cm from '@classmatejs/react'
import { Menu } from 'lucide-react'
import { useCallback } from 'react'
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

const DocsNavbar = () => {
  const docs = useDocsGlobalContext()
  const topBarNavComponents = docs.topBarNavComponents ?? []

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
          {docs.topBarNav.kind === 'links' ? (
            <TopBarNavLinks items={docs.topBarNav.items} minWidthClass="md:min-w-30" />
          ) : null}
          {docs.topBarNav.kind === 'components'
            ? topBarNavComponents.map((TopBarNavComponent) => <TopBarNavComponent key={TopBarNavComponent.name} />)
            : null}
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
