import path from 'node:path'
import type { DocsConfig } from '../../docs/types.js'

const getDocsConfigModulePath = (rootDir: string) => {
  return path.join(rootDir, 'pages', '+docs.ts')
}

const getDocsConfigFromLoadedModule = (loaded: unknown, modulePath: string) => {
  const docsConfig = (loaded as { default?: DocsConfig }).default

  if (!docsConfig) {
    throw new Error(`Expected default export from ${modulePath}`)
  }

  return docsConfig
}

export const loadDocsConfig = async (options: {
  rootDir: string
  loadModule: (modulePath: string) => Promise<unknown>
}) => {
  const modulePath = getDocsConfigModulePath(options.rootDir)
  const loaded = await options.loadModule(modulePath)
  return getDocsConfigFromLoadedModule(loaded, modulePath)
}
