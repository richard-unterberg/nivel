import { modifyUrl } from 'vike/modifyUrl'
import type { PageContextServer } from 'vike/types'
import { stripLocaleFromPathname } from '@/lib/i18n/routing'

const onBeforeRoute = (pageContext: PageContextServer) => {
  const urlPathnameLocalized = pageContext.urlParsed.pathname
  const { locale, pathname } = stripLocaleFromPathname(urlPathnameLocalized)

  return {
    pageContext: {
      locale,
      urlPathnameLocalized,
      urlLogical: modifyUrl(pageContext.urlOriginal, { pathname }),
    },
  }
}
export default onBeforeRoute
