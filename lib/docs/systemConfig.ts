import telefunc from '../../pages/+telefunc'
import type { DocConfig } from './config'
import { applyTrailingSlashToPathname } from '../vike/urlPathname.js'

export type TelefuncSearchConfig = {
  indexedWordsPerDoc?: number
}

export type TelefuncFooterConfig = {
  pagination?: boolean
}

export type TelefuncSystemConfig = {
  defaultSlug?: string
  defaultDocConfig?: DocConfig
  search?: TelefuncSearchConfig
  footer?: TelefuncFooterConfig
}

export type ResolvedTelefuncSystemConfig = {
  defaultSlug: string
  defaultDocConfig: DocConfig
  search: {
    indexedWordsPerDoc: number
  }
  footer: {
    pagination: boolean
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
    footer: {
      pagination: config?.footer?.pagination ?? false,
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
  return applyTrailingSlashToPathname(`/${resolved.defaultSlug}`)
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

  return applyTrailingSlashToPathname(`/${normalizedSlug}`)
}

export const matchDocPath = (pathname: string) => {
  const normalizedPathname = pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}`
  const slug = normalizeDocSlug(normalizedPathname)
  return slug || null
}
