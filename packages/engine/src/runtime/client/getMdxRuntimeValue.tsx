import type {
  UniversalMdxRuntimeValue,
  UniversalResolvedDocLink,
  UniversalResolvedOverviewItem,
} from '../../mdx/components/types.js'
import { withSiteBaseUrl } from '../../shared/assets.js'
import type { DocsGlobalContextData } from '../../docs/types.js'
import {
  getActiveSectionByPathname,
  getResolvedPageByPathname,
  getResolvedSectionById,
  isSamePagePathname,
} from '../../docs/resolveDocsConfig.js'
import { docsCodeBlockChoiceStore } from './store/settings-store.js'

const isExternalHref = (href: string) => {
  return /^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
}

const splitHref = (href: string) => {
  const [pathname, hash = ''] = href.split('#')
  return {
    pathname,
    hash: hash ? `#${hash}` : '',
  }
}

const toDocsPathname = (basePath: '/docs', href: string) => {
  if (!href.startsWith('/')) {
    return null
  }

  if (href === basePath || href.startsWith(`${basePath}/`)) {
    return href
  }

  const normalizedPath = href.replace(/^\/+/, '')
  if (!normalizedPath) {
    return null
  }

  return `${basePath}/${normalizedPath}`
}

const resolveDocLink = (options: {
  docs: DocsGlobalContextData
  currentPathname: string
  href: string
}): UniversalResolvedDocLink | null => {
  const { currentPathname, href } = options
  if (href.startsWith('#') || isExternalHref(href)) {
    return null
  }

  const { pathname, hash } = splitHref(href)
  const docsPathname = toDocsPathname(options.docs.basePath, pathname)

  if (!docsPathname) {
    return null
  }

  const page = getResolvedPageByPathname(options.docs, docsPathname)
  if (!page) {
    return null
  }

  const section = getResolvedSectionById(options.docs, page.sectionId)

  return {
    href: withSiteBaseUrl(`${page.href}${hash}`),
    title: page.title,
    breadcrumb: section ? [section.navTitle] : [],
    isCurrentPage: isSamePagePathname(page, currentPathname),
  }
}

const resolveOverviewItem = (options: {
  docs: DocsGlobalContextData
  id: string
}): UniversalResolvedOverviewItem | null => {
  const page = options.docs.pages.find((candidate) => candidate.id === options.id)

  if (!page) {
    return null
  }

  return {
    title: page.title,
    href: withSiteBaseUrl(page.href),
    excerpt: page.description ?? null,
  }
}

export const getMdxRuntimeValue = (options: {
  docs: DocsGlobalContextData
  currentPathname: string
}): UniversalMdxRuntimeValue => {
  const { currentPathname, docs } = options
  const activeSection = getActiveSectionByPathname(docs, currentPathname)
  const currentPage = getResolvedPageByPathname(docs, currentPathname)

  return {
    locale: 'en',
    codeBlockChoices: docsCodeBlockChoiceStore,
    localizeHref: (href) => {
      if (href.startsWith('#') || isExternalHref(href)) {
        return href
      }

      const { pathname, hash } = splitHref(href)
      const docsPathname = toDocsPathname(docs.basePath, pathname)
      const page = docsPathname ? getResolvedPageByPathname(docs, docsPathname) : null

      if (!page) {
        return withSiteBaseUrl(href)
      }

      return withSiteBaseUrl(`${page.href}${hash}`)
    },
    resolveDocLink: ({ href }) =>
      resolveDocLink({
        docs,
        currentPathname,
        href,
      }),
    resolveOverviewItem: (id) =>
      resolveOverviewItem({
        docs,
        id,
      }),
    t: (group, key) => {
      if (group === 'docs' && key === 'onThisPage') {
        return 'On this page'
      }

      if (group === 'docs' && key === 'previous') {
        return 'Previous'
      }

      if (group === 'docs' && key === 'next') {
        return 'Next'
      }

      if (group === 'docs' && key === 'currentSection') {
        return activeSection?.navTitle ?? currentPage?.title ?? 'Docs'
      }

      return key
    },
  }
}
