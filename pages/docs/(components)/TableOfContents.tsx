import cm from '@classmatejs/react'
import { ListTree } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { createHeadingSlugger, type DocHeading, normalizeHeadingTitle } from '@/lib/docs/headings'
import { t } from '@/lib/i18n/messages'

const TocLink = cm.a<{ $isActive?: boolean; $isNested?: boolean }>`
  block
  border-l
  border-base-300
  py-1.5
  text-sm
  text-base-content/65
  transition-colors
  hover:border-primary/40
  hover:text-base-content
  ${(props) => (props.$isNested ? 'pl-6' : 'pl-4')}
  ${(props) => (props.$isActive ? 'border-primary text-base-content font-semibold' : '')}
`

const getCurrentHash = () => {
  try {
    return decodeURIComponent(window.location.hash)
  } catch {
    return window.location.hash
  }
}

const getHeadingElements = () => {
  const root = document.querySelector('[data-doc-content]')
  if (!(root instanceof HTMLElement)) return []

  return Array.from(root.querySelectorAll('h2, h3, h4')).filter(
    (element): element is HTMLHeadingElement => element instanceof HTMLHeadingElement,
  )
}

const syncHeadingsFromDom = (setDomHeadings: (headings: DocHeading[]) => void) => {
  const root = document.querySelector('[data-doc-content]')
  if (!(root instanceof HTMLElement)) {
    return
  }

  const slugify = createHeadingSlugger()
  const nextHeadings = Array.from(root.querySelectorAll('h2, h3, h4'))
    .map((element) => {
      const title = normalizeHeadingTitle(element.textContent ?? '')
      if (!title) return null

      const id = element.id || slugify(title)
      if (!element.id) {
        element.id = id
      }

      return {
        depth: Number(element.tagName.slice(1)),
        id,
        title,
      } satisfies DocHeading
    })
    .filter((heading): heading is DocHeading => heading !== null)

  setDomHeadings(nextHeadings)
}

const updateActiveHeadingFromScroll = (setActiveHeadingId: (value: string) => void) => {
  const headingElements = getHeadingElements()
  if (headingElements.length === 0) return

  const activationOffset = 144
  let nextActiveHeadingId = headingElements[0]?.id ?? ''

  for (const heading of headingElements) {
    if (!heading.id) continue
    if (heading.getBoundingClientRect().top <= activationOffset) {
      nextActiveHeadingId = heading.id
      continue
    }
    break
  }

  const lastHeading = headingElements.at(-1)
  if (lastHeading?.id && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
    nextActiveHeadingId = lastHeading.id
  }

  setActiveHeadingId(nextActiveHeadingId)
}

const TableOfContents = ({ headings } : { headings: DocHeading[] }) => {
  const { locale } = usePageContext()
  const [activeHeadingId, setActiveHeadingId] = useState('')
  const [domHeadings, setDomHeadings] = useState<DocHeading[]>(headings)
  const usesHeadings = domHeadings.length > 0 ? domHeadings : headings
  const hasHeadings = usesHeadings.length > 0

  useEffect(() => {
    let scrollFrame = 0
    const syncActiveHeading = () => {
      if (scrollFrame) return

      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0
        updateActiveHeadingFromScroll(setActiveHeadingId)
      })
    }

    const updateHash = () => {
      const currentHash = getCurrentHash().replace(/^#/, '')
      if (currentHash !== '') {
        setActiveHeadingId(currentHash)
        return
      }

      syncActiveHeading()
    }

    updateHash()
    queueMicrotask(() => {
      syncHeadingsFromDom(setDomHeadings)
      syncActiveHeading()
    })

    window.addEventListener('hashchange', updateHash)
    window.addEventListener('scroll', syncActiveHeading, { passive: true })
    window.addEventListener('resize', syncActiveHeading)
    return () => {
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
      window.removeEventListener('hashchange', updateHash)
      window.removeEventListener('scroll', syncActiveHeading)
      window.removeEventListener('resize', syncActiveHeading)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    setDomHeadings(headings)
    setActiveHeadingId('')

    queueMicrotask(() => {
      syncHeadingsFromDom(setDomHeadings)
      updateActiveHeadingFromScroll(setActiveHeadingId)
    })
  }, [headings])

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      {hasHeadings && (
        <div className="sticky top-16 pt-10 max-h-[calc(100svh-7rem)] overflow-y-auto pb-8">
          <p className="mb-4 text-xs font-semibold tracking-widest text-vike-grey-300 uppercase flex gap-2 items-center">
            <ListTree className="w-3 h-3" />
            {t(locale, 'docs', 'onThisPage')}
          </p>
          <nav aria-label={t(locale, 'docs', 'onThisPage')}>
            <ul>
              {usesHeadings.map((heading, index) => (
                <li key={heading.id}>
                  <TocLink
                    href={`#${heading.id}`}
                    $isNested={heading.depth > 2}
                    $isActive={activeHeadingId ? activeHeadingId === heading.id : index === 0}
                    aria-current={activeHeadingId === heading.id ? 'location' : undefined}
                    onClick={() => setActiveHeadingId(heading.id)}
                  >
                    {heading.title}
                  </TocLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </aside>
  )
}

export default TableOfContents
