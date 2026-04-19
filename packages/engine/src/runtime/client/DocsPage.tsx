import type { ComponentType } from 'react'
import { useData } from 'vike-react/useData'
import { usePageContext } from 'vike-react/usePageContext'
import type { DocPageData } from '../../docs/types.js'
import { UniversalMdxProvider } from '../../mdx/components/UniversalMdxProvider.js'
import { renderInlineMarkdown } from '../../shared/renderInlineMarkdown.js'
import DocsBreadcrumbs from './components/DocsBreadcrumbs.js'
import { ProseContainer } from './components/ProseContainer.js'
import { useDocsGlobalContext } from './docsGlobalContext.js'
import { getMdxRuntimeValue } from './getMdxRuntimeValue.js'

interface DocsPageProps {
  Content: ComponentType
}

export const DocsPage = ({ Content }: DocsPageProps) => {
  const pageContext = usePageContext()
  const docs = useDocsGlobalContext()
  const { page } = useData() as DocPageData

  return (
    <UniversalMdxProvider
      value={getMdxRuntimeValue({
        docs,
        currentPathname: pageContext.urlPathname,
      })}
    >
      <ProseContainer data-doc-content="">
        <DocsBreadcrumbs currentHref={page.href} />
        <h1 className="scroll-mt-32 xl:scroll-mt-22">{renderInlineMarkdown(page.title)}</h1>
        <Content />
      </ProseContainer>
    </UniversalMdxProvider>
  )
}
