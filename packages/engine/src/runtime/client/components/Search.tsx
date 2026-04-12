import { cmMerge } from '@classmatejs/react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRightFromLine, MessageCircleQuestion, Search as SearchIcon, TriangleAlert } from 'lucide-react'
import type { RefObject } from 'react'
import { memo, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePageContext } from 'vike-react/usePageContext'
import { withSiteBaseUrl } from '../../../shared/assets.js'
import { useDocsGlobalContext } from '../docsGlobalContext.js'
import { searchAlgoliaIndex } from '../search.js'
import { useDocsSearchActions, useDocsSearchStore } from '../store/runtime-store.js'
import { LayoutComponent } from './LayoutComponent.js'

const MIN_QUERY_LENGTH = 2
const QUERY_DEBOUNCE_MS = 150

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

export const SearchTrigger = memo(() => {
  const docs = useDocsGlobalContext()
  const { open, setQuery } = useDocsSearchActions()
  const query = useDocsSearchStore((state) => state.query)
  const [isSearchHovered, setIsSearchHovered] = useState(false)

  if (!docs.algolia) {
    return null
  }

  return (
    <>
      <div className="hidden md:block">
        <label
          className={cmMerge(
            'input input-sm w-56 transition-all',
            isSearchHovered ? 'border-primary-muted shadow-lg shadow-primary-muted-light' : 'shadow-transparent',
          )}
          onMouseEnter={() => setIsSearchHovered(true)}
          onMouseLeave={() => setIsSearchHovered(false)}
        >
          <span className="label">
            <SearchIcon className="h-4 w-4 shrink-0" />
          </span>
          <input
            type="text"
            value={query}
            placeholder="Search docs"
            className={cmMerge(
              'w-full placeholder:text-base-muted-medium transition-colors',
              isSearchHovered && 'placeholder:text-base-muted',
            )}
            onFocus={open}
            onChange={(event) => {
              setQuery(event.target.value)
              open()
            }}
          />
        </label>
      </div>
      <button type="button" className="btn btn-ghost btn-square md:hidden" aria-label="Search docs" onClick={open}>
        <SearchIcon className="h-4 w-4" />
      </button>
    </>
  )
})

export const Search = memo(() => {
  const docs = useDocsGlobalContext()
  const { urlPathname } = usePageContext()
  const { close, setQuery } = useDocsSearchActions()
  const isOpen = useDocsSearchStore((state) => state.isOpen)
  const query = useDocsSearchStore((state) => state.query)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const suggestionBoxRef = useRef<HTMLDivElement | null>(null)
  const previousPathnameRef = useRef(urlPathname)
  const debouncedQuery = useDebouncedValue(query, QUERY_DEBOUNCE_MS)
  const normalizedQuery = debouncedQuery.trim()
  const canSearch = Boolean(docs.algolia) && normalizedQuery.length >= MIN_QUERY_LENGTH

  const searchQuery = useQuery({
    queryKey: ['nivel-algolia-search', docs.algolia?.appId, docs.algolia?.indexName, normalizedQuery],
    queryFn: ({ signal }) => searchAlgoliaIndex({ config: docs.algolia, query: normalizedQuery, signal }),
    enabled: isOpen && canSearch,
    retry: false,
  })

  useEffect(() => {
    if (previousPathnameRef.current !== urlPathname) {
      close()
      previousPathnameRef.current = urlPathname
    }
  }, [close, urlPathname])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node

      if (!containerRef.current?.contains(target) && !suggestionBoxRef.current?.contains(target)) {
        close()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close, isOpen])

  if (!docs.algolia) {
    return null
  }

  return (
    <div ref={containerRef} className="relative">
      <SearchSuggestionBox
        contentRef={suggestionBoxRef}
        isError={searchQuery.isError}
        isLoading={searchQuery.isFetching}
        isOpen={isOpen}
        onClose={close}
        onQueryChange={setQuery}
        query={query}
        results={searchQuery.data ?? []}
      />
    </div>
  )
})

type SearchSuggestionBoxProps = {
  contentRef: RefObject<HTMLDivElement | null>
  isError: boolean
  isLoading: boolean
  isOpen: boolean
  onClose: () => void
  onQueryChange: (query: string) => void
  query: string
  results: Awaited<ReturnType<typeof searchAlgoliaIndex>>
}

const SearchSuggestionBox = ({
  contentRef,
  isError,
  isLoading,
  isOpen,
  onClose,
  onQueryChange,
  query,
  results,
}: SearchSuggestionBoxProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const normalizedQuery = query.trim()
  const canSearch = normalizedQuery.length >= MIN_QUERY_LENGTH

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

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-30 h-full w-full bg-base-100/50 backdrop-blur-lg">
      <div className="absolute inset-0 z-1 bg-linear-to-b from-base-100 via-base-100 via-25% to-primary-muted-superlight dark:bg-linear-to-t" />
      <LayoutComponent
        ref={contentRef}
        $size="sm"
        className="mt-5 relative z-2 rounded-box bg-base-100/70 p-6 pt-6 shadow-lg shadow-primary-muted-light"
      >
        <input
          placeholder="Search docs"
          ref={inputRef}
          type="text"
          className="input input-primary input-xl w-full"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <div className="flex h-7 items-center px-4 text-xs text-base-muted">
          {isLoading ? (
            <span className="flex items-center gap-1">
              <span className="loading loading-dots loading-xs" />
              Searching...
            </span>
          ) : normalizedQuery ? null : (
            <span className="flex items-center gap-1">
              <MessageCircleQuestion className="h-3 w-3 shrink-0" />
              Type at least {MIN_QUERY_LENGTH} characters.
            </span>
          )}
        </div>
        {normalizedQuery ? (
          isError ? (
            <div className="flex items-center gap-2 rounded-box border border-warning/40 bg-base-100 p-4 text-sm text-base-muted shadow-md shadow-primary-muted-light">
              <TriangleAlert className="h-4 w-4 shrink-0 text-warning" />
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
                      onClick={onClose}
                    >
                      <div className="mb-2 flex items-center justify-start gap-2">
                        <div className="font-bold text-base-content">{result.title}</div>
                        {result.sectionTitle ? (
                          <div className="flex items-center gap-1 text-sm text-base-muted-medium">
                            <ArrowRightFromLine className="h-3 w-3" /> {result.sectionTitle}
                          </div>
                        ) : null}
                      </div>
                      {result.excerpt ? <p className="text-xs leading-5 text-base-muted">{result.excerpt}</p> : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )
        ) : null}
      </LayoutComponent>
    </div>,
    document.body,
  )
}
