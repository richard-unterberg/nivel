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
  scrollTop: number
}

export type DocsSidebarActions = {
  setNodeOpen: (nodeId: string, isOpen: boolean) => void
  setScrollTop: (scrollTop: number) => void
}

export type DocsSidebarSlice = DocsSidebarState & DocsSidebarActions
