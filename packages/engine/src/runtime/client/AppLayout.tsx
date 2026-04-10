import { cmMerge } from '@classmatejs/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { Navbar } from './components/Navbar/index.js'
import { UserSettingsSync } from './components/UserSettingsSync.js'
import { getDocsGlobalContext } from './docsGlobalContext.js'
import { createDocsRuntimeStore, DocsRuntimeStoreProvider } from './store/runtime-store.js'

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { urlPathname } = usePageContext()
  const pageContext = usePageContext()

  const docs = getDocsGlobalContext(pageContext as Parameters<typeof getDocsGlobalContext>[0])
  const isLandingPage = urlPathname === '/'

  const [docsRuntimeStore] = useState(() => createDocsRuntimeStore())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <DocsRuntimeStoreProvider store={docsRuntimeStore}>
      {/* todo: we should try vike-react-query instead */}
      <QueryClientProvider client={queryClient}>
        <UserSettingsSync theme={docs.theme} />
        <div className="min-h-screen bg-base-100 text-base-content">
          <Navbar
            brand={docs.brand}
            navbarItems={docs.navbarItems}
            sections={docs.sidebarSections}
            theme={docs.theme}
          />
          <div className={cmMerge(isLandingPage ? '' : 'pt-16')}>{children}</div>
        </div>
      </QueryClientProvider>
    </DocsRuntimeStoreProvider>
  )
}
