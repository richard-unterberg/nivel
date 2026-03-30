import { DEFAULT_LOCALE, isLocale, type Locale, resolveLocale } from './config'
import { applyTrailingSlashToPathname } from '../vike/urlPathname.js'

type LocalePath = {
  locale: Locale
  pathname: string
}

const normalizeBasePath = (value: string | undefined) => {
  const normalized = (value ?? '/').trim()

  if (normalized === '' || normalized === '/') {
    return ''
  }

  return `/${normalized.replace(/^\/+|\/+$/g, '')}`
}

const viteBaseUrl = typeof window !== 'undefined' ? import.meta.env.BASE_URL : undefined
const processBasePath = typeof process !== 'undefined' ? process.env.PAGES_BASE_PATH : undefined
const basePath = normalizeBasePath(processBasePath ?? viteBaseUrl)

const getPathnameOnly = (pathnameOrHref: string) => {
  return pathnameOrHref.split('#')[0]?.split('?')[0] ?? pathnameOrHref
}

const ensureLeadingSlash = (pathname: string) => {
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

const normalizePathname = (pathname: string) => {
  const pathnameNormalized = ensureLeadingSlash(pathname)
  return pathnameNormalized === '' ? '/' : pathnameNormalized.replace(/\/{2,}/g, '/')
}

const stripBaseFromPathname = (pathname: string) => {
  const pathnameNormalized = normalizePathname(pathname)

  if (basePath === '') {
    return pathnameNormalized
  }

  if (pathnameNormalized === basePath) {
    return '/'
  }

  if (pathnameNormalized.startsWith(`${basePath}/`)) {
    return pathnameNormalized.slice(basePath.length) || '/'
  }

  return pathnameNormalized
}

const withBasePath = (pathname: string) => {
  const pathnameNormalized = normalizePathname(pathname)

  if (basePath === '') {
    return pathnameNormalized
  }

  if (pathnameNormalized === '/') {
    return `${basePath}/`
  }

  return `${basePath}${pathnameNormalized}`
}

export const hasLocalePrefix = (pathname: string) => {
  const pathnameNormalized = stripBaseFromPathname(pathname)
  const [maybeLocale] = pathnameNormalized.split('/').filter(Boolean)
  return Boolean(maybeLocale && isLocale(maybeLocale))
}

export const stripLocaleFromPathname = (pathname: string): LocalePath => {
  const pathnameNormalized = stripBaseFromPathname(pathname)
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

export const localizePathname = (href: string, locale: Locale | string | undefined) => {
  const localeResolved = resolveLocale(locale)

  if (href === '' || href.startsWith('#') || isExternalHref(href)) {
    return href
  }

  const [hrefWithoutHash, hash = ''] = href.split('#')
  const [pathname, search = ''] = hrefWithoutHash.split('?')
  const pathnameLocalized = getLogicalPathname(pathname)
  const pathnameWithLocale =
    localeResolved === DEFAULT_LOCALE
      ? pathnameLocalized
      : pathnameLocalized === '/'
        ? `/${localeResolved}`
        : `/${localeResolved}${pathnameLocalized}`
  const pathnameCanonical = applyTrailingSlashToPathname(pathnameWithLocale)

  return `${pathnameCanonical}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`
}

export const localizeHref = (href: string, locale: Locale | string | undefined) => {
  if (href === '' || href.startsWith('#') || isExternalHref(href)) {
    return href
  }

  const localizedHref = localizePathname(href, locale)
  const [hrefWithoutHash, hash = ''] = localizedHref.split('#')
  const [pathname, search = ''] = hrefWithoutHash.split('?')
  const pathnameWithBase = withBasePath(pathname)

  return `${pathnameWithBase}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`
}
