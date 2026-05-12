import cm from '@classmatejs/react'
import { Menu } from 'lucide-react'
import { useCallback } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { useDocsGlobalContext } from '../../docsGlobalContext'
import { Brand } from '../Brand'
import { LayoutComponent } from '../LayoutComponent'
import AsideButtons from './AsideButtons'
import { TopBarNavLinks } from './TopBarNavLinks'

const TopBarNav = () => {
  const docs = useDocsGlobalContext()
  const topBarNavComponents = docs.topBarNavComponents ?? []

  if (docs.topBarNav.kind === 'links') {
    return (
      <nav
        aria-label="Primary"
        className="absolute top-1/2 left-1/2 hidden max-w-[calc(100%-22rem)] -translate-x-1/2 -translate-y-1/2 lg:flex"
      >
        <ul className="inline-flex max-w-full items-center gap-2 overflow-x-auto font-semibold">
          <TopBarNavLinks items={docs.topBarNav.items} minWidthClass="lg:min-w-30" />
        </ul>
      </nav>
    )
  }

  if (docs.topBarNav.kind === 'components') {
    return (
      <div className="hidden min-w-0 flex-1 lg:block">
        {topBarNavComponents.map((TopBarNavComponent) => (
          <TopBarNavComponent key={TopBarNavComponent.name} />
        ))}
      </div>
    )
  }

  return <div className="hidden lg:block lg:flex-1" />
}

const Navbar = () => {
  const { urlParsed } = usePageContext()
  const docs = useDocsGlobalContext()
  const isLandingPage = urlParsed.pathname === '/'

  const handleClick = useCallback(() => {
    alert('TODO: Open mobile menu')
  }, [])

  return (
    <StyledNavbar $fixed={!isLandingPage} $borderBottom>
      <LayoutComponent>
        <div className="relative flex h-14 flex-1 items-center justify-between gap-4">
          <div className="z-10 flex min-w-0 shrink-0 lg:min-w-40">
            <Brand brand={docs.brand} />
          </div>
          <TopBarNav />
          <div className="z-10 hidden min-w-40 justify-end lg:flex">
            <AsideButtons />
          </div>
          <button
            type="button"
            className="z-10 block lg:hidden"
            aria-label="Open navigation menu"
            onClick={handleClick}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </LayoutComponent>
    </StyledNavbar>
  )
}

export default Navbar

const StyledNavbar = cm.header<{ $fixed: boolean; $borderBottom?: boolean }>`
  top-0 left-0 z-20 w-full bg-base-100
  pt-0 h-14
  ${({ $borderBottom, $fixed }) => ($borderBottom && $fixed ? 'border-b border-base-muted-light' : '')}
  ${({ $fixed }) => ($fixed ? 'fixed' : 'relative ')}
`
