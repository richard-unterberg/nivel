import type { PageContext } from 'vike/types'
import { hasDocSlug } from '@/lib/docs/content'
import { getMdexSystemConfig, matchDocPath } from '@/lib/docs/systemConfig'
import { stripLocaleFromPathname } from '@/lib/i18n/routing'

const route = (pageContext: PageContext) => {
  const docsConfig = getMdexSystemConfig(pageContext)
  const logicalPathname = stripLocaleFromPathname(pageContext.urlPathname).pathname
  const slug = matchDocPath(logicalPathname, docsConfig)
  if (slug === null) return false
  if (docsConfig.basePath === '' && !hasDocSlug(slug)) return false

  return {
    routeParams: {
      slug,
    },
  }
}

export default route
