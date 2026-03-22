import { modifyUrl } from 'vike/modifyUrl'
import type { PageContextServer } from 'vike/types'
import { stripLocaleFromPathname } from '@/lib/i18n/routing'
import { DEFAULT_THEME_PREFERENCE } from '@/lib/theme'

const onBeforeRoute = (pageContext: PageContextServer) => {
  const urlPathnameLocalized = pageContext.urlParsed.pathname
  const { locale, pathname } = stripLocaleFromPathname(urlPathnameLocalized)

  return {
    pageContext: {
      locale,
      themePreference: DEFAULT_THEME_PREFERENCE,
      urlPathnameLocalized,
      urlLogical: modifyUrl(pageContext.urlOriginal, { pathname }),
    },
  }
}
export default onBeforeRoute
