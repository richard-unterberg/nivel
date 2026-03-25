import { render } from 'vike/abort'
import type { PageContext } from 'vike/types'
import { getDocPage } from '@/lib/docs/content'

const DEFAULT_DOC_SLUG = 'get-started'

const guard = async (pageContext: PageContext) => {
  const routeParams = pageContext.routeParams as { slug?: string }
  const docSlug = routeParams.slug?.replace(/^\/+|\/+$/g, '') || DEFAULT_DOC_SLUG
  const entry = getDocPage(`docs/${docSlug}`, pageContext.locale)

  if (!entry?.Page) {
    throw render(404)
  }
}

export default guard
