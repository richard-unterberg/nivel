const normalizeSiteBasePath = (value: string | undefined) => {
  const normalized = value?.trim().replace(/^\/+|\/+$/g, '') ?? ''
  return normalized ? `/${normalized}/` : '/'
}

const importMetaEnv = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env

const siteBasePath = normalizeSiteBasePath(importMetaEnv?.BASE_URL ?? process.env.PAGES_BASE_PATH)

const isExternalUrl = (value: string) => value.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(value)

const prependSiteBaseUrl = (value: string) => {
  if (value === '' || value.startsWith('#') || isExternalUrl(value)) {
    return value
  }

  const pathname = value.startsWith('/') ? value : `/${value.replace(/^\/+/, '')}`
  return siteBasePath === '/' ? pathname : `${siteBasePath.slice(0, -1)}${pathname}`
}

export const withSiteBaseUrl = (value: string) => {
  if (value === '' || value.startsWith('#') || isExternalUrl(value)) {
    return value
  }

  if (!value.startsWith('/')) {
    return value
  }

  if (siteBasePath !== '/' && (value === siteBasePath.slice(0, -1) || value.startsWith(siteBasePath))) {
    return value
  }

  return siteBasePath === '/' ? value : `${siteBasePath.slice(0, -1)}${value}`
}

export const resolvePublicAssetUrl = (value: string | undefined) => {
  if (!value) {
    return undefined
  }

  if (value.startsWith('#') || isExternalUrl(value)) {
    return value
  }

  const pathname = value.startsWith('/') ? value : `/${value.replace(/^\/+/, '')}`
  return withSiteBaseUrl(pathname)
}

export const nivelPublicRoute = '/nivel'

// Engine-owned assets always live under the site base, even if the public route
// happens to match the repository base path on GitHub Pages.
export const baseAssets = `${prependSiteBaseUrl(nivelPublicRoute).replace(/\/?$/, '/')}`

export const nivelAssetUrl = (assetPath: string) => `${baseAssets}${assetPath.replace(/^\/+/, '')}`
