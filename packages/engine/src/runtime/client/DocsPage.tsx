import type { ComponentType } from 'react'
import { useData } from 'vike-react/useData'
import type { DocPageData } from '../../docs/types.js'
import { renderInlineMarkdown } from '../../shared/renderInlineMarkdown.js'
import DocsBreadcrumbs from './components/DocsBreadcrumbs.js'
import { ProseContainer } from './components/ProseContainer.js'

interface DocsPageProps {
  Content: ComponentType
}

export const DocsPage = ({ Content }: DocsPageProps) => {
  const { page } = useData() as DocPageData

  return (
    <ProseContainer data-doc-content="">
      <DocsBreadcrumbs currentHref={page.href} />
      <h1 className="scroll-mt-32 xl:scroll-mt-22">{renderInlineMarkdown(page.title)}</h1>
      <Content />
    </ProseContainer>
  )
}
