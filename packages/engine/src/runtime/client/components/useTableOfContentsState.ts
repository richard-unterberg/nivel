import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { createHeadingSlugger, normalizeHeadingTitle } from '../../../docs/docHeadings.js'
import type { DocHeading } from '../../../docs/types.js'

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

      element.classList.add('scroll-mt-32')
      element.classList.add('xl:scroll-mt-22')

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
  let nextActiveHeadingId = ''

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

interface UseTableOfContentsStateProps {
  headings?: DocHeading[]
}

interface UseTableOfContentsStateResult {
  activeHeadingId: string
  effectiveHeadings: DocHeading[]
  setActiveHeadingId: Dispatch<SetStateAction<string>>
}

export const useTableOfContentsState = ({
  headings: routeHeadings = [],
}: UseTableOfContentsStateProps): UseTableOfContentsStateResult => {
  const [activeHeadingId, setActiveHeadingId] = useState('')
  const [domHeadings, setDomHeadings] = useState<DocHeading[]>(routeHeadings)
  const effectiveHeadings = domHeadings.length > 0 ? domHeadings : routeHeadings

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
      if (areHeadingsEqual(currentHeadings, routeHeadings)) {
        return currentHeadings
      }

      return routeHeadings
    })
    setActiveHeadingId('')

    queueMicrotask(() => {
      syncHeadingsFromDom(setDomHeadings)
      updateActiveHeadingFromScroll(setActiveHeadingId)
    })
  }, [routeHeadings])

  return {
    activeHeadingId,
    effectiveHeadings,
    setActiveHeadingId,
  }
}
