import { headingDefinitions } from '../headings'
import { DEFAULT_LOCALE, type Locale, resolveLocale } from '../i18n/config'
import { localizeHref } from '../i18n/routing'
import { getDocPath, type TelefuncSystemConfig } from './systemConfig'

export type DocHeading = {
  depth: number
  id: string
  title: string
}

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim()

const slugifyHeading = (value: string) => {
  const normalized = normalizeWhitespace(value)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'section'
}

export const createHeadingSlugger = () => {
  const slugCounts = new Map<string, number>()

  return (value: string) => {
    const baseSlug = slugifyHeading(value)
    const count = slugCounts.get(baseSlug) ?? 0
    slugCounts.set(baseSlug, count + 1)

    return count === 0 ? baseSlug : `${baseSlug}-${count}`
  }
}

const stripInlineMarkdown = (value: string) => {
  return normalizeWhitespace(
    value
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\\([\\`*_[\]{}()#+\-.!])/g, '$1')
      .replace(/[*_~]/g, '')
      .replace(/\{[^}]+\}/g, ' '),
  )
}

const getFenceMarker = (line: string) => {
  const match = line.match(/^\s{0,3}(`{3,}|~{3,})/)
  return match?.[1]?.[0] ?? null
}

export const extractDocHeadings = (source: string, minDepth = 2, maxDepth = 3): DocHeading[] => {
  const slugify = createHeadingSlugger()
  const headings: DocHeading[] = []
  let activeFenceMarker: string | null = null

  for (const line of source.split('\n')) {
    const fenceMarker = getFenceMarker(line)

    if (activeFenceMarker) {
      if (fenceMarker === activeFenceMarker) activeFenceMarker = null
      continue
    }

    if (fenceMarker) {
      activeFenceMarker = fenceMarker
      continue
    }

    const match = line.match(/^\s{0,3}(#{1,6})\s+(.*?)(?:\s+#+\s*)?$/)
    if (!match) continue

    const depth = match[1].length
    const title = stripInlineMarkdown(match[2] ?? '')
    if (!title) continue

    const id = slugify(title)

    if (depth < minDepth || depth > maxDepth) continue

    headings.push({
      depth,
      id,
      title,
    })
  }

  return headings
}

export const extractTextFromHast = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (!value) return ''

  if (Array.isArray(value)) {
    return value.map((item) => extractTextFromHast(item)).join('')
  }

  if (typeof value !== 'object') return ''

  const node = value as {
    children?: unknown[]
    properties?: Record<string, unknown>
    type?: string
    value?: unknown
  }

  if (node.type === 'text' && typeof node.value === 'string') {
    return node.value
  }

  if (node.type === 'element' && typeof node.properties?.alt === 'string') {
    return node.properties.alt
  }

  if (node.children) {
    return node.children.map((child) => extractTextFromHast(child)).join('')
  }

  if (typeof node.value === 'string') {
    return node.value
  }

  return ''
}

export const normalizeHeadingTitle = (value: string) => normalizeWhitespace(value)

export type HeadingDefinition = {
  docPath: string
  title: Record<Locale, string>
  navTitle?: Record<Locale, string>
  excerpt?: Record<Locale, string>
}

export type HeadingConfig = Record<string, HeadingDefinition>

export type HeadingKey = keyof typeof headingDefinitions

const normalizeDocPath = (value: string) => value.replace(/^\/+|\/+$/g, '')

const getHeadingDefinition = (headingKey: HeadingKey) => {
  return headingDefinitions[headingKey] as HeadingDefinition
}

const getHeadingByDocPath = (docPath: string) => {
  const normalizedDocPath = normalizeDocPath(docPath)

  return Object.values(headingDefinitions).find((heading) => normalizeDocPath(heading.docPath) === normalizedDocPath) as
    | HeadingDefinition
    | undefined
}

const getHeadingNavTitle = (headingKey: HeadingKey, locale: Locale | string | undefined = DEFAULT_LOCALE) => {
  const resolvedLocale = resolveLocale(locale)
  const heading = getHeadingDefinition(headingKey)

  return heading.navTitle?.[resolvedLocale] ?? heading.title[resolvedLocale]
}

const getHeadingLink = (headingKey: HeadingKey, telefuncConfig?: TelefuncSystemConfig) => {
  return getDocPath(getHeadingDefinition(headingKey).docPath, telefuncConfig)
}

export const getHeadingData = (
  headingKey: HeadingKey,
  locale: Locale | string | undefined = DEFAULT_LOCALE,
  telefuncConfig?: TelefuncSystemConfig,
) => {
  return {
    title: getHeadingNavTitle(headingKey, locale),
    href: localizeHref(getHeadingLink(headingKey, telefuncConfig), locale),
  }
}

export const getDocHeadingMetadata = (docPath: string, locale: Locale | string | undefined = DEFAULT_LOCALE) => {
  const heading = getHeadingByDocPath(docPath)

  if (!heading) {
    return null
  }

  const resolvedLocale = resolveLocale(locale)

  return {
    title: heading.title[resolvedLocale],
    description: heading.excerpt?.[resolvedLocale] ?? null,
  }
}
