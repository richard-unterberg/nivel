export type DocsSidebarState = {
  openNodes: Record<string, boolean>
}

export type DocsSidebarActions = {
  setNodeOpen: (nodeId: string, isOpen: boolean) => void
}

export type DocsSidebarSlice = DocsSidebarState & DocsSidebarActions
