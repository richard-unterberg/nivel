import { cmMerge } from '@classmatejs/react'
import type { ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { UniversalMdxProvider } from '../../mdx/components/UniversalMdxProvider.js'
import NavbarNew from './components/Navbar/index.js'
import { UserSettingsSync } from './components/UserSettingsSync.js'
import { DocsGlobalContextProvider, type DocsPageContext, getDocsFromGlobalContext } from './docsGlobalContext.js'
import { getMdxRuntimeValue } from './getMdxRuntimeValue.js'
import { createDocsRuntimeStore, DocsRuntimeStoreProvider } from './store/runtime-store.js'

interface AppLayoutProps {
  children: ReactNode
  header?: ReactNode
}

const runtimeStore = createDocsRuntimeStore()

export const AppLayout = ({ children, header }: AppLayoutProps) => {
  const { urlPathname } = usePageContext()
  const pageContext = usePageContext()

  const docs = getDocsFromGlobalContext(pageContext as DocsPageContext)
  const isLandingPage = urlPathname === '/'

  return (
    <DocsRuntimeStoreProvider store={runtimeStore}>
      <DocsGlobalContextProvider docs={docs}>
        <UniversalMdxProvider
          value={getMdxRuntimeValue({
            docs,
            currentPathname: urlPathname,
          })}
        >
          <UserSettingsSync theme={docs.theme} />
          <div className="min-h-screen bg-base-100 text-base-content">
            {header ?? <NavbarNew />}
            <div className={cmMerge(isLandingPage ? '' : 'pt-14')}>{children}</div>
          </div>
        </UniversalMdxProvider>
      </DocsGlobalContextProvider>
    </DocsRuntimeStoreProvider>
  )
}
