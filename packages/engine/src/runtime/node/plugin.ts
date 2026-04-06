import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'
import type { DocsConfig } from '../../docs/types.js'
import { isDocsSourcePath, syncGeneratedDocsPages } from './codegen.js'
import {
  getNivelPublicAssetContentType,
  getNivelPublicAssetFilePath,
  getNivelPublicAssetsRoot,
  isNivelAssetPath,
  isNivelAssetRequestUrl,
} from './publicAssets.js'

const loadDocsConfig = async (server: ViteDevServer, rootDir: string): Promise<DocsConfig> => {
  const modulePath = path.join(rootDir, 'pages', '+docs.ts')
  const loaded = await server.ssrLoadModule(modulePath)
  const docsConfig = loaded.default as DocsConfig | undefined

  if (!docsConfig) {
    throw new Error(`Expected default export from ${modulePath}`)
  }

  return docsConfig
}

const syncAndRestart = async (server: ViteDevServer, rootDir: string) => {
  const docsConfig = await loadDocsConfig(server, rootDir)
  syncGeneratedDocsPages({ rootDir, docsConfig })
  await server.restart()
}

export const nivelPagesPlugin = (): Plugin => {
  return {
    name: 'nivel-pages-plugin',
    enforce: 'pre',
    configureServer(server) {
      const rootDir = server.config.root
      const assetsRoot = getNivelPublicAssetsRoot()

      server.watcher.add(assetsRoot)

      const onChange = async (filePath: string) => {
        if (!isDocsSourcePath(filePath, rootDir)) {
          return
        }

        await syncAndRestart(server, rootDir)
      }

      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onChange)

      server.watcher.on('change', (filePath) => {
        if (!isNivelAssetPath(filePath)) {
          return
        }

        server.ws.send({ type: 'full-reload' })
      })

      server.middlewares.use((req, res, next) => {
        const filePath = getNivelPublicAssetFilePath(req.url)

        if (filePath) {
          res.setHeader('Content-Type', getNivelPublicAssetContentType(filePath))
          res.setHeader('Cache-Control', 'no-store')
          res.end(fs.readFileSync(filePath))
          return
        }

        if (isNivelAssetRequestUrl(req.url)) {
          res.statusCode = 404
          res.setHeader('Cache-Control', 'no-store')
          res.end()
          return
        }

        next()
      })
    },
    handleHotUpdate(ctx) {
      if (isNivelAssetPath(ctx.file)) {
        ctx.server.ws.send({ type: 'full-reload' })
        return []
      }

      if (!isDocsSourcePath(ctx.file, ctx.server.config.root)) {
        return
      }

      ctx.server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}
