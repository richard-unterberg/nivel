import { usePageContext } from 'vike-react/usePageContext'
import { getDocPage } from '@/lib/docs/content'
import { getDocHeaderMeta } from '@/lib/navigation/docHeader'
import { renderInlineMarkdown } from '@/pages/(docs)/(components)/Sidebar/SidebarNavigation'

const DocPage = ({ slug }: { slug: string }) => {
  const pageContext = usePageContext()
  const { locale } = pageContext
  const entry = getDocPage(slug, locale)
  const Page = entry?.Page
  const pathname = pageContext.urlPathnameLocalized ?? pageContext.urlPathname
  const headerMeta = getDocHeaderMeta(pathname, locale)

  if (!Page) return <p>Missing document: {slug}</p>

  return (
    <>
      {headerMeta && (
        <header className="prose prose-neutral">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            {headerMeta.groupTitle}
            {headerMeta.categoryTitle ? <> / {headerMeta.categoryTitle}</> : null}
          </p>
          <h1>{renderInlineMarkdown(headerMeta.title)}</h1>
        </header>
      )}
      <Page />
    </>
  )
}

export const createDocPage = (slug: string) => {
  return () => <DocPage slug={slug} />
}
