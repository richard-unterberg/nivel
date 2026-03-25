import type { PageContext } from 'vike/types'
import { stripLocaleFromPathname } from '@/lib/i18n/routing'

const route = (pageContext: PageContext) => {
  const logicalPathname = stripLocaleFromPathname(pageContext.urlPathname).pathname
  const match = logicalPathname.match(/^\/docs(?:\/(.*))?\/?$/)
  if (!match) return false

  const slug = (match[1] ?? '').replace(/^\/+|\/+$/g, '')

  return {
    routeParams: {
      slug,
    },
  }
}

export default route