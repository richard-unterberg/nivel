import { createContext, useContext } from 'react'

const CodeBlockGroupContext = createContext(false)

export const CodeBlockGroupProvider = CodeBlockGroupContext.Provider

export const useIsInCodeBlockGroup = () => useContext(CodeBlockGroupContext)
