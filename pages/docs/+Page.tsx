import { usePageContext } from 'vike-react/usePageContext'
import { getDocPage } from '@/lib/docs/content'

const DEFAULT_DOC_SLUG = 'get-started'

const normalizeSlug = (value: string) => value.replace(/^\/+|\/+$/g, '')

const Page = () => {
  const pageContext = usePageContext()
  const routeParams = pageContext.routeParams as { slug?: string }
  const requestedSlug = normalizeSlug(routeParams.slug ?? '')
  const docSlug = requestedSlug || DEFAULT_DOC_SLUG
  const entry = getDocPage(`docs/${docSlug}`, pageContext.locale)
  const MdxPage = entry?.Page

  if (!MdxPage) {
    throw new Error(`Missing doc after docs guard check: ${docSlug}`)
  }

  return <MdxPage />
}

export default Page
