import cm from '@classmatejs/react'
import type { ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import DocsFooter from '@/components/Footer'
import LayoutComponent from '@/components/LayoutComponent'
import Sidebar from '@/components/Sidebar'
import TableOfContents from '@/components/TableOfContents'
import baseAssets from '@/lib/baseAssets'
import { getDocPage } from '@/lib/docs/content'
import { getMdexSystemConfig } from '@/lib/docs/systemConfig'

// .prose pre {
//   @apply rounded-lg border border-vike-grey leading-5!;
// }

const ProseContainer = cm.section`
  min-h-[calc(100svh-92*var(--spacing))]
  prose 
  prose-neutral
  max-w-none
  dark:prose-invert
  prose-a:text-accent

  prose-code:text-vike-grey-100

  prose-code:rounded!
  prose-code:inset-shadow-2xs

  prose-code:bg-primary/5!
  prose-code:border-accent/20!

  prose-code:dark:bg-primary/10!
  prose-code:dark:border-accent/20!

  prose-pre:bg-base-200!
  prose-pre:rounded-box
  prose-pre:border
  prose-pre:border-vike-grey
  prose-pre:leading-5!
  prose-pre:overflow-x-auto

  prose-p:after:content-none
  prose-p:before:content-none
  prose-blockquote:not-italic
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
  const docsConfig = getMdexSystemConfig(pageContext)
  const routeParams = pageContext.routeParams as { slug?: string }
  const docSlug = (routeParams.slug ?? '').replace(/^\/+|\/+$/g, '') || docsConfig.defaultSlug
  const isDocsErrorPage = is404 || errorWhileRendering
  const doc = isDocsErrorPage ? null : getDocPage(docSlug, locale, docsConfig)
  const showTableOfContents = !isDocsErrorPage && (doc?.config.tableOfContents ?? true)
  const tocKey = `${pageId}:${docSlug}:${locale}`

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
          <div className="basis-90 shrink-0 relative hidden lg:block">
            <Sidebar />
          </div>
          <div className="mt-10 flex-1 relative basis-auto shrink">
            <ProseContainer className="min-w-0 flex-1 z-1 relative" data-doc-content>
              {children}
            </ProseContainer>
            <DocsFooter />
          </div>
          {showTableOfContents && <TableOfContents key={tocKey} headings={doc?.headings ?? []} />}
        </div>
      </LayoutComponent>
    </>
  )
}

export default DocsLayout
