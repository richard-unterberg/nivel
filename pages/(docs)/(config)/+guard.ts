import { redirect, render } from 'vike/abort'
import type { PageContext } from 'vike/types'
import { getDocPage } from '@/lib/docs/content'
import { getDocPath, getMdexSystemConfig } from '@/lib/docs/systemConfig'
import { localizeHref } from '@/lib/i18n/routing'

const guard = async (pageContext: PageContext) => {
  const docsConfig = getMdexSystemConfig(pageContext)
  const routeParams = pageContext.routeParams as { slug?: string }
  const requestedSlug = routeParams.slug?.replace(/^\/+|\/+$/g, '') ?? ''
  const docSlug = requestedSlug || docsConfig.defaultSlug

  if (requestedSlug === '' && docsConfig.basePath !== '') {
    throw redirect(localizeHref(getDocPath(docSlug, docsConfig), pageContext.locale))
  }

  const entry = getDocPage(docSlug, pageContext.locale, docsConfig)

  if (!entry?.Page) {
    throw render(404)
  }
}

export default guard
