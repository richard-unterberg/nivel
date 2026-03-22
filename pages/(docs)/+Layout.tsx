import cm from '@classmatejs/react'
import type { ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import LayoutComponent from '@/components/LayoutComponent'
import DocsFooter from '@/docs/(components)/Footer'
import Sidebar from '@/docs/(components)/Sidebar'
import TableOfContents from '@/docs/(components)/TableOfContents'
import appConfig from '@/lib/config'
import { getDocPage } from '@/lib/docs/content'
import { getLogicalPathname } from '@/lib/i18n/routing'

const ProseContainer = cm.section`
  prose 
  prose-neutral
  max-w-none
  dark:prose-invert 
  prose-a:text-primary
  prose-code:bg-base-200!
  prose-pre:bg-base-200!
  prose-p:after:content-none
  prose-p:before:content-none
  prose-blockquote:not-italic
  [&_blockquote_p]:mt-0
  [&_blockquote_p]:leading-6
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

const DocsLayout = (props: { children: ReactNode }) => {
  const pageContext = usePageContext()
  const pathname = pageContext.urlPathnameLocalized ?? pageContext.urlPathname
  const docSlug = getLogicalPathname(pathname).replace(/^\/+/, '')
  const doc = getDocPage(docSlug, pageContext.locale)
  const showTableOfContents = (doc?.config.tableOfContents ?? true)

  return (
    <>
      <div className="absolute w-full h-full top-0 left-0 overflow-hidden">
        <div className="w-500 h-300 absolute top-16 -right-100 z-0 opacity-40 dark:opacity-100">
          <img
            src={`${appConfig.publicAssets}decorators/dot.png`}
            alt=""
            width={400}
            height={400}
            className="w-full h-full object-fill absolute inset-0"
          />
        </div>
      </div>
      <LayoutComponent className="lg:flex mx-auto gap-10 xl:gap-14">
        <div className="w-90 shrink-0 relative hidden lg:block">
          <Sidebar />
        </div>
        <div className="mt-10 relative">
          <ProseContainer className="min-w-0 flex-1 z-1 relative" data-doc-content>
            {props.children}
          </ProseContainer>
          <DocsFooter />
        </div>
        {showTableOfContents && <TableOfContents headings={doc?.headings ?? []} />}
      </LayoutComponent>
    </>
  )
}

export default DocsLayout
