import type { Context, ReactNode } from 'react'
import { createContext, createElement, useContext } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import type { DocsGlobalContextData } from '../../docs/types.js'

export type DocsPageContext = {
  globalContext?: {
    docs?: DocsGlobalContextData
  }
}

const docsGlobalContextKey = Symbol.for('@unterberg/nivel/docs-global-context')
const docsGlobalContextGlobal = globalThis as typeof globalThis & {
  [docsGlobalContextKey]?: Context<DocsGlobalContextData | null>
}

const DocsGlobalContext =
  docsGlobalContextGlobal[docsGlobalContextKey] ?? createContext<DocsGlobalContextData | null>(null)

docsGlobalContextGlobal[docsGlobalContextKey] = DocsGlobalContext

export const getDocsFromGlobalContext = (pageContext: DocsPageContext | undefined) => {
  const docs = pageContext?.globalContext?.docs

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
  const pageContext = usePageContext() as DocsPageContext | undefined

  if (docs) {
    return docs
  }

  return getDocsFromGlobalContext(pageContext)
}

export const useDocsFromPageGlobalContext = () => {
  return getDocsFromGlobalContext(usePageContext() as DocsPageContext | undefined)
}
