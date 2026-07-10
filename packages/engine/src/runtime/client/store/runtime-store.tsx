import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import type { DocsSidebarActions, DocsSidebarSlice, DocsSidebarState } from './types.js'

type DocsRuntimeStoreState = {
  sidebarActions: DocsSidebarActions
  sidebarState: DocsSidebarState
}

type DocsRuntimeStoreApi = ReturnType<typeof createDocsRuntimeStore>

const defaultDocsSidebarState: DocsSidebarState = {
  isMobileMenuOpen: false,
  openNodes: {},
}

export const createDocsRuntimeStore = () => {
  return createStore<DocsRuntimeStoreState>()((set) => {
    const sidebarActions: DocsSidebarActions = {
      closeMobileMenu: () => sidebarActions.setMobileMenuOpen(false),
      openMobileMenu: () => sidebarActions.setMobileMenuOpen(true),
      setMobileMenuOpen: (isOpen) =>
        set((state) => {
          if (state.sidebarState.isMobileMenuOpen === isOpen) {
            return state
          }

          return {
            sidebarState: {
              ...state.sidebarState,
              isMobileMenuOpen: isOpen,
            },
          }
        }),
      setNodeOpen: (nodeId, isOpen) =>
        set((state) => {
          if (state.sidebarState.openNodes[nodeId] === isOpen) {
            return state
          }

          return {
            sidebarState: {
              ...state.sidebarState,
              openNodes: {
                ...state.sidebarState.openNodes,
                [nodeId]: isOpen,
              },
            },
          }
        }),
    }

    return {
      sidebarActions,
      sidebarState: defaultDocsSidebarState,
    }
  })
}

const DocsRuntimeStoreContext = createContext<DocsRuntimeStoreApi | null>(null)

export const DocsRuntimeStoreProvider = ({ children, store }: { children: ReactNode; store: DocsRuntimeStoreApi }) => {
  return <DocsRuntimeStoreContext.Provider value={store}>{children}</DocsRuntimeStoreContext.Provider>
}

const useDocsRuntimeStoreApi = () => {
  const store = useContext(DocsRuntimeStoreContext)

  if (store === null) {
    throw new Error('Missing docs runtime store provider.')
  }

  return store
}

const useDocsRuntimeStore = <Selected,>(selector: (state: DocsRuntimeStoreState) => Selected) => {
  return useStore(useDocsRuntimeStoreApi(), selector)
}

export const useDocsSidebarStore = <Selected,>(selector: (state: DocsSidebarSlice) => Selected) => {
  return useDocsRuntimeStore((state) =>
    selector({
      ...state.sidebarState,
      ...state.sidebarActions,
    }),
  )
}

export const useDocsSidebarActions = () => {
  return useDocsRuntimeStore((state) => state.sidebarActions)
}
