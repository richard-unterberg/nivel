import type { ComponentType } from 'react'
import { useData } from 'vike-react/useData'
import { usePageContext } from 'vike-react/usePageContext'
import type { DocPageData } from '../../docs/types.js'
import { UniversalMdxProvider } from '../../mdx/components/UniversalMdxProvider.js'
import { renderInlineMarkdown } from '../../shared/renderInlineMarkdown.js'
import { DocsPagination } from './components/DocsPagination.js'
import { DocsFooter } from './components/Footer.js'
import { LayoutComponent } from './components/LayoutComponent.js'
import { ProseContainer } from './components/ProseContainer.js'
import { Sidebar } from './components/Sidebar.js'
import { TableOfContents } from './components/TableOfContents.js'
import { getDocsGlobalContext } from './docsGlobalContext.js'
import { getMdxRuntimeValue } from './getMdxRuntimeValue.js'

interface DocsPageProps {
  Content: ComponentType
}

export const DocsPage = ({ Content }: DocsPageProps) => {
  const pageContext = usePageContext()
  const docs = getDocsGlobalContext(pageContext as Parameters<typeof getDocsGlobalContext>[0])
  const { page, headings, previousPage, nextPage } = useData() as DocPageData

  return (
    <UniversalMdxProvider
      value={getMdxRuntimeValue({
        docs,
        currentPathname: pageContext.urlPathname,
      })}
    >
      <div className="absolute top-0 left-0 w-full h-[60svh] bg-radial-[at_65%_-85%] from-primary-muted-light/40 dark:from-primary-muted-light/60 to-65%" />
      <LayoutComponent>
        <div className="lg:flex lg:gap-10 xl:gap-14">
          <Sidebar sections={docs.sidebarSections} activeSectionId={page.sectionId} currentHref={page.href} />

          <main className="mt-10 min-w-0 flex-1 basis-auto shrink">
            <ProseContainer data-doc-content="">
              <h1 className="scroll-mt-24">{renderInlineMarkdown(page.title)}</h1>
              <Content />
            </ProseContainer>
            {docs.footer.pagination ? <DocsPagination previousPage={previousPage} nextPage={nextPage} /> : null}
            <DocsFooter brand={docs.brand} />
          </main>
          <TableOfContents headings={headings} partners={docs.partners} />
        </div>
      </LayoutComponent>
    </UniversalMdxProvider>
  )
}
