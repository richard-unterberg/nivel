import type { Locale } from '@/lib/i18n/config'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'
import { localizeHref, stripLocaleFromPathname } from '@/lib/i18n/routing'

const mainMenuHeadingTitles = {
  getStarted: {
    en: 'Get Started',
    de: 'Erste Schritte',
    zh: '快速开始',
  },
} as const

const baseHeadingLinks = {
  getStarted: '/get-started',
} as const

const subMenuHeadingTitles = {
  anotherPage: {
    en: 'Another Page',
    de: 'Eine andere Seite',
    zh: '另一页',
  },
} as const

const subMenuHeadingLinks = {
  anotherPage: '/another-page',
} as const

export const headingTitles = {
  ...mainMenuHeadingTitles,
  ...subMenuHeadingTitles,
} as const

const headingLinks: Record<HeadingKey, string> = {
  ...baseHeadingLinks,
  ...subMenuHeadingLinks,
}

export type HeadingKey = keyof typeof headingTitles





export const getHeadingTitle = (headingKey: HeadingKey, locale: Locale = DEFAULT_LOCALE) => {
  return headingTitles[headingKey][locale]
}

export const getHeadingData = (headingKey: HeadingKey, locale: Locale = DEFAULT_LOCALE) => {
  return {
    title: getHeadingTitle(headingKey, locale),
    href: localizeHref(headingLinks[headingKey], locale),
  }
}

export const getHeadingTitleFromHref = (href: string, locale: Locale = DEFAULT_LOCALE) => {
  const pathname = stripLocaleFromPathname(href.split('#')[0]?.split('?')[0] ?? href).pathname
  const match = Object.entries(headingLinks).find(([, headingHref]) => headingHref === pathname)
  if (!match) return null

  const [headingKey] = match
  return getHeadingTitle(headingKey as HeadingKey, locale)
}
