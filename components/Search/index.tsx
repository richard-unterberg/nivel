import { cmMerge } from '@classmatejs/react'
import { Search as SearchIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { t } from '@/lib/messages'
import { loadSearchIndex, searchDocs } from '@/lib/search'
import type { SearchIndexEntry } from '@/lib/search/shared'
import SuggestionBox from './SuggestionBox'

interface SearchProps {
  inputSize?: 'sm' | 'md'
}

const Search = ({ inputSize }: SearchProps) => {
  const { locale } = usePageContext()
  const [indexEntries, setIndexEntries] = useState<SearchIndexEntry[] | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchHovered, setIsSearchHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const suggestionBoxRef = useRef<HTMLDivElement | null>(null)
  const indexLocaleRef = useRef(locale)

  useEffect(() => {
    const localeChanged = indexLocaleRef.current !== locale
    indexLocaleRef.current = locale

    setIndexEntries(null)
    setIsLoading(false)

    if (!localeChanged) {
      setIsOpen(false)
      setQuery('')
    }
  }, [locale])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node

      if (!containerRef.current?.contains(target) && !suggestionBoxRef.current?.contains(target)) {
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
  }, [])

  const ensureIndexLoaded = useCallback(async () => {
    if (indexEntries || isLoading) return

    setIsLoading(true)

    try {
      const nextEntries = await loadSearchIndex(locale)
      setIndexEntries(nextEntries)
    } catch {
      setIndexEntries([])
    } finally {
      setIsLoading(false)
    }
  }, [indexEntries, isLoading, locale])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    void ensureIndexLoaded()
  }, [ensureIndexLoaded, isOpen])

  const handleClick = useCallback(() => {
    setIsOpen(true)
    void ensureIndexLoaded()
  }, [ensureIndexLoaded])

  const handleQueryChange = useCallback(
    (nextQuery: string) => {
      setQuery(nextQuery)
      setIsOpen(true)
      void ensureIndexLoaded()
    },
    [ensureIndexLoaded],
  )

  const results = indexEntries ? searchDocs(indexEntries, query) : []

  return (
    <div ref={containerRef} className={cmMerge('relative text-right')}>
      <button
        type="button"
        className="absolute z-2 inset-0 cursor-pointer "
        onMouseEnter={() => setIsSearchHovered(true)}
        onMouseLeave={() => setIsSearchHovered(false)}
        onClick={handleClick}
      />
      <label
        className={cmMerge(
          'input pounter-events-none ',
          inputSize === 'md' ? 'input-md w-80' : 'input-sm w-45 ',
          isSearchHovered ? 'border-primary/70 shadow-lg shadow-primary/30' : 'shadow-transparent',
        )}
      >
        <span className="label">
          <SearchIcon className="w-4 h-4 shrink-0" />
        </span>
        <input
          type="text"
          placeholder={t(locale, 'search', 'placeholder')}
          className={cmMerge(
            'w-full placeholder:text-base-medium transition-colors',
            isSearchHovered && 'placeholder:text-base-dark',
          )}
          value={query}
          onFocus={() => {
            setIsOpen(true)
            void ensureIndexLoaded()
          }}
          onChange={(event) => handleQueryChange(event.target.value)}
        />
      </label>
      <SuggestionBox
        contentRef={suggestionBoxRef}
        isLoading={isLoading}
        isOpen={isOpen}
        locale={locale}
        onClose={() => setIsOpen(false)}
        onQueryChange={handleQueryChange}
        query={query}
        results={results}
      />
    </div>
  )
}

export default Search
