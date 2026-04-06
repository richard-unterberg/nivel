import { createContext, useContext, type PropsWithChildren } from 'react'
import type { UniversalMdxRuntimeValue } from './types.js'

const UniversalMdxContext = createContext<UniversalMdxRuntimeValue | null>(null)

export const UniversalMdxProvider = ({ children, value }: PropsWithChildren<{ value: UniversalMdxRuntimeValue }>) => {
  return <UniversalMdxContext.Provider value={value}>{children}</UniversalMdxContext.Provider>
}

export const useUniversalMdxRuntime = () => {
  return useContext(UniversalMdxContext)
}
