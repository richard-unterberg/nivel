import cm, { cmMerge } from '@classmatejs/react'
import { Menu } from 'lucide-react'
import { useCallback } from 'react'
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

const LandingPageNavbar = () => {
  const docs = useDocsGlobalContext()
  const TopBarNavComponent = docs.topBarNavComponent
  const buttonClassName = 'btn btn-ghost btn-sm text-base lg:min-w-30 px-2 whitespace-nowrap tracking-tight'

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
          {docs.topBarNav.kind === 'links' ? (
            <TopBarNavLinks items={docs.topBarNav.items} minWidthClass="lg:min-w-30" />
          ) : null}
          {docs.topBarNav.kind === 'component' && TopBarNavComponent ? (
            <TopBarNavComponent
              activeButtonClassName={cmMerge(buttonClassName, 'btn-primary btn-soft')}
              activeSection={null}
              buttonClassName={buttonClassName}
              docs={docs}
              isLandingPage={true}
            />
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
