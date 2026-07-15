export type DocsSidebarState = {
  isMobileMenuOpen: boolean
  openNodes: Record<string, boolean>
}

export type DocsSidebarActions = {
  closeMobileMenu: () => void
  openMobileMenu: () => void
  setMobileMenuOpen: (isOpen: boolean) => void
  setNodeOpen: (nodeId: string, isOpen: boolean) => void
}

export type DocsSidebarSlice = DocsSidebarState & DocsSidebarActions
