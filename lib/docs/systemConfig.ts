import type { DocConfig } from '@/lib/docs/config'
import mdex from '@/pages/+mdex'

export type MdexSystemConfig = {
  basePath?: string
  defaultSlug?: string
  defaultDocConfig?: DocConfig
}

export type ResolvedMdexSystemConfig = {
  basePath: string
  defaultSlug: string
  defaultDocConfig: DocConfig
}

const normalizeBasePath = (value: string | undefined) => {
  const normalized = (value ?? '/docs').trim()

  if (normalized === '' || normalized === '/') {
    return ''
  }

  return `/${normalized.replace(/^\/+|\/+$/g, '')}`
}

const normalizeDocSlug = (value: string | undefined) => {
  return (value ?? '').replace(/^\/+|\/+$/g, '')
}

export const resolveMdexSystemConfig = (config?: MdexSystemConfig): ResolvedMdexSystemConfig => {
  return {
    basePath: normalizeBasePath(config?.basePath),
    defaultSlug: normalizeDocSlug(config?.defaultSlug) || 'get-started',
    defaultDocConfig: config?.defaultDocConfig ?? { tableOfContents: true },
  }
}

export const mdexSystemConfig = resolveMdexSystemConfig(mdex)

export const getMdexSystemConfig = (value?: { config?: { mdex?: MdexSystemConfig } }) => {
  return resolveMdexSystemConfig(value?.config?.mdex ?? mdexSystemConfig)
}

export const getDocsIndexPath = (config: MdexSystemConfig | ResolvedMdexSystemConfig = mdexSystemConfig) => {
  const resolved = resolveMdexSystemConfig(config)
  return resolved.basePath || `/${resolved.defaultSlug}`
}

export const getDocPath = (slug: string, config: MdexSystemConfig | ResolvedMdexSystemConfig = mdexSystemConfig) => {
  const resolved = resolveMdexSystemConfig(config)
  const normalizedSlug = normalizeDocSlug(slug)

  if (normalizedSlug === '') {
    return getDocsIndexPath(resolved)
  }

  return resolved.basePath ? `${resolved.basePath}/${normalizedSlug}` : `/${normalizedSlug}`
}

export const matchDocPath = (
  pathname: string,
  config: MdexSystemConfig | ResolvedMdexSystemConfig = mdexSystemConfig,
) => {
  const resolved = resolveMdexSystemConfig(config)
  const normalizedPathname = pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}`

  if (resolved.basePath === '') {
    const slug = normalizeDocSlug(normalizedPathname)
    return slug || null
  }

  if (normalizedPathname === resolved.basePath) {
    return ''
  }

  const prefix = `${resolved.basePath}/`
  if (!normalizedPathname.startsWith(prefix)) {
    return null
  }

  return normalizeDocSlug(normalizedPathname.slice(prefix.length))
}
