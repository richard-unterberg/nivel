import type { ComponentType } from 'react'
import type { DocConfig } from '@/lib/docs/config'
import { type DocHeading, extractDocHeadings } from '@/lib/docs/headings'
import {
  getDocPath,
  getDocsIndexPath,
  type TelefuncSystemConfig,
  resolveTelefuncSystemConfig,
  telefuncSystemConfig,
} from '@/lib/docs/systemConfig'
import { DEFAULT_LOCALE, isLocale, type Locale, locales } from '@/lib/i18n/config'
import { localizePathname } from '@/lib/i18n/routing'

type MdxModule = {
  default: ComponentType
  docConfig?: DocConfig
}

type DocConfigModule = {
  default?: DocConfig
}

type DocContentModule = {
  Page?: ComponentType
  headings?: DocHeading[]
  config?: DocConfig
  source?: string
}

type DocEntry = Partial<Record<Locale, DocContentModule>>
type PagePathInfo = {
  segments: string[]
  filename: string
}

const pageModules = import.meta.glob<MdxModule>('../../pages/**/content.*.mdx', {
  eager: true,
})

type RawContentModule = string | { default?: string }

const rawContentModules = import.meta.glob<RawContentModule>('../../pages/**/content.*.mdx', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const docConfigModules = import.meta.glob<DocConfigModule>('../../pages/**/content.config.{ts,js}', {
  eager: true,
})

const getRawDocSource = (module: RawContentModule) => {
  if (typeof module === 'string') return module
  if (typeof module?.default === 'string') return module.default
  return ''
}

const getLogicalSegments = (segments: string[]) => {
  return segments.filter((segment) => segment !== '' && !(segment.startsWith('(') && segment.endsWith(')')))
}

const getPagePathInfo = (path: string): PagePathInfo | null => {
  const match = path.match(/\/pages\/(.+)$/)
  if (!match) return null

  const parts = match[1].split('/').filter(Boolean)
  const filename = parts.at(-1)
  if (!filename) return null

  return {
    segments: parts.slice(0, -1),
    filename,
  }
}

const getDocSlugFromSegments = (segments: string[]) => {
  const contentIndex = segments.indexOf('(content)')
  if (contentIndex < 0) return null

  return getLogicalSegments(segments.slice(contentIndex + 1)).join('/')
}

const getDocsRootSegments = () => {
  const docModulePath = Object.keys(pageModules)[0]
  const pathInfo = docModulePath ? getPagePathInfo(docModulePath) : null
  if (!pathInfo) return []

  const contentIndex = pathInfo.segments.indexOf('(content)')
  if (contentIndex < 0) return []

  return pathInfo.segments.slice(0, contentIndex)
}

const docsRootSegments = getDocsRootSegments()

const getDocModuleMeta = (path: string) => {
  const pathInfo = getPagePathInfo(path)
  if (!pathInfo) return null

  const localeMatch = pathInfo.filename.match(/^content\.([^.]+)\.mdx$/)
  if (!localeMatch) return null

  const [, locale] = localeMatch
  if (!isLocale(locale)) return null

  const routeId = getDocSlugFromSegments(pathInfo.segments)
  if (routeId === null) return null

  return { locale, routeId }
}

const getDocConfigRouteId = (path: string) => {
  const pathInfo = getPagePathInfo(path)
  if (!pathInfo || !/^content\.config\.[^.]+$/.test(pathInfo.filename)) return null

  const contentRouteId = getDocSlugFromSegments(pathInfo.segments)
  if (contentRouteId !== null) return contentRouteId

  if (docsRootSegments.length === 0) return null

  const isWithinDocsRoot = docsRootSegments.every((segment, index) => pathInfo.segments[index] === segment)
  if (!isWithinDocsRoot) return null

  return getLogicalSegments(pathInfo.segments.slice(docsRootSegments.length)).join('/')
}

const getRouteLineage = (routeId: string) => {
  const segments = routeId.split('/').filter(Boolean)
  const lineage = ['']

  for (let index = 0; index < segments.length; index += 1) {
    lineage.push(segments.slice(0, index + 1).join('/'))
  }

  return lineage
}

const docs = {} as Record<string, DocEntry>
const sharedDocConfigs = new Map<string, DocConfig>()

for (const [path, mod] of Object.entries(pageModules)) {
  const meta = getDocModuleMeta(path)
  if (!meta) continue

  docs[meta.routeId] ??= {}
  docs[meta.routeId][meta.locale] ??= {}
  const localizedDoc = docs[meta.routeId][meta.locale]
  if (localizedDoc) {
    localizedDoc.Page = mod.default
    localizedDoc.config = mod.docConfig
  }
}

for (const [path, source] of Object.entries(rawContentModules)) {
  const meta = getDocModuleMeta(path)
  if (!meta) continue

  docs[meta.routeId] ??= {}
  docs[meta.routeId][meta.locale] ??= {}
  const localizedDoc = docs[meta.routeId][meta.locale]
  if (localizedDoc) {
    const rawSource = getRawDocSource(source)
    localizedDoc.headings = extractDocHeadings(rawSource)
    localizedDoc.source = rawSource
  }
}

for (const [path, mod] of Object.entries(docConfigModules)) {
  const routeId = getDocConfigRouteId(path)
  if (routeId === null) continue

  if (sharedDocConfigs.has(routeId)) {
    throw new Error(
      `Duplicate content.config for logical route "${routeId || '/'}". Keep only one config file for that docs path.`,
    )
  }

  sharedDocConfigs.set(routeId, mod.default ?? {})
}

const getSharedDocConfig = (routeId: string) => {
  return getRouteLineage(routeId).reduce<DocConfig>((config, prefix) => {
    return {
      ...config,
      ...(sharedDocConfigs.get(prefix) ?? {}),
    }
  }, {})
}

export const getDocPage = (slug: string, locale: Locale, telefuncConfig?: TelefuncSystemConfig) => {
  const doc = docs[slug]
  if (!doc) {
    return null
  }

  const docContent = doc[locale] ?? doc[DEFAULT_LOCALE]
  if (!docContent?.Page) {
    return null
  }

  const resolvedDocsConfig = resolveTelefuncSystemConfig(telefuncConfig ?? telefuncSystemConfig)
  const config = {
    ...resolvedDocsConfig.defaultDocConfig,
    ...getSharedDocConfig(slug),
    ...(doc[DEFAULT_LOCALE]?.config ?? {}),
    ...(doc[locale]?.config ?? {}),
  }

  return {
    Page: docContent.Page,
    headings: docContent.headings ?? [],
    config,
    resolvedLocale: doc[locale] ? locale : DEFAULT_LOCALE,
  }
}

export const hasDocSlug = (slug: string) => {
  return getAllDocSlugs().includes(slug.replace(/^\/+|\/+$/g, ''))
}

export const hasDocPageForLocale = (slug: string, locale: Locale) => {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '')
  return Boolean(docs[normalizedSlug]?.[locale]?.Page)
}

const getAllDocSlugs = () => {
  return Object.keys(docs).sort((left, right) => left.localeCompare(right))
}

export const getPrerenderDocUrls = (telefuncConfig?: TelefuncSystemConfig) => {
  const resolvedDocsConfig = resolveTelefuncSystemConfig(telefuncConfig ?? telefuncSystemConfig)
  const urls = new Set<string>()
  const docSlugs = getAllDocSlugs()

  for (const locale of locales) {
    urls.add(localizePathname(getDocsIndexPath(resolvedDocsConfig), locale))

    for (const slug of docSlugs) {
      urls.add(localizePathname(getDocPath(slug, resolvedDocsConfig), locale))
    }
  }

  return [...urls]
}
