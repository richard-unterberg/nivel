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
    <div className="z-30 fixed inset-0 bg-base-100/50 backdrop-blur-lg w-full h-full">
      <div className="absolute bg-linear-to-b dark:bg-linear-to-t from-base-100 via-base-100 via-25% to-primary-muted-superlight inset-0 z-1" />
      <LayoutComponent ref={contentRef} $size="sm" className="pt-6 z-2 relative">
        <input
          placeholder={t(locale, 'search', 'placeholder')}
          ref={inputRef}
          type="text"
          className="input input-primary input-xl w-full shadow-lg shadow-primary-muted-light"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <div className="px-4 h-7 flex items-center text-xs text-base-muted">
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
        <div className="grid grid-cols-12 ">
          <div className="col-span-8 -translate-x-3 -translate-y-3">
            {query.trim() && !isLoading ? (
              results.length > 0 ? (
                <div className="max-h-80 overflow-y-auto p-3">
                  <ul className="flex flex-col gap-2">
                    {results.map((result) => (
                      <li key={result.href}>
                        <a
                          href={result.href}
                          className="block p-4 bg-base-100 border border-primary-muted-medium transition-colors hover:bg-base-200 rounded-box shadow-md shadow-primary-muted-light hover:border-primary-muted-medium"
                          onClick={onClose}
                        >
                          <div className="flex justify-start items-center gap-2 mb-2">
                            <div className="text font-bold text-base-content">{result.title}</div>
                            {result.sectionTitle ? (
                              <div className="text-sm text-base-muted-medium flex gap-1 items-center">
                                <ArrowRightFromLine className="w-3 h-3" /> {result.sectionTitle}
                              </div>
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
              ) : (
                <div className="text-sm text-base-muted rounded">{t(locale, 'search', 'empty')}</div>
              )
            ) : null}
          </div>
          <div className="col-span-4 p-4 bg-base-100 border border-base-muted-light rounded-box h-fit">
            <h3 className="mb-3 font-semibold">{t(locale, 'search', 'usefulLinks')}</h3>
            <ul className="flex flex-col gap-2">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={localizeHref(link.href, locale)}
                    className="link link-hover text-sm text-primary"
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
