import type { Locale } from '@/lib/i18n/config'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config'

type LocalePath = {
  locale: Locale
  pathname: string
}

const getPathnameOnly = (pathnameOrHref: string) => {
  return pathnameOrHref.split('#')[0]?.split('?')[0] ?? pathnameOrHref
}

const ensureLeadingSlash = (pathname: string) => {
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

const normalizePathname = (pathname: string) => {
  const pathnameNormalized = ensureLeadingSlash(pathname)
  return pathnameNormalized === '' ? '/' : pathnameNormalized
}

export const stripLocaleFromPathname = (pathname: string): LocalePath => {
  const pathnameNormalized = normalizePathname(pathname)
  const segments = pathnameNormalized.split('/').filter(Boolean)
  const [maybeLocale, ...rest] = segments

  if (maybeLocale && isLocale(maybeLocale)) {
    const nextPathname = `/${rest.join('/')}`
    return {
      locale: maybeLocale,
      pathname: nextPathname === '/' ? '/' : nextPathname.replace(/\/{2,}/g, '/'),
    }
  }

  return {
    locale: DEFAULT_LOCALE,
    pathname: pathnameNormalized,
  }
}

export const getLogicalPathname = (pathnameOrHref: string) => {
  return stripLocaleFromPathname(getPathnameOnly(pathnameOrHref)).pathname
}

const isExternalHref = (href: string) => {
  return /^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
}

export const localizeHref = (href: string, locale: Locale) => {
  if (locale === DEFAULT_LOCALE || href === '' || href.startsWith('#') || isExternalHref(href)) {
    return href
  }

  const [hrefWithoutHash, hash = ''] = href.split('#')
  const [pathname, search = ''] = hrefWithoutHash.split('?')
  const pathnameLocalized = getLogicalPathname(pathname)
  const pathnameWithLocale = pathnameLocalized === '/' ? `/${locale}` : `/${locale}${pathnameLocalized}`

  return `${pathnameWithLocale}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`
}
