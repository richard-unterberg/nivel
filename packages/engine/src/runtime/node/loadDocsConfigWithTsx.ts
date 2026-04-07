import { pathToFileURL } from 'node:url'
import { register } from 'tsx/esm/api'
import { loadDocsConfig } from './loadDocsConfig.js'

export const loadDocsConfigWithTsx = async (rootDir: string) => {
  const unregister = register()

  try {
    return await loadDocsConfig({
      rootDir,
      loadModule: async (modulePath) => import(pathToFileURL(modulePath).href),
    })
  } finally {
    await unregister()
  }
}
