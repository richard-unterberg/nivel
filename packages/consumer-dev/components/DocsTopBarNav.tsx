import { cmMerge } from '@classmatejs/react'
import type { TopBarNavComponentProps } from '@unterberg/nivel'
import { renderInlineMarkdown } from '@unterberg/nivel'
import { DocsMegaMenu, useDocsMegaMenu } from '@unterberg/nivel/client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePageContext } from 'vike-react/usePageContext'

const minQueryLength = 2
const queryDebounceMs = 150

type SearchResult = {
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

const getDocSearchFallbackResult = (hit: unknown): Partial<SearchResult> => {
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

const useDebouncedValue = (value: string, delayMs: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [delayMs, value])

  return debouncedValue
}

const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

const withSiteBaseUrl = (value: string) => {
  if (value === '' || value.startsWith('#') || value.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(value)) {
    return value
  }

  return value.startsWith('/') ? value : `/${value.replace(/^\/+/, '')}`
}

const SearchTopBarItem = ({ buttonClassName, docs }: TopBarNavComponentProps) => {
  const { urlPathname } = usePageContext()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const previousPathnameRef = useRef(urlPathname)
  const debouncedQuery = useDebouncedValue(query, queryDebounceMs)
  const hasMounted = useHasMounted()
  const normalizedQuery = debouncedQuery.trim()
  const canSearch = Boolean(docs.algolia) && normalizedQuery.length >= minQueryLength

  useEffect(() => {
    if (previousPathnameRef.current !== urlPathname) {
      setIsOpen(false)
      previousPathnameRef.current = urlPathname
    }
  }, [urlPathname])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(query.length, query.length)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [isOpen, query.length])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node

      if (!contentRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    const algolia = docs.algolia

    if (!isOpen || !canSearch || !algolia) {
      setResults([])
      setIsLoading(false)
      setIsError(false)
      return
    }

    const abortController = new AbortController()

    setIsLoading(true)
    setIsError(false)

    fetch(buildSearchUrl(algolia.appId, algolia.indexName), {
      method: 'POST',
      signal: abortController.signal,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-algolia-api-key': algolia.apiKey,
        'x-algolia-application-id': algolia.appId,
      },
      body: JSON.stringify({
        query: normalizedQuery,
        ...algolia.searchParams,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Algolia search request failed with status ${response.status}.`)
        }

        return response.json() as Promise<SearchAlgoliaResponse>
      })
      .then((data) => {
        if (abortController.signal.aborted) {
          return
        }

        const nextResults = (data.hits ?? [])
          .map((hit): SearchResult | null => {
            const fallback = getDocSearchFallbackResult(hit)
            const href = getMappedString(hit, algolia.fields.href) ?? fallback.href
            const title = getMappedString(hit, algolia.fields.title) ?? fallback.title

            if (!href || !title) {
              return null
            }

            return {
              href,
              title,
              excerpt: getMappedString(hit, algolia.fields.excerpt) ?? fallback.excerpt,
              sectionTitle: getMappedString(hit, algolia.fields.sectionTitle) ?? fallback.sectionTitle,
            }
          })
          .filter((result): result is SearchResult => result !== null)

        setResults(nextResults)
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) {
          return
        }

        const isAbortError = error instanceof DOMException && error.name === 'AbortError'

        if (!isAbortError) {
          setResults([])
          setIsError(true)
        }
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => {
      abortController.abort()
    }
  }, [canSearch, docs.algolia, isOpen, normalizedQuery])

  if (!docs.algolia) {
    return null
  }

  return (
    <li>
      <button type="button" className={buttonClassName} onClick={() => setIsOpen(true)}>
        Search
      </button>
      {isOpen && hasMounted
        ? createPortal(
            <div className="fixed inset-0 z-30 h-full w-full bg-base-100/50 backdrop-blur-lg">
              <div className="absolute inset-0 z-1 bg-linear-to-b from-base-100 via-base-100 via-25% to-primary-muted-superlight dark:bg-linear-to-t" />
              <div
                ref={contentRef}
                className="relative z-2 mx-auto mt-5 w-full max-w-5xl rounded-box bg-base-100/70 p-6 pt-6 shadow-lg shadow-primary-muted-light"
              >
                <input
                  placeholder="Search docs"
                  ref={inputRef}
                  type="text"
                  className="input input-primary input-xl w-full"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <div className="flex h-7 items-center px-4 text-xs text-base-muted">
                  {isLoading ? (
                    <span className="flex items-center gap-1">
                      <span className="loading loading-dots loading-xs" />
                      Searching...
                    </span>
                  ) : normalizedQuery ? null : (
                    <span>Type at least {minQueryLength} characters.</span>
                  )}
                </div>
                {normalizedQuery ? (
                  isError ? (
                    <div className="rounded-box border border-warning/40 bg-base-100 p-4 text-sm text-base-muted shadow-md shadow-primary-muted-light">
                      Search is temporarily unavailable.
                    </div>
                  ) : !canSearch ? (
                    <div className="text-sm text-base-muted">Keep typing to search.</div>
                  ) : !isLoading && results.length === 0 ? (
                    <div className="text-sm text-base-muted">No results found.</div>
                  ) : (
                    <div className="-mx-2 max-h-80 overflow-y-auto p-2">
                      <ul className="flex flex-col gap-2">
                        {results.map((result) => (
                          <li key={result.href}>
                            <a
                              href={withSiteBaseUrl(result.href)}
                              className="block rounded-box border border-base-muted-medium bg-base-100 p-4 shadow-md hover:border-primary-muted hover:bg-base-200"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="mb-2 flex items-center justify-start gap-2">
                                <div className="font-bold text-base-content">{result.title}</div>
                                {result.sectionTitle ? (
                                  <div className="text-sm text-base-muted-medium">{result.sectionTitle}</div>
                                ) : null}
                              </div>
                              {result.excerpt ? (
                                <p className="text-xs leading-5 text-base-muted">{result.excerpt}</p>
                              ) : null}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </li>
  )
}

const DocsTopBarNav = (props: TopBarNavComponentProps) => {
  const { activeButtonClassName, activeSection, buttonClassName, docs, isLandingPage } = props
  const sections = docs.sidebarSections
  const hasMounted = useHasMounted()
  const { closeMegaMenu, hoveredSectionId, isMegaMenuOpen, openMegaMenu, scheduleMegaMenuClose, scheduleMegaMenuOpen } =
    useDocsMegaMenu({
      activeSectionId: activeSection?.id,
      sections,
    })

  return (
    <>
      {sections.map((section) => {
        const SectionIcon = docs.docsIconMap[`section:${section.id}`]
        const isActiveSection = activeSection?.id === section.id
        const isMegaMenuItemActive = isMegaMenuOpen && hoveredSectionId === section.id

        return (
          <li key={section.id}>
            <a
              href={withSiteBaseUrl(section.href)}
              className="block"
              onPointerEnter={() => scheduleMegaMenuOpen(section.id)}
              onPointerLeave={scheduleMegaMenuClose}
              onFocus={() => openMegaMenu(section.id)}
              onBlur={scheduleMegaMenuClose}
              onClick={closeMegaMenu}
            >
              <span className={isActiveSection ? activeButtonClassName : buttonClassName}>
                {SectionIcon ? <SectionIcon className="size-4 shrink-0" aria-hidden="true" /> : null}
                {renderInlineMarkdown(section.navTitle)}
                <span
                  className={cmMerge(
                    'size-4 shrink-0 transition-transform duration-200',
                    isMegaMenuItemActive ? 'rotate-180' : 'rotate-0',
                  )}
                  aria-hidden="true"
                >
                  v
                </span>
              </span>
            </a>
          </li>
        )
      })}
      <SearchTopBarItem {...props} />
      {hasMounted
        ? createPortal(
            <DocsMegaMenu
              activeSectionId={activeSection?.id}
              hoveredSectionId={hoveredSectionId}
              isActive={isMegaMenuOpen}
              isLandingPage={isLandingPage}
              onClose={scheduleMegaMenuClose}
              onOpen={openMegaMenu}
              sections={sections}
            />,
            document.body,
          )
        : null}
    </>
  )
}

export default DocsTopBarNav
