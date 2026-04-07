import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { nivelPublicRoute } from '../../shared/assets.js'

const toPosix = (value: string) => value.split(path.sep).join(path.posix.sep)

const collectPublicAssetFilePaths = (directoryPath: string): string[] => {
  return fs.readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directoryPath, entry.name)
    return entry.isDirectory() ? collectPublicAssetFilePaths(entryPath) : [entryPath]
  })
}

const getRequestPathname = (requestUrl: string | undefined) => {
  return requestUrl?.split('?')[0]?.split('#')[0] ?? ''
}

const normalizeNivelAssetPathname = (pathname: string) => {
  if (pathname === nivelPublicRoute) {
    return pathname
  }

  if (!pathname.startsWith(`${nivelPublicRoute}/`)) {
    return null
  }

  const trimmedPathname = pathname.replace(/\/+$/g, '')
  if (trimmedPathname !== pathname && path.extname(trimmedPathname)) {
    return trimmedPathname
  }

  return pathname
}

const getPublicAssetsRootCandidates = (runtimeDir: string) => {
  let packageRoot: string | null = null

  try {
    const nivelConfigUrl = import.meta.resolve('@unterberg/nivel/vike')
    const nivelConfigPath = fileURLToPath(nivelConfigUrl)
    packageRoot = path.resolve(path.dirname(nivelConfigPath), '..')
  } catch {
    packageRoot = null
  }

  return [
    ...(packageRoot ? [path.join(packageRoot, 'assets')] : []),
    path.resolve(runtimeDir, '../assets'),
    path.resolve(runtimeDir, '../../assets'),
  ]
}

export const getNivelPublicAssetsRoot = () => {
  const runtimeUrl = import.meta.url.startsWith('/') ? pathToFileURL(import.meta.url).href : import.meta.url
  const runtimeDir = path.dirname(fileURLToPath(runtimeUrl))

  for (const candidate of getPublicAssetsRootCandidates(runtimeDir)) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate
    }
  }

  throw new Error(`Unable to locate nivel public assets from ${runtimeDir}.`)
}

export const getNivelPublicAssets = () => {
  const assetsRoot = getNivelPublicAssetsRoot()

  return collectPublicAssetFilePaths(assetsRoot).map((filePath) => ({
    fileName: toPosix(path.relative(assetsRoot, filePath)),
    filePath,
  }))
}

export const getNivelPublicAssetFilePath = (requestUrl: string | undefined) => {
  const pathname = normalizeNivelAssetPathname(getRequestPathname(requestUrl))

  if (!pathname) {
    return null
  }

  const assetsRoot = getNivelPublicAssetsRoot()
  const relativePath = pathname.replace(/^\/+/, '')
  const filePath = path.resolve(assetsRoot, relativePath)
  const relativeToRoot = path.relative(assetsRoot, filePath)

  if (
    relativeToRoot.startsWith('..') ||
    path.isAbsolute(relativeToRoot) ||
    !fs.existsSync(filePath) ||
    !fs.statSync(filePath).isFile()
  ) {
    return null
  }

  return filePath
}

export const getNivelPublicAssetContentType = (filePath: string) => {
  switch (path.extname(filePath)) {
    case '.css':
      return 'text/css; charset=utf-8'
    case '.svg':
      return 'image/svg+xml'
    case '.png':
      return 'image/png'
    case '.ico':
      return 'image/x-icon'
    case '.woff2':
      return 'font/woff2'
    default:
      return 'application/octet-stream'
  }
}

export const isNivelAssetRequestUrl = (requestUrl: string | undefined) => {
  return normalizeNivelAssetPathname(getRequestPathname(requestUrl)) !== null
}

export const isNivelAssetPath = (filePath: string) => {
  const normalizedFilePath = toPosix(path.resolve(filePath))
  const assetsRoot = toPosix(getNivelPublicAssetsRoot())
  return normalizedFilePath.startsWith(`${assetsRoot}/`)
}
