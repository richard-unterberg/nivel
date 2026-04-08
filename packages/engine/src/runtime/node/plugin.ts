import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'
import { getDocsSourcePaths, isDocsSourcePath, syncGeneratedDocsPages, type DocsSourcePaths } from './codegen.js'
import {
  getNivelPublicAssetContentType,
  getNivelPublicAssetFilePath,
  getNivelPublicAssets,
  getNivelPublicAssetsRoot,
  isNivelAssetPath,
  isNivelAssetRequestUrl,
} from './publicAssets.js'
import { loadDocsConfig } from './loadDocsConfig.js'

const syncGeneratedPages = async (
  server: ViteDevServer,
  rootDir: string,
  onDocsSourcesResolved: (docsSourcePaths: DocsSourcePaths) => void,
) => {
  const docsConfig = await loadDocsConfig({
    rootDir,
    loadModule: (modulePath) => server.ssrLoadModule(modulePath),
  })
  onDocsSourcesResolved(getDocsSourcePaths({ rootDir, docsConfig }))
  syncGeneratedDocsPages({ rootDir, docsConfig })
}

const getDefaultDocsSourcePaths = (rootDir: string): DocsSourcePaths => {
  return {
    contentRootPath: path.join(rootDir, 'docs'),
    docsConfigPath: path.join(rootDir, 'pages', '+docs.ts'),
    docsGraphPath: path.join(rootDir, 'docs', 'docs.graph.ts'),
    generatedRootPath: path.join(rootDir, 'pages', '(nivel-generated)'),
  }
}

export const nivelPagesPlugin = (): Plugin => {
  let shouldEmitBuildAssets = false
  let docsSourcePaths: DocsSourcePaths | null = null

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
      docsSourcePaths = getDefaultDocsSourcePaths(rootDir)

      server.watcher.add(assetsRoot)
      server.watcher.add([
        docsSourcePaths.docsConfigPath,
        docsSourcePaths.docsGraphPath,
        docsSourcePaths.contentRootPath,
      ])

      const updateDocsSourcePaths = (nextDocsSourcePaths: DocsSourcePaths) => {
        if (!docsSourcePaths) {
          docsSourcePaths = nextDocsSourcePaths
          server.watcher.add(nextDocsSourcePaths.contentRootPath)
          return
        }

        if (nextDocsSourcePaths.contentRootPath !== docsSourcePaths.contentRootPath) {
          server.watcher.unwatch(docsSourcePaths.contentRootPath)
          server.watcher.add(nextDocsSourcePaths.contentRootPath)
        }

        docsSourcePaths = nextDocsSourcePaths
      }

      void loadDocsConfig({
        rootDir,
        loadModule: (modulePath) => server.ssrLoadModule(modulePath),
      })
        .then((docsConfig) => {
          updateDocsSourcePaths(getDocsSourcePaths({ rootDir, docsConfig }))
        })
        .catch((error: unknown) => {
          console.error(error)
        })

      const queueSync = (filePath: string) => {
        if (!docsSourcePaths || !isDocsSourcePath(filePath, docsSourcePaths)) {
          return
        }

        pendingSync = pendingSync
          .then(async () => {
            await syncGeneratedPages(server, rootDir, updateDocsSourcePaths)
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

      const rootDir = ctx.server.config.root
      const resolvedDocsSourcePaths = docsSourcePaths ?? getDefaultDocsSourcePaths(rootDir)

      if (!isDocsSourcePath(ctx.file, resolvedDocsSourcePaths)) {
        return
      }

      await syncGeneratedPages(ctx.server, rootDir, (nextDocsSourcePaths) => {
        docsSourcePaths = nextDocsSourcePaths
      })
      ctx.server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}
