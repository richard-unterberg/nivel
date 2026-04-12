import type { DocHeading, DocPageData } from '../../../docs/types.js'

export type DocsSearchState = {
  isOpen: boolean
  query: string
}

export type DocsSearchActions = {
  open: () => void
  close: () => void
  toggle: () => void
  setQuery: (query: string) => void
  clearQuery: () => void
}

export type DocsSearchSlice = DocsSearchState & DocsSearchActions

export type DocsSidebarState = {
  openNodes: Record<string, boolean>
}

export type DocsSidebarActions = {
  setNodeOpen: (nodeId: string, isOpen: boolean) => void
}

export type DocsSidebarSlice = DocsSidebarState & DocsSidebarActions

export type DocsRouteState = {
  currentHref: string
  currentSectionId: string | null
  pageTitle: string
  headings: DocHeading[]
  tableOfContents: boolean
  previousPage: DocPageData['previousPage']
  nextPage: DocPageData['nextPage']
}

export type DocsRouteActions = {
  setPageData: (data: DocPageData) => void
  clearPageData: () => void
}

export type DocsRouteSlice = DocsRouteState & DocsRouteActions
