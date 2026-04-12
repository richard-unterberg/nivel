import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import type {
  DocsRouteActions,
  DocsRouteSlice,
  DocsRouteState,
  DocsSearchActions,
  DocsSearchSlice,
  DocsSearchState,
  DocsSidebarActions,
  DocsSidebarSlice,
  DocsSidebarState,
} from './types.js'

type DocsRuntimeStoreState = {
  routeActions: DocsRouteActions
  routeState: DocsRouteState
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
}

const defaultDocsRouteState: DocsRouteState = {
  currentHref: '',
  currentSectionId: null,
  pageTitle: '',
  headings: [],
  tableOfContents: false,
  previousPage: null,
  nextPage: null,
}

export const createDocsRuntimeStore = () => {
  return createStore<DocsRuntimeStoreState>()((set) => {
    const routeActions: DocsRouteActions = {
      setPageData: (data) =>
        set((state) => {
          const nextRouteState: DocsRouteState = {
            ...state.routeState,
            currentHref: data.page.href,
            currentSectionId: data.page.sectionId,
            pageTitle: data.page.title,
            headings: data.headings,
            tableOfContents: data.page.tableOfContents,
            previousPage: data.previousPage,
            nextPage: data.nextPage,
          }

          if (
            state.routeState.currentHref === nextRouteState.currentHref &&
            state.routeState.currentSectionId === nextRouteState.currentSectionId &&
            state.routeState.pageTitle === nextRouteState.pageTitle &&
            state.routeState.headings === nextRouteState.headings &&
            state.routeState.tableOfContents === nextRouteState.tableOfContents &&
            state.routeState.previousPage === nextRouteState.previousPage &&
            state.routeState.nextPage === nextRouteState.nextPage
          ) {
            return state
          }

          return {
            routeState: nextRouteState,
          }
        }),
      clearPageData: () =>
        set((state) => {
          if (
            state.routeState.currentHref === defaultDocsRouteState.currentHref &&
            state.routeState.currentSectionId === defaultDocsRouteState.currentSectionId &&
            state.routeState.pageTitle === defaultDocsRouteState.pageTitle &&
            state.routeState.headings === defaultDocsRouteState.headings &&
            state.routeState.tableOfContents === defaultDocsRouteState.tableOfContents &&
            state.routeState.previousPage === defaultDocsRouteState.previousPage &&
            state.routeState.nextPage === defaultDocsRouteState.nextPage
          ) {
            return state
          }

          return {
            routeState: {
              ...state.routeState,
              currentHref: defaultDocsRouteState.currentHref,
              currentSectionId: defaultDocsRouteState.currentSectionId,
              pageTitle: defaultDocsRouteState.pageTitle,
              headings: defaultDocsRouteState.headings,
              tableOfContents: defaultDocsRouteState.tableOfContents,
              previousPage: defaultDocsRouteState.previousPage,
              nextPage: defaultDocsRouteState.nextPage,
            },
          }
        }),
    }

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
    }

    return {
      routeActions,
      routeState: defaultDocsRouteState,
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

export const useDocsRouteStore = <Selected,>(selector: (state: DocsRouteSlice) => Selected) => {
  return useDocsRuntimeStore((state) =>
    selector({
      ...state.routeState,
      ...state.routeActions,
    }),
  )
}

export const useDocsRouteActions = () => {
  return useDocsRuntimeStore((state) => state.routeActions)
}
