import type { ReactNode } from 'react'
import { useData } from 'vike-react/useData'
import type { DocPageData } from '../../docs/types.js'
import { DocsPagination } from './components/DocsPagination.js'
import { DocsFooter } from './components/Footer.js'
import { HeadingLinkCopy } from './components/HeadingLinkCopy.js'
import { LayoutComponent } from './components/LayoutComponent.js'
import { Sidebar } from './components/Sidebar.js'
import { TableOfContents } from './components/TableOfContents.js'
import TableOfContentsMobile from './components/TableOfContentsMobile.js'
import { useTableOfContentsState } from './components/useTableOfContentsState.js'

interface DocsLayoutProps {
  children: ReactNode
}

export const DocsLayout = ({ children }: DocsLayoutProps) => {
  const data = useData() as DocPageData
  const { activeHeadingId, effectiveHeadings, setActiveHeadingId } = useTableOfContentsState({
    headings: data.headings,
  })

  return (
    <>
      <HeadingLinkCopy />
      <div className="absolute top-0 left-0 h-[60svh] w-full bg-radial-[at_65%_-85%] from-primary-muted-light/40 to-65% dark:from-primary-muted-light/60" />
      <LayoutComponent>
        <div className="lg:flex gap-14">
          <Sidebar currentHref={data.page.href} activeSectionId={data.page.sectionId} />
          <main className="min-w-0 flex-1 basis-auto shrink">
            <TableOfContentsMobile
              headings={effectiveHeadings}
              tableOfContents={data.page.tableOfContents && effectiveHeadings.length > 0}
              pageTitle={data.page.title}
              currentHref={data.page.href}
              activeHeadingId={activeHeadingId}
              setActiveHeadingId={setActiveHeadingId}
            />
            <div className="mt-10 min-w-0">{children}</div>
            <DocsPagination previousPage={data.previousPage} nextPage={data.nextPage} />
            <DocsFooter />
          </main>
          <TableOfContents
            headings={effectiveHeadings}
            tableOfContents={data.page.tableOfContents}
            activeHeadingId={activeHeadingId}
            setActiveHeadingId={setActiveHeadingId}
          />
        </div>
      </LayoutComponent>
    </>
  )
}
