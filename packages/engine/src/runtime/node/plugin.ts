import fs from 'node:fs'
import type { Plugin, ViteDevServer } from 'vite'
import { isDocsSourcePath, syncGeneratedDocsPages } from './codegen.js'
import {
  getNivelPublicAssetContentType,
  getNivelPublicAssetFilePath,
  getNivelPublicAssets,
  getNivelPublicAssetsRoot,
  isNivelAssetPath,
  isNivelAssetRequestUrl,
} from './publicAssets.js'
import { loadDocsConfig } from './loadDocsConfig.js'

const syncGeneratedPages = async (server: ViteDevServer, rootDir: string) => {
  const docsConfig = await loadDocsConfig({
    rootDir,
    loadModule: (modulePath) => server.ssrLoadModule(modulePath),
  })
  syncGeneratedDocsPages({ rootDir, docsConfig })
}

export const nivelPagesPlugin = (): Plugin => {
  let shouldEmitBuildAssets = false

  return {
    name: 'nivel-pages-plugin',
    enforce: 'pre',
    configResolved(config) {
      shouldEmitBuildAssets = config.command === 'build' && !config.build.ssr
    },
    buildStart() {
      if (!shouldEmitBuildAssets) {
        return
      }

      for (const asset of getNivelPublicAssets()) {
        this.emitFile({
          fileName: asset.fileName,
          source: fs.readFileSync(asset.filePath),
          type: 'asset',
        })
      }
    },
    configureServer(server) {
      const rootDir = server.config.root
      const assetsRoot = getNivelPublicAssetsRoot()
      let pendingSync = Promise.resolve()

      server.watcher.add(assetsRoot)

      const queueSync = (filePath: string) => {
        if (!isDocsSourcePath(filePath, rootDir)) {
          return
        }

        pendingSync = pendingSync
          .then(async () => {
            await syncGeneratedPages(server, rootDir)
            server.ws.send({ type: 'full-reload' })
          })
          .catch((error: unknown) => {
            console.error(error)
          })
      }

      server.watcher.on('add', queueSync)
      server.watcher.on('unlink', queueSync)

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
    async handleHotUpdate(ctx) {
      if (isNivelAssetPath(ctx.file)) {
        ctx.server.ws.send({ type: 'full-reload' })
        return []
      }

      if (!isDocsSourcePath(ctx.file, ctx.server.config.root)) {
        return
      }

      await syncGeneratedPages(ctx.server, ctx.server.config.root)
      ctx.server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}
