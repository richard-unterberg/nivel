import type { ResolvedDocsAlgoliaConfig } from '../../docs/types.js'

type DocsSearchResult = {
  href: string
  title: string
  excerpt?: string
  sectionTitle?: string
}

type SearchAlgoliaResponse = {
  hits?: unknown[]
}

type AlgoliaDocSearchHit = {
  url?: unknown
  url_without_anchor?: unknown
  type?: unknown
  category?: unknown
  content?: unknown
  hierarchy?: Record<string, unknown> | null
  _highlightResult?: {
    content?: {
      value?: unknown
    }
  } | null
  _snippetResult?: {
    content?: {
      value?: unknown
    }
  } | null
}

const hierarchyLevels = ['lvl0', 'lvl1', 'lvl2', 'lvl3', 'lvl4', 'lvl5', 'lvl6'] as const

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, '')

const normalizeString = (value: unknown) => {
  if (typeof value === 'string') {
    const normalized = stripHtml(value).replace(/\s+/g, ' ').trim()
    return normalized || undefined
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return undefined
}

const getValueAtPath = (value: unknown, path: string): unknown => {
  if (!path) {
    return undefined
  }

  const segments = path.split('.').filter(Boolean)
  let currentValue = value

  for (const segment of segments) {
    if (!currentValue || typeof currentValue !== 'object' || Array.isArray(currentValue)) {
      return undefined
    }

    currentValue = (currentValue as Record<string, unknown>)[segment]
  }

  return currentValue
}

const getMappedString = (value: unknown, path: string): string | undefined => {
  return normalizeString(getValueAtPath(value, path))
}

const buildSearchUrl = (appId: string, indexName: string) => {
  return `https://${appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(indexName)}/query`
}

const getDocSearchHierarchyValue = (
  hierarchy: AlgoliaDocSearchHit['hierarchy'],
  level: (typeof hierarchyLevels)[number],
) => {
  if (!hierarchy || typeof hierarchy !== 'object') {
    return undefined
  }

  return normalizeString(hierarchy[level])
}

const getDocSearchTitleLevel = (hit: AlgoliaDocSearchHit) => {
  const levelFromType =
    typeof hit.type === 'string' && /^lvl[0-6]$/.test(hit.type) ? (hit.type as (typeof hierarchyLevels)[number]) : null

  if (levelFromType && getDocSearchHierarchyValue(hit.hierarchy, levelFromType)) {
    return levelFromType
  }

  return [...hierarchyLevels]
    .reverse()
    .find((level) => level !== 'lvl0' && getDocSearchHierarchyValue(hit.hierarchy, level))
}

const getDocSearchFallbackResult = (hit: unknown): Partial<DocsSearchResult> => {
  const docSearchHit = hit as AlgoliaDocSearchHit
  const titleLevel = getDocSearchTitleLevel(docSearchHit)
  const title = titleLevel ? getDocSearchHierarchyValue(docSearchHit.hierarchy, titleLevel) : undefined
  const titleLevelIndex = titleLevel ? hierarchyLevels.indexOf(titleLevel) : -1
  const sectionTitle =
    hierarchyLevels
      .slice(0, Math.max(titleLevelIndex, 0))
      .reverse()
      .map((level) => getDocSearchHierarchyValue(docSearchHit.hierarchy, level))
      .find(Boolean) ?? normalizeString(docSearchHit.category)

  return {
    href: normalizeString(docSearchHit.url) ?? normalizeString(docSearchHit.url_without_anchor),
    title: title ?? normalizeString(docSearchHit.category),
    excerpt:
      normalizeString(docSearchHit._snippetResult?.content?.value) ??
      normalizeString(docSearchHit.content) ??
      normalizeString(docSearchHit._highlightResult?.content?.value),
    sectionTitle,
  }
}

const mapHitToSearchResult = (hit: unknown, config: ResolvedDocsAlgoliaConfig): DocsSearchResult | null => {
  const docSearchFallback = getDocSearchFallbackResult(hit)
  const href = getMappedString(hit, config.fields.href) ?? docSearchFallback.href
  const title = getMappedString(hit, config.fields.title) ?? docSearchFallback.title

  if (!href || !title) {
    return null
  }

  const excerpt = getMappedString(hit, config.fields.excerpt) ?? docSearchFallback.excerpt
  const sectionTitle = getMappedString(hit, config.fields.sectionTitle) ?? docSearchFallback.sectionTitle

  return {
    href,
    title,
    excerpt,
    sectionTitle,
  }
}

export const searchAlgoliaIndex = async (options: {
  config: ResolvedDocsAlgoliaConfig
  query: string
  signal?: AbortSignal
}) => {
  const { config, query, signal } = options
  const response = await fetch(buildSearchUrl(config.appId, config.indexName), {
    method: 'POST',
    signal,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-algolia-api-key': config.apiKey,
      'x-algolia-application-id': config.appId,
    },
    body: JSON.stringify({
      query,
      ...config.searchParams,
    }),
  })

  if (!response.ok) {
    throw new Error(`Algolia search request failed with status ${response.status}.`)
  }

  const data = (await response.json()) as SearchAlgoliaResponse

  return (data.hits ?? [])
    .map((hit) => mapHitToSearchResult(hit, config))
    .filter((result): result is DocsSearchResult => result !== null)
}
