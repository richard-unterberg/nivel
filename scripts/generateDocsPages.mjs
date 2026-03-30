import fs from 'node:fs'
import path from 'node:path'
import { applyTrailingSlashToPathname } from '../lib/vike/urlPathname.js'

const rootDir = process.cwd()
const pagesRoot = path.resolve(rootDir, 'pages')
const generatedPagesRoot = path.resolve(pagesRoot, '(docs)/(generated)')

const walkDir = (dirPath) => {
  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const nextPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      return walkDir(nextPath)
    }

    return [nextPath]
  })
}

const getLogicalSegments = (segments) => {
  return segments.filter((segment) => segment !== '' && !(segment.startsWith('(') && segment.endsWith(')')))
}

const writeFileIfChanged = (filePath, source) => {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null
  if (current === source) {
    return
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, source)
}

const getDocsContentEntries = () => {
  if (!fs.existsSync(pagesRoot)) {
    return []
  }

  return walkDir(pagesRoot).flatMap((filePath) => {
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
        locale: localeMatch[1],
        routeId,
      },
    ]
  })
}

const getGeneratedImports = (routeId, entries) => {
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

const getGeneratedPageSource = (routeId, entries) => {
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

const getGeneratedDataSource = (routeId, entries) => {
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

const getGeneratedRouteSource = (routeId) => {
  return [`export default ${JSON.stringify(applyTrailingSlashToPathname(`/${routeId}`))}`, ''].join('\n')
}

const syncGeneratedDocPages = () => {
  const docsContentEntries = getDocsContentEntries().sort((left, right) => {
    return left.routeId === right.routeId
      ? left.locale.localeCompare(right.locale)
      : left.routeId.localeCompare(right.routeId)
  })
  const entriesByRoute = new Map()

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

syncGeneratedDocPages()
