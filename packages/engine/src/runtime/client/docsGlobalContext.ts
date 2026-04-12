import type { ReactNode } from 'react'
import { createContext, createElement, useContext } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import type { DocsGlobalContextData } from '../../docs/types.js'

export type DocsPageContext = {
  globalContext?: {
    docs?: DocsGlobalContextData
  }
}

const DocsGlobalContext = createContext<DocsGlobalContextData | null>(null)

export const getDocsFromGlobalContext = (pageContext: DocsPageContext) => {
  const docs = pageContext.globalContext?.docs

  if (!docs) {
    throw new Error('Missing docs global context data.')
  }

  return docs
}

export const DocsGlobalContextProvider = ({ children, docs }: { children: ReactNode; docs: DocsGlobalContextData }) => {
  return createElement(DocsGlobalContext.Provider, { value: docs }, children)
}

export const useDocsGlobalContext = () => {
  const docs = useContext(DocsGlobalContext)

  if (!docs) {
    throw new Error('Missing docs global context provider.')
  }

  return docs
}

export const useDocsFromPageGlobalContext = () => {
  return getDocsFromGlobalContext(usePageContext() as DocsPageContext)
}
