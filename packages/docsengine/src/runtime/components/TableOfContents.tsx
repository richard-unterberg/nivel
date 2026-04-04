import cm, { cmMerge } from '@classmatejs/react'
import { TableOfContentsIcon } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { useData } from 'vike-react/useData'
import type { DocHeading, DocPageData, ResolvedDocsPartnersConfig } from '../../types.js'
import { createHeadingSlugger, normalizeHeadingTitle } from '../docHeadings.js'

const getCurrentHash = () => {
  try {
    return decodeURIComponent(window.location.hash)
  } catch {
    return window.location.hash
  }
}

const getHeadingElements = () => {
  const root = document.querySelector('[data-doc-content]')
  if (!(root instanceof HTMLElement)) {
    return []
  }

  return Array.from(root.querySelectorAll('h2, h3, h4')).filter(
    (element): element is HTMLHeadingElement => element instanceof HTMLHeadingElement,
  )
}

const areHeadingsEqual = (left: DocHeading[], right: DocHeading[]) => {
  if (left.length !== right.length) {
    return false
  }

  return left.every((heading, index) => {
    const other = right[index]
    return (
      other !== undefined && heading.depth === other.depth && heading.id === other.id && heading.title === other.title
    )
  })
}

const syncHeadingsFromDom = (setDomHeadings: Dispatch<SetStateAction<DocHeading[]>>) => {
  const root = document.querySelector('[data-doc-content]')
  if (!(root instanceof HTMLElement)) {
    return
  }

  const slugify = createHeadingSlugger()
  const nextHeadings = Array.from(root.querySelectorAll('h2, h3, h4'))
    .map((element) => {
      const title = normalizeHeadingTitle(element.textContent ?? '')
      if (!title) {
        return null
      }

      element.classList.add('scroll-mt-24')

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

  setDomHeadings((currentHeadings) => {
    if (areHeadingsEqual(currentHeadings, nextHeadings)) {
      return currentHeadings
    }

    return nextHeadings
  })
}

const updateActiveHeadingFromScroll = (setActiveHeadingId: (value: string) => void) => {
  const headingElements = getHeadingElements()
  if (headingElements.length === 0) {
    return
  }

  const activationOffset = 144
  let nextActiveHeadingId = headingElements[0]?.id ?? ''

  for (const heading of headingElements) {
    if (!heading.id) {
      continue
    }

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

interface TableOfContentsProps {
  headings: DocHeading[]
  partners: ResolvedDocsPartnersConfig
}

export const TableOfContents = ({ headings, partners }: TableOfContentsProps) => {
  const [activeHeadingId, setActiveHeadingId] = useState('')
  const [domHeadings, setDomHeadings] = useState<DocHeading[]>(headings)
  const effectiveHeadings = domHeadings.length > 0 ? domHeadings : headings
  const { page } = useData() as DocPageData

  useEffect(() => {
    let scrollFrame = 0

    const syncActiveHeading = () => {
      if (scrollFrame) {
        return
      }

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
      if (scrollFrame) {
        window.cancelAnimationFrame(scrollFrame)
      }

      window.removeEventListener('hashchange', updateHash)
      window.removeEventListener('scroll', syncActiveHeading)
      window.removeEventListener('resize', syncActiveHeading)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    setDomHeadings((currentHeadings) => {
      if (areHeadingsEqual(currentHeadings, headings)) {
        return currentHeadings
      }

      return headings
    })
    setActiveHeadingId('')

    queueMicrotask(() => {
      syncHeadingsFromDom(setDomHeadings)
      updateActiveHeadingFromScroll(setActiveHeadingId)
    })
  }, [headings])

  return (
    <aside className={cmMerge(page.tableOfContents ? 'w-64' : 'w-32', 'hidden shrink-0 xl:block')}>
      <div className="sticky top-16">
        <div className="relative h-[calc(100svh-16*var(--spacing))] overflow-y-auto overflow-x-hidden pt-10 pb-8">
          {page.tableOfContents
            ? effectiveHeadings.length > 0 && (
                <>
                  <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-base-muted">
                    <TableOfContentsIcon className="h-3 w-3" />
                    On this page
                  </p>
                  <nav aria-label="On this page" className="mb-16">
                    <ul>
                      {effectiveHeadings.map((heading, index) => (
                        <li key={heading.id}>
                          <a
                            href={`#${heading.id}`}
                            aria-current={activeHeadingId === heading.id ? 'location' : undefined}
                            onClick={() => setActiveHeadingId(heading.id)}
                            className={cmMerge(
                              'block border-l border-base-muted-light py-1.5 text-sm text-base-muted hover:border-primary-muted hover:text-base-content',
                              heading.depth > 2 ? 'pl-6' : 'pl-4',
                              activeHeadingId
                                ? activeHeadingId === heading.id
                                  ? 'border-l-2 border-primary font-semibold text-base-content'
                                  : ''
                                : index === 0
                                  ? 'border-l-2 border-primary font-semibold text-base-content'
                                  : '',
                            )}
                          >
                            {heading.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </>
              )
            : null}
          <Adbar partners={partners} />
        </div>
      </div>
    </aside>
  )
}

const Adbar = ({ partners }: { partners: ResolvedDocsPartnersConfig }) => {
  if (partners.primary.length === 0 && partners.gold.length === 0) {
    return null
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-3 opacity-90">
      {partners.primary.map((partner) => (
        <AdbarItem key={partner.name} className="col-span-full">
          <AdbarLink href={partner.href} title={partner.name}>
            <PartnerLogo partner={partner} />
          </AdbarLink>
        </AdbarItem>
      ))}
      {partners.gold.map((partner) => (
        <AdbarItem key={partner.name}>
          <AdbarLink href={partner.href} title={partner.name}>
            <PartnerLogo partner={partner} />
          </AdbarLink>
        </AdbarItem>
      ))}
    </ul>
  )
}

const PartnerLogo = ({
  partner,
}: {
  partner: ResolvedDocsPartnersConfig['primary'][number] | ResolvedDocsPartnersConfig['gold'][number]
}) => {
  return (
    <>
      <Image
        src={partner.logoLight}
        width={200}
        height={100}
        alt={partner.logoAlt}
        className={cmMerge('block', partner.logoDark ? 'dark:hidden' : 'dark:invert')}
      />
      {partner.logoDark ? (
        <Image src={partner.logoDark} width={200} height={100} alt={partner.logoAlt} className="hidden dark:block" />
      ) : null}
    </>
  )
}

const AdbarItem = cm.div`
  px-5
  py-5
  bg-base-200
  text-center
  flex
  items-center
  justify-center
  rounded-box
`

const AdbarLink = cm.a`
  block
  w-full
  transition-opacity
  hover:opacity-100
  focus-visible:opacity-100
`

const Image = cm.img`
  mx-auto
  w-24
`
