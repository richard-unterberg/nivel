import cm from '@classmatejs/react'
import type { ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import DocsPagination from '@/app-components/DocsPagination'
import DocsFooter from '@/app-components/Footer'
import LayoutComponent from '@/app-components/LayoutComponent'
import Sidebar from '@/app-components/Sidebar'
import TableOfContents from '@/app-components/TableOfContents'
import baseAssets from '@/lib/baseAssets'
import type { DocPageData } from '@/lib/docs/contentData'
import { getDocPageDataFromPageContext } from '@/lib/docs/pageContext'
import { getDocsHeadMetadata } from './docMetadata'

const ProseContainer = cm.section`
  min-h-[calc(100svh-92*var(--spacing))]
  prose 
  prose-neutral
  max-w-none
  dark:prose-invert
  prose-a:text-primary

  prose-pre:bg-base-200!

  prose-code:py-0!
  prose-code:px-1!

  prose-code:rounded!
  prose-code:dark:inset-shadow-2xs

  prose-code:bg-primary/5!
  prose-code:border-primary/15!

  prose-code:dark:bg-primary/10!
  prose-code:dark:border-primary/20!

  prose-p:leading-[240%]
  prose-li:leading-[240%]

  prose-p:after:content-none
  prose-p:before:content-none
  prose-blockquote:not-italic
  prose-blockquote:bg-base-200
  prose-li:my-1
  [&_blockquote_p]:mt-0
  [&_blockquote_p]:mb-2
  [&_blockquote_ul]:pl-4
  [&_blockquote_ul]:mt-2
  [&_blockquote_li]:mt-2
  [&_blockquote_blockquote]:mt-2
  [&_blockquote_blockquote]:mb-0
  [&_blockquote_blockquote]:bg-base-300/40
  [&_blockquote_blockquote]:pt-2
  [&_blockquote_blockquote]:pb-1
`

const DocsLayout = ({ children }: { children: ReactNode }) => {
  const pageContext = usePageContext()
  const { locale, pageId, is404, errorWhileRendering } = pageContext
  const isDocsErrorPage = is404 || errorWhileRendering
  const docData = (!isDocsErrorPage ? getDocPageDataFromPageContext(pageContext) : null) as DocPageData | null
  const showTableOfContents = !isDocsErrorPage && (docData?.config.tableOfContents ?? true)
  const tocKey = `${pageId}:${docData?.docSlug ?? 'docs-error'}:${locale}`
  const docTitle = getDocsHeadMetadata(pageContext)?.title ?? ''

  return (
    <>
      <div className="absolute w-full h-full top-0 left-0 overflow-hidden">
        <div className="w-500 h-200 absolute top-16 -right-100 z-0 opacity-40 dark:opacity-70">
          <img
            src={`${baseAssets}decorators/dot.png`}
            alt=""
            width={400}
            height={400}
            className="w-full h-full object-fill absolute inset-0"
          />
        </div>
      </div>
      <LayoutComponent>
        <div className="lg:flex mx-auto gap-10 xl:gap-14">
          <div className="basis-80 shrink-0 relative hidden lg:block">
            <Sidebar />
          </div>
          <div className="mt-10 flex-1 min-w-0 relative basis-auto shrink">
            <ProseContainer className="flex-1 z-1 relative" data-doc-content>
              <h1>{docTitle}</h1>
              {children}
            </ProseContainer>
            <DocsPagination />
            <DocsFooter />
          </div>
          {showTableOfContents && <TableOfContents key={tocKey} headings={docData?.headings ?? []} />}
        </div>
      </LayoutComponent>
    </>
  )
}

export default DocsLayout
