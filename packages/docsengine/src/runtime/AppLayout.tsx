import type { ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import type { DocsConfig } from '../types.js'
import { Navbar } from './components/Navbar.js'
import { UserSettingsSync } from './components/UserSettingsSync.js'
import { getActiveSectionByPathname, resolveDocsConfig } from './resolveDocsConfig.js'

interface AppLayoutProps {
  children: ReactNode
  docsConfig: DocsConfig
}

export const AppLayout = ({ children, docsConfig }: AppLayoutProps) => {
  const pageContext = usePageContext()
  const resolvedConfig = resolveDocsConfig(docsConfig)
  const activeSection = getActiveSectionByPathname(resolvedConfig, pageContext.urlPathname)

  return (
    <>
      <UserSettingsSync theme={resolvedConfig.theme} />
      <div className="min-h-screen bg-base-100 text-base-content">
        <Navbar
          brand={resolvedConfig.brand}
          activeSectionId={activeSection?.id ?? null}
          navbarItems={resolvedConfig.navbarItems}
          theme={resolvedConfig.theme}
        />
        <div className="pt-16">{children}</div>
      </div>
    </>
  )
}
