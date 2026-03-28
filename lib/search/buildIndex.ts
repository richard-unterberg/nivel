import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import telefunc from '../../pages/+telefunc'
import { extractDocHeadings } from '../docs/headings'
import { getDocPath, resolveTelefuncSystemConfig } from '../docs/systemConfig'
import { DEFAULT_LOCALE, isLocale, type Locale, locales } from '../i18n/config'
import { localizeHref } from '../i18n/routing'
import type { SearchIndexEntry } from './shared'
import { extractDocTitle, extractSearchTextFromMdx, limitSearchText } from './sourceText'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pagesRoot = path.resolve(__dirname, '../../pages')

type DocsSourceMap = Record<string, Partial<Record<Locale, string>>>

const getLogicalSegments = (segments: string[]) => {
  return segments.filter((segment) => segment !== '' && !(segment.startsWith('(') && segment.endsWith(')')))
}

const getDocSlugFromDir = (dirPath: string) => {
  const relativeDir = path.relative(pagesRoot, dirPath)
  if (!relativeDir || relativeDir.startsWith('..')) return null

  const segments = relativeDir.split(path.sep).filter(Boolean)
  const contentIndex = segments.indexOf('(content)')
  if (contentIndex < 0) return null

  return getLogicalSegments(segments.slice(contentIndex + 1)).join('/')
}

const walkDir = (dirPath: string): string[] => {
  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const nextPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      return walkDir(nextPath)
    }

    return [nextPath]
  })
}

const getDocsSourceMap = (): DocsSourceMap => {
  const docs: DocsSourceMap = {}

  for (const filePath of walkDir(pagesRoot)) {
    const localeMatch = path.basename(filePath).match(/^content\.([^.]+)\.mdx$/)
    if (!localeMatch) continue

    const [, locale] = localeMatch
    if (!isLocale(locale)) continue

    const slug = getDocSlugFromDir(path.dirname(filePath))
    if (slug === null) continue

    docs[slug] ??= {}
    docs[slug][locale] = fs.readFileSync(filePath, 'utf8')
  }

  return docs
}

export const buildSearchIndexes = (): Record<Locale, SearchIndexEntry[]> => {
  const docs = getDocsSourceMap()
  const resolvedConfig = resolveTelefuncSystemConfig(telefunc)
  const slugs = Object.keys(docs).sort((left, right) => left.localeCompare(right))

  return Object.fromEntries(
    locales.map((locale) => {
      const entries = slugs.flatMap<SearchIndexEntry>((slug) => {
        const source = docs[slug]?.[locale] ?? docs[slug]?.[DEFAULT_LOCALE]
        if (!source) {
          return []
        }

        const resolvedLocale = docs[slug]?.[locale] ? locale : DEFAULT_LOCALE

        return [
          {
            headings: extractDocHeadings(source),
            href: localizeHref(getDocPath(slug, resolvedConfig), locale),
            locale,
            resolvedLocale,
            slug,
            text: limitSearchText(
              extractSearchTextFromMdx(source),
              resolvedConfig.search.indexedWordsPerDoc,
              resolvedLocale,
            ),
            title: extractDocTitle(source, slug),
          },
        ]
      })

      return [locale, entries]
    }),
  ) as Record<Locale, SearchIndexEntry[]>
}
