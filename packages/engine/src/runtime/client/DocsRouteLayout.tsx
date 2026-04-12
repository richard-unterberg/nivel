import type { ReactNode } from 'react'
import { useEffect, useLayoutEffect } from 'react'
import { useData } from 'vike-react/useData'
import type { DocPageData } from '../../docs/types.js'
import { DocsPagination } from './components/DocsPagination.js'
import { DocsFooter } from './components/Footer.js'
import { HeadingLinkCopy } from './components/HeadingLinkCopy.js'
import { LayoutComponent } from './components/LayoutComponent.js'
import { Sidebar } from './components/Sidebar.js'
import { TableOfContents } from './components/TableOfContents.js'
import { useDocsRouteActions } from './store/runtime-store.js'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const DocsRouteStateSync = ({ data }: { data: DocPageData }) => {
  const { clearPageData, setPageData } = useDocsRouteActions()

  useIsomorphicLayoutEffect(() => {
    setPageData(data)
  }, [data, setPageData])

  useEffect(() => {
    return () => {
      clearPageData()
    }
  }, [clearPageData])

  return null
}

interface DocsRouteLayoutProps {
  children: ReactNode
}

export const DocsRouteLayout = ({ children }: DocsRouteLayoutProps) => {
  const data = useData() as DocPageData

  return (
    <>
      <DocsRouteStateSync data={data} />
      <HeadingLinkCopy />
      <div className="absolute top-0 left-0 h-[60svh] w-full bg-radial-[at_65%_-85%] from-primary-muted-light/40 to-65% dark:from-primary-muted-light/60" />
      <LayoutComponent>
        <div className="lg:flex lg:gap-10 xl:gap-14">
          <Sidebar currentHref={data.page.href} activeSectionId={data.page.sectionId} />
          <main className="mt-10 min-w-0 flex-1 basis-auto shrink">
            {children}
            <DocsPagination previousPage={data.previousPage} nextPage={data.nextPage} />
            <DocsFooter />
          </main>
          <TableOfContents headings={data.headings} tableOfContents={data.page.tableOfContents} />
        </div>
      </LayoutComponent>
    </>
  )
}
