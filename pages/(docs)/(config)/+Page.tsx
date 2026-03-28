import { usePageContext } from 'vike-react/usePageContext'
import { getDocPage } from '@/lib/docs/content'
import { getTelefuncSystemConfig } from '@/lib/docs/systemConfig'

const normalizeSlug = (value: string) => value.replace(/^\/+|\/+$/g, '')

const Page = () => {
  const pageContext = usePageContext()
  const docsConfig = getTelefuncSystemConfig(pageContext)
  const routeParams = pageContext.routeParams as { slug?: string }
  const requestedSlug = normalizeSlug(routeParams.slug ?? '')
  const docSlug = requestedSlug || docsConfig.defaultSlug
  const entry = getDocPage(docSlug, pageContext.locale, docsConfig)
  const MdxPage = entry?.Page

  if (!MdxPage) {
    throw new Error(`Missing doc after docs guard check: ${docSlug}`)
  }

  return <MdxPage />
}

export default Page
