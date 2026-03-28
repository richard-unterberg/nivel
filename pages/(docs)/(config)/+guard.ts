import { render } from 'vike/abort'
import type { PageContext } from 'vike/types'
import { getDocPage } from '@/lib/docs/content'
import { getTelefuncSystemConfig } from '@/lib/docs/systemConfig'

const guard = async (pageContext: PageContext) => {
  const docsConfig = getTelefuncSystemConfig(pageContext)
  const routeParams = pageContext.routeParams as { slug?: string }
  const requestedSlug = routeParams.slug?.replace(/^\/+|\/+$/g, '') ?? ''
  const docSlug = requestedSlug || docsConfig.defaultSlug

  const entry = getDocPage(docSlug, pageContext.locale, docsConfig)

  if (!entry?.Page) {
    throw render(404)
  }
}

export default guard
