import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import type {
  DocsSearchActions,
  DocsSearchSlice,
  DocsSearchState,
  DocsSidebarActions,
  DocsSidebarSlice,
  DocsSidebarState,
} from './types.js'

type DocsRuntimeStoreState = {
  searchActions: DocsSearchActions
  searchState: DocsSearchState
  sidebarActions: DocsSidebarActions
  sidebarState: DocsSidebarState
}

type DocsRuntimeStoreApi = ReturnType<typeof createDocsRuntimeStore>

const defaultDocsSearchState: DocsSearchState = {
  isOpen: false,
  query: '',
}

const defaultDocsSidebarState: DocsSidebarState = {
  openNodes: {},
  scrollTop: 0,
}

export const createDocsRuntimeStore = () => {
  return createStore<DocsRuntimeStoreState>()((set) => {
    const searchActions: DocsSearchActions = {
      open: () =>
        set((state) => {
          if (state.searchState.isOpen) {
            return state
          }

          return {
            searchState: {
              ...state.searchState,
              isOpen: true,
            },
          }
        }),
      close: () =>
        set((state) => {
          if (!state.searchState.isOpen) {
            return state
          }

          return {
            searchState: {
              ...state.searchState,
              isOpen: false,
            },
          }
        }),
      toggle: () =>
        set((state) => ({
          searchState: {
            ...state.searchState,
            isOpen: !state.searchState.isOpen,
          },
        })),
      setQuery: (query) =>
        set((state) => {
          if (state.searchState.query === query) {
            return state
          }

          return {
            searchState: {
              ...state.searchState,
              query,
            },
          }
        }),
      clearQuery: () =>
        set((state) => {
          if (state.searchState.query === '') {
            return state
          }

          return {
            searchState: {
              ...state.searchState,
              query: '',
            },
          }
        }),
    }

    const sidebarActions: DocsSidebarActions = {
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
      setScrollTop: (scrollTop) =>
        set((state) => {
          if (state.sidebarState.scrollTop === scrollTop) {
            return state
          }

          return {
            sidebarState: {
              ...state.sidebarState,
              scrollTop,
            },
          }
        }),
    }

    return {
      searchActions,
      searchState: defaultDocsSearchState,
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

export const useDocsSearchStore = <Selected,>(selector: (state: DocsSearchSlice) => Selected) => {
  return useDocsRuntimeStore((state) =>
    selector({
      ...state.searchState,
      ...state.searchActions,
    }),
  )
}

export const useDocsSearchActions = () => {
  return useDocsRuntimeStore((state) => state.searchActions)
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
