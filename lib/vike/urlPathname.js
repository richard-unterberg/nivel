/** @type {boolean} */
export const vikeTrailingSlash = false

const ensureLeadingSlash = (pathname) => {
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

export const applyTrailingSlashToPathname = (pathname, trailingSlash = vikeTrailingSlash) => {
  const pathnameNormalized = ensureLeadingSlash(pathname).replace(/\/{2,}/g, '/')

  if (pathnameNormalized === '/') {
    return '/'
  }

  const pathnameWithoutTrailingSlash = pathnameNormalized.replace(/\/+$/g, '')
  return trailingSlash ? `${pathnameWithoutTrailingSlash}/` : pathnameWithoutTrailingSlash
}
