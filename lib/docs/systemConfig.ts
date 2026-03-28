import telefunc from '../../pages/+telefunc'
import type { DocConfig } from './config'

export type TelefuncSearchConfig = {
  indexedWordsPerDoc?: number
}

export type TelefuncSystemConfig = {
  defaultSlug?: string
  defaultDocConfig?: DocConfig
  search?: TelefuncSearchConfig
}

export type ResolvedTelefuncSystemConfig = {
  defaultSlug: string
  defaultDocConfig: DocConfig
  search: {
    indexedWordsPerDoc: number
  }
}

const normalizeDocSlug = (value: string | undefined) => {
  return (value ?? '').replace(/^\/+|\/+$/g, '')
}

export const resolveTelefuncSystemConfig = (config?: TelefuncSystemConfig): ResolvedTelefuncSystemConfig => {
  return {
    defaultSlug: normalizeDocSlug(config?.defaultSlug) || 'get-started',
    defaultDocConfig: config?.defaultDocConfig ?? { tableOfContents: true },
    search: {
      indexedWordsPerDoc: Math.max(1, Math.floor(config?.search?.indexedWordsPerDoc ?? 120)),
    },
  }
}

export const telefuncSystemConfig = resolveTelefuncSystemConfig(telefunc)

export const getTelefuncSystemConfig = (value?: { config?: { telefunc?: TelefuncSystemConfig } }) => {
  return resolveTelefuncSystemConfig(value?.config?.telefunc ?? telefuncSystemConfig)
}

export const getDocsIndexPath = (
  config: TelefuncSystemConfig | ResolvedTelefuncSystemConfig = telefuncSystemConfig,
) => {
  const resolved = resolveTelefuncSystemConfig(config)
  return `/${resolved.defaultSlug}`
}

export const getDocPath = (
  slug: string,
  config: TelefuncSystemConfig | ResolvedTelefuncSystemConfig = telefuncSystemConfig,
) => {
  const resolved = resolveTelefuncSystemConfig(config)
  const normalizedSlug = normalizeDocSlug(slug)

  if (normalizedSlug === '') {
    return getDocsIndexPath(resolved)
  }

  return `/${normalizedSlug}`
}

export const matchDocPath = (pathname: string) => {
  const normalizedPathname = pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}`
  const slug = normalizeDocSlug(normalizedPathname)
  return slug || null
}
