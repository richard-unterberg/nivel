import { cmMerge } from '@classmatejs/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { Navbar } from './components/Navbar/index.js'
import { UserSettingsSync } from './components/UserSettingsSync.js'
import { DocsGlobalContextProvider, type DocsPageContext, getDocsFromGlobalContext } from './docsGlobalContext.js'
import { createDocsRuntimeStore, DocsRuntimeStoreProvider } from './store/runtime-store.js'

interface AppLayoutProps {
  children: ReactNode
  header?: ReactNode
}

const queryClient = new QueryClient()
const runtimeStore = createDocsRuntimeStore()

export const AppLayout = ({ children, header }: AppLayoutProps) => {
  const { urlPathname } = usePageContext()
  const pageContext = usePageContext()

  const docs = getDocsFromGlobalContext(pageContext as DocsPageContext)
  const isLandingPage = urlPathname === '/'

  return (
    <DocsRuntimeStoreProvider store={runtimeStore}>
      <DocsGlobalContextProvider docs={docs}>
        <QueryClientProvider client={queryClient}>
          <UserSettingsSync theme={docs.theme} />
          <div className="min-h-screen bg-base-100 text-base-content">
            {header ?? <Navbar />}
            <div className={cmMerge(isLandingPage ? '' : 'pt-16')}>{children}</div>
          </div>
        </QueryClientProvider>
      </DocsGlobalContextProvider>
    </DocsRuntimeStoreProvider>
  )
}
