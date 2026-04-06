import { usePageContext } from 'vike-react/usePageContext'
import type { DocsGlobalContextData } from '../types.js'

type DocsPageContext = {
  globalContext?: {
    docs?: DocsGlobalContextData
  }
}

export const getDocsGlobalContext = (pageContext: DocsPageContext) => {
  const docs = pageContext.globalContext?.docs

  if (!docs) {
    throw new Error('Missing docs global context data.')
  }

  return docs
}

export const useDocsGlobalContext = () => {
  return getDocsGlobalContext(usePageContext() as DocsPageContext)
}
