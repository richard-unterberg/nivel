import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { Navbar } from './components/Navbar/index.js'
import { UserSettingsSync } from './components/UserSettingsSync.js'
import { getActiveSectionByPathname } from '../../docs/resolveDocsConfig.js'
import { getDocsGlobalContext } from './docsGlobalContext.js'

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const pageContext = usePageContext()
  const docs = getDocsGlobalContext(pageContext as Parameters<typeof getDocsGlobalContext>[0])
  const activeSection = getActiveSectionByPathname(docs, pageContext.urlPathname)
  const [queryClient] = useState(() => new QueryClient())

  return (
    // todo: we should try vike-react-query instead
    <QueryClientProvider client={queryClient}>
      <UserSettingsSync theme={docs.theme} />
      <div className="min-h-screen bg-base-100 text-base-content">
        <Navbar
          brand={docs.brand}
          activeSectionId={activeSection?.id ?? null}
          algolia={docs.algolia}
          navbarItems={docs.navbarItems}
          sections={docs.sidebarSections}
          theme={docs.theme}
        />
        <div className="pt-16">{children}</div>
      </div>
    </QueryClientProvider>
  )
}
