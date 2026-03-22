import type { ComponentType } from 'react'
import { type DocHeading, extractDocHeadings } from '@/lib/docs/headings'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config'

export type DocConfig = {
  tableOfContents?: boolean
}

type MdxModule = {
  default: ComponentType
  docConfig?: DocConfig
}

type DocContentModule = {
  Page?: ComponentType
  headings?: DocHeading[]
  config?: DocConfig
}

type DocEntry = Partial<Record<Locale, DocContentModule>>

const pageModules = import.meta.glob<MdxModule>('../../pages/**/content.*.mdx', {
  eager: true,
})

type RawContentModule = string | { default?: string }

const rawContentModules = import.meta.glob<RawContentModule>('../../pages/**/content.*.mdx', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const getRawDocSource = (module: RawContentModule) => {
  if (typeof module === 'string') return module
  if (typeof module?.default === 'string') return module.default
  return ''
}

const getDocModuleMeta = (path: string) => {
  const match = path.match(/\/pages\/(.+)\/content\.([^.]+)\.mdx$/)
  if (!match) return null

  const [, rawRouteId, locale] = match
  if (!isLocale(locale)) return null

  const routeId = rawRouteId
    .split('/')
    .filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')))
    .join('/')

  if (!routeId) return null

  return { locale, routeId }
}

const docs = {} as Record<string, DocEntry>

for (const [path, mod] of Object.entries(pageModules)) {
  const meta = getDocModuleMeta(path)
  if (!meta) continue

  docs[meta.routeId] ??= {}
  const localizedDoc = (docs[meta.routeId][meta.locale] ??= {})
  localizedDoc.Page = mod.default
  localizedDoc.config = mod.docConfig
}

for (const [path, source] of Object.entries(rawContentModules)) {
  const meta = getDocModuleMeta(path)
  if (!meta) continue

  docs[meta.routeId] ??= {}
  const localizedDoc = (docs[meta.routeId][meta.locale] ??= {})
  const rawSource = getRawDocSource(source)
  localizedDoc.headings = extractDocHeadings(rawSource)
}

export const getDocPage = (slug: string, locale: Locale) => {
  const doc = docs[slug]
  if (!doc) {
    return null
  }

  const docContent = doc[locale] ?? doc[DEFAULT_LOCALE]
  if (!docContent?.Page) {
    return null
  }

  const config = {
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
