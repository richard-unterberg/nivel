import { maMerge } from '@marmo/react'
import type { DocsGlobalContextData, ResolvedDocsSection } from '@unterberg/nivel'
import { useEffect, useState } from 'react'

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

export const withSiteBaseUrl = (value: string) => {
  if (value === '' || value.startsWith('#') || value.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(value)) {
    return value
  }

  return value.startsWith('/') ? value : `/${value.replace(/^\/+/, '')}`
}

export const getTopBarButtonClassName = () => {
  return maMerge('btn btn-ghost btn-sm text-base px-2 whitespace-nowrap tracking-tight', 'lg:min-w-30')
}

export const getActiveTopBarButtonClassName = () => {
  return maMerge(getTopBarButtonClassName(), 'btn-primary btn-soft')
}

const normalizePathname = (value: string) => {
  const pathname = value.split('?')[0]?.split('#')[0] ?? value
  const normalized = pathname.trim().replace(/\/+$/g, '')

  return normalized === '' ? '/' : `${normalized}/`.replace(/\/+/g, '/')
}

export const getActiveSectionByPathname = (
  docs: Pick<DocsGlobalContextData, 'pages' | 'sidebarSections'>,
  pathname: string,
): ResolvedDocsSection | null => {
  const normalizedPathname = normalizePathname(pathname)
  const activePage =
    docs.pages.find((page) => {
      if (normalizePathname(page.href) === normalizedPathname) {
        return true
      }

      return page.aliasHrefs.some((aliasHref) => normalizePathname(aliasHref) === normalizedPathname)
    }) ?? null

  if (!activePage) {
    return null
  }

  return docs.sidebarSections.find((section) => section.id === activePage.sectionId) ?? null
}
