import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin, ViteDevServer } from 'vite'
import { applyTrailingSlashToPathname } from '../vike/urlPathname.js'
import { extractDocHeadings } from './headings'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const virtualModuleId = 'virtual:docs-content-manifest'
const resolvedVirtualModuleId = '\0virtual:docs-content-manifest'
const pagesRoot = path.resolve(__dirname, '../../pages')
const docsPagesRoot = path.resolve(pagesRoot, '(docs)')
const docsContentRoot = path.resolve(pagesRoot, '(docs)/(content)')
const generatedPagesRoot = path.resolve(pagesRoot, '(docs)/(generated)')

type DocsContentEntry = {
  headings: ReturnType<typeof extractDocHeadings>
  locale: string
  path: string
  routeId: string
}

const walkDir = (dirPath: string): string[] => {
  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const nextPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      return walkDir(nextPath)
    }

    return [nextPath]
  })
}

const getLogicalSegments = (segments: string[]) => {
  return segments.filter((segment) => segment !== '' && !(segment.startsWith('(') && segment.endsWith(')')))
}

const toPosixPath = (value: string) => value.split(path.sep).join('/')

const writeFileIfChanged = (filePath: string, source: string) => {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null
  if (current === source) {
    return
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, source)
}

const getDocsContentEntries = (): DocsContentEntry[] => {
  if (!fs.existsSync(pagesRoot)) {
    return []
  }

  return walkDir(pagesRoot).flatMap<DocsContentEntry>((filePath) => {
    const localeMatch = path.basename(filePath).match(/^content\.([^.]+)\.mdx$/)
    if (!localeMatch) {
      return []
    }

    const relativePath = path.relative(pagesRoot, filePath)
    if (!relativePath || relativePath.startsWith('..')) {
      return []
    }

    const segments = relativePath.split(path.sep).filter(Boolean)
    const contentIndex = segments.indexOf('(content)')
    if (contentIndex < 0) {
      return []
    }

    const routeId = getLogicalSegments(segments.slice(contentIndex + 1, -1)).join('/')
    if (!routeId) {
      return []
    }

    return [
      {
        headings: extractDocHeadings(fs.readFileSync(filePath, 'utf8')),
        locale: localeMatch[1],
        path: filePath,
        routeId,
      },
    ]
  })
}

const getGeneratedImports = (routeId: string, entries: DocsContentEntry[]) => {
  const imports = entries
    .map((entry) => {
      const importName = `doc${entry.locale.replace(/[^a-zA-Z0-9_$]/g, '_')}`
      const importPath = `@/pages/(docs)/(content)/${routeId}/content.${entry.locale}.mdx`
      return {
        importName,
        importStatement: `import * as ${importName} from ${JSON.stringify(importPath)}`,
        locale: entry.locale,
      }
    })
    .sort((left, right) => left.locale.localeCompare(right.locale))

  return {
    importBlock: imports.map((entry) => entry.importStatement).join('\n'),
    modulesBlock: imports.map((entry) => `  ${JSON.stringify(entry.locale)}: ${entry.importName},`).join('\n'),
  }
}

const getGeneratedPageSource = (routeId: string, entries: DocsContentEntry[]) => {
  const { importBlock, modulesBlock } = getGeneratedImports(routeId, entries)

  return [
    "import { usePageContext } from 'vike-react/usePageContext'",
    "import type { DocPageData, GeneratedDocModule } from '@/lib/docs/contentData'",
    "import type { Locale } from '@/lib/i18n/config'",
    importBlock,
    '',
    'const modules: Partial<Record<Locale, GeneratedDocModule>> = {',
    modulesBlock,
    '}',
    '',
    'const Page = () => {',
    '  const pageContext = usePageContext()',
    '  const docData = pageContext.data as DocPageData',
    '  const MdxPage = modules[docData.resolvedLocale]?.default',
    '',
    '  if (!MdxPage) {',
    `    throw new Error(${JSON.stringify(`Missing generated doc module for "${routeId}".`)})`,
    '  }',
    '',
    '  return <MdxPage />',
    '}',
    '',
    'export default Page',
    '',
  ].join('\n')
}

const getGeneratedDataSource = (routeId: string, entries: DocsContentEntry[]) => {
  const { importBlock, modulesBlock } = getGeneratedImports(routeId, entries)

  return [
    "import type { PageContext } from 'vike/types'",
    "import { getGeneratedDocPageData, type GeneratedDocModule } from '@/lib/docs/contentData'",
    "import type { Locale } from '@/lib/i18n/config'",
    "import { getTelefuncSystemConfig } from '@/lib/docs/systemConfig'",
    importBlock,
    '',
    'const modules: Partial<Record<Locale, GeneratedDocModule>> = {',
    modulesBlock,
    '}',
    '',
    'const data = (pageContext: PageContext) => {',
    `  return getGeneratedDocPageData(${JSON.stringify(routeId)}, pageContext.locale, modules, getTelefuncSystemConfig(pageContext))`,
    '}',
    '',
    'export default data',
    '',
  ].join('\n')
}

const getGeneratedRouteSource = (routeId: string) => {
  return [`export default ${JSON.stringify(applyTrailingSlashToPathname(`/${routeId}`))}`, ''].join('\n')
}

const syncGeneratedDocPages = () => {
  const docsContentEntries = getDocsContentEntries().sort((left, right) => left.path.localeCompare(right.path))
  const entriesByRoute = new Map<string, DocsContentEntry[]>()

  for (const entry of docsContentEntries) {
    const routeEntries = entriesByRoute.get(entry.routeId) ?? []
    routeEntries.push(entry)
    entriesByRoute.set(entry.routeId, routeEntries)
  }

  fs.rmSync(generatedPagesRoot, { force: true, recursive: true })
  fs.mkdirSync(generatedPagesRoot, { recursive: true })

  for (const [routeId, entries] of entriesByRoute) {
    const pageDir = path.join(generatedPagesRoot, ...routeId.split('/'))
    writeFileIfChanged(path.join(pageDir, '+Page.tsx'), getGeneratedPageSource(routeId, entries))
    writeFileIfChanged(path.join(pageDir, '+data.ts'), getGeneratedDataSource(routeId, entries))
    writeFileIfChanged(path.join(pageDir, '+route.ts'), getGeneratedRouteSource(routeId))
  }
}

const isDocsSourcePath = (filePath: string) => {
  const normalized = toPosixPath(filePath)
  const docsRoot = toPosixPath(docsPagesRoot)
  const generatedRoot = toPosixPath(generatedPagesRoot)

  return (
    normalized.startsWith(docsRoot) &&
    !normalized.startsWith(generatedRoot) &&
    (/\/content\.[^.]+\.mdx$/.test(normalized) || /\/content\.config\.(ts|js)$/.test(normalized))
  )
}

const restartDevServer = async (server: ViteDevServer) => {
  syncGeneratedDocPages()
  await server.restart()
}

export const docsPagesPlugin = (): Plugin => {
  return {
    name: 'docs-pages-plugin',
    enforce: 'pre',
    configureServer(server) {
      server.watcher.on('add', async (filePath) => {
        if (!isDocsSourcePath(filePath)) {
          return
        }

        await restartDevServer(server)
      })

      server.watcher.on('unlink', async (filePath) => {
        if (!isDocsSourcePath(filePath)) {
          return
        }

        await restartDevServer(server)
      })
    },
    handleHotUpdate(ctx) {
      if (!isDocsSourcePath(ctx.file)) {
        return
      }

      ctx.server.ws.send({ type: 'full-reload' })
      return []
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) {
        return
      }

      const docsContentEntries = getDocsContentEntries().sort((left, right) => left.path.localeCompare(right.path))

      return [
        `export const docsContentEntries = ${JSON.stringify(docsContentEntries)};`,
        'export default docsContentEntries;',
      ].join('\n')
    },
  }
}
