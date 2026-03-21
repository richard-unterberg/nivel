import type { PageContextServer } from 'vike/types'
import { localeHtmlLang } from '@/lib/i18n/config'

const lang = (pageContext: PageContextServer) => {
  return localeHtmlLang[pageContext.locale]
}
export default lang
