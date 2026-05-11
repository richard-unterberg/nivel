import cm from '@classmatejs/react'
import { usePageContext } from 'vike-react/usePageContext'
import { getActiveSectionByPathname } from '../../../../docs/runtime'
import { useDocsGlobalContext } from '../../docsGlobalContext'
import { LayoutComponent } from '../LayoutComponent'
import DocsNavbar from './DocsNavbar'
import LandingPageNavbar from './LandingPageNavbar'

const Navbar = () => {
  const docs = useDocsGlobalContext()
  const { urlPathname, urlParsed } = usePageContext()
  const isLandingPage = urlParsed.pathname === '/'
  const activeSection = getActiveSectionByPathname(docs, urlPathname)

  return (
    <StyledNavbar $fixed={!isLandingPage} $borderBottom>
      <LayoutComponent>
        {isLandingPage ? <LandingPageNavbar /> : <DocsNavbar activeSection={activeSection} />}
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
