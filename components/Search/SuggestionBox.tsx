import { ArrowRightFromLine, MessageCircleQuestion } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import LayoutComponent from '@/components/LayoutComponent'
import type { Locale } from '@/lib/i18n/config'
import { localizeHref } from '@/lib/i18n/routing'
import { t } from '@/lib/messages'
import type { SearchResult } from '@/lib/search/shared'

type SuggestionBoxProps = {
  contentRef: React.RefObject<HTMLDivElement | null>
  isLoading: boolean
  isOpen: boolean
  locale: Locale
  onClose: () => void
  onQueryChange: (query: string) => void
  query: string
  results: SearchResult[]
}

const SuggestionBox = ({
  contentRef,
  isLoading,
  isOpen,
  locale,
  onClose,
  onQueryChange,
  query,
  results,
}: SuggestionBoxProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const usefulLinks = [
    { href: '/get-started', label: t(locale, 'search', 'usefulGetStarted') },
    { href: '/intro', label: t(locale, 'search', 'usefulIntroduction') },
    { href: '/', label: t(locale, 'search', 'usefulHome') },
    { href: 'https://github.com/vikejs/vike', label: t(locale, 'search', 'usefulGithub') },
  ]

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
    <div className="z-30 fixed inset-0 backdrop-blur bg-base-300/70">
      <div className="absolute h-[30vh] w-full top-0 left-0 bg-linear-to-t to-base-300 z-0" />
      <LayoutComponent ref={contentRef} $size="sm" className="pt-6">
        <input
          placeholder={t(locale, 'search', 'placeholder')}
          ref={inputRef}
          type="text"
          className="input input-primary input-xl w-full shadow-lg shadow-primary/30 dark:shadow-primary/50"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <div className="px-4 h-7 flex items-center text-xs text-vike-grey-300">
          {isLoading ? (
            <span className="flex gap-1 items-center">
              <span className="loading loading-dots loading-xs" />
              {t(locale, 'search', 'loading')}
            </span>
          ) : query.trim() ? null : (
            <span className="flex gap-1 items-center">
              <MessageCircleQuestion className="w-3 h-3 shrink-0" />
              {t(locale, 'search', 'prompt')}
            </span>
          )}
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 -translate-x-3 -translate-y-3">
            {query.trim() && !isLoading ? (
              results.length > 0 ? (
                <div className="max-h-80 overflow-y-auto p-3">
                  <ul className="flex flex-col gap-2">
                    {results.map((result) => (
                      <li key={result.href}>
                        <a
                          href={result.href}
                          className="block p-4 bg-base-300 border border-vike-grey transition-colors hover:bg-base-200 rounded-box shadow-md shadow-primary/30 hover:border-primary/60"
                          onClick={onClose}
                        >
                          <div className="flex justify-start items-center gap-2 mb-2">
                            <div className="text font-bold text-base-content">{result.title}</div>
                            {result.sectionTitle ? (
                              <div className="text-sm text-vike-grey-300 flex gap-1 items-center">
                                <ArrowRightFromLine className="w-3 h-3" /> {result.sectionTitle}
                              </div>
                            ) : null}
                          </div>
                          {result.excerpt ? (
                            <p className="text-xs leading-5 text-vike-grey-300">{result.excerpt}</p>
                          ) : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-sm text-vike-grey-300 rounded">{t(locale, 'search', 'empty')}</div>
              )
            ) : null}
          </div>
          <div className="col-span-4 p-4 bg-base-300 border border-vike-grey rounded-box h-fit">
            <h3 className="mb-3 font-semibold">{t(locale, 'search', 'usefulLinks')}</h3>
            <ul className="flex flex-col gap-2">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={localizeHref(link.href, locale)}
                    className="link link-hover text-sm text-accent"
                    onClick={onClose}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LayoutComponent>
    </div>,
    document.body,
  )
}

export default SuggestionBox
