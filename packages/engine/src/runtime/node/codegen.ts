import fs from 'node:fs'
import path from 'node:path'
import type { DocPageData, DocPageLinkData, DocsConfig, DocsGlobalContextData } from '../../docs/types.js'
import { extractDocHeadings } from '../../docs/docHeadings.js'
import { getResolvedPageById, resolveDocsConfig } from '../../docs/resolveDocsConfig.js'

const GENERATED_DIRNAME = '(nivel-generated)'

const writeFileIfChanged = (filePath: string, source: string) => {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null
  if (current === source) {
    return
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, source)
}

const toPosix = (value: string) => value.split(path.sep).join(path.posix.sep)

const getRelativeImportPath = (fromDirectory: string, toFile: string) => {
  const relativePath = toPosix(path.relative(fromDirectory, toFile))
  if (relativePath.startsWith('.')) {
    return relativePath
  }
  return `./${relativePath}`
}

const serializeData = (data: DocPageData | DocsGlobalContextData) => JSON.stringify(data, null, 2)

const collectFiles = (directoryPath: string): string[] => {
  if (!fs.existsSync(directoryPath)) {
    return []
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true })

  return entries.flatMap((entry) => {
    const entryPath = path.join(directoryPath, entry.name)
    return entry.isDirectory() ? collectFiles(entryPath) : [entryPath]
  })
}

const removeEmptyDirectories = (directoryPath: string, rootPath: string) => {
  if (!fs.existsSync(directoryPath)) {
    return
  }

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue
    }

    removeEmptyDirectories(path.join(directoryPath, entry.name), rootPath)
  }

  if (directoryPath === rootPath) {
    return
  }

  if (fs.readdirSync(directoryPath).length === 0) {
    fs.rmdirSync(directoryPath)
  }
}

const getGeneratedPageSource = (contentImportPath: string) => {
  return [
    "import { DocsPage } from '@unterberg/nivel/client'",
    `import Content from ${JSON.stringify(contentImportPath)}`,
    '',
    'const Page = () => {',
    '  return <DocsPage Content={Content} />',
    '}',
    '',
    'export default Page',
    '',
  ].join('\n')
}

const getGeneratedDataSource = (data: DocPageData) => {
  return [
    "import type { DocPageData } from '@unterberg/nivel'",
    '',
    `const data: DocPageData = ${serializeData(data)}`,
    '',
    'const pageData = () => {',
    '  return data',
    '}',
    '',
    'export default pageData',
    '',
  ].join('\n')
}

const getGeneratedGlobalContextSource = (data: DocsGlobalContextData) => {
  return [
    "import type { DocsGlobalContextData } from '@unterberg/nivel'",
    '',
    `const docsGlobalContextData: DocsGlobalContextData = ${serializeData(data)}`,
    '',
    'export { docsGlobalContextData }',
    '',
  ].join('\n')
}

const getRouteString = (href: string) => {
  if (href === '/') {
    return href
  }

  return href.replace(/\/+$/g, '')
}

const getGeneratedRouteSource = (href: string) => {
  return [`export default ${JSON.stringify(getRouteString(href))}`, ''].join('\n')
}

const getGeneratedTextExport = (value: string) => {
  return [`export default ${JSON.stringify(value)}`, ''].join('\n')
}

const toDocPageLinkData = (
  page:
    | {
        id: string
        title: string
        href: string
        documentTitle: string
      }
    | undefined,
): DocPageLinkData | null => {
  if (!page) {
    return null
  }

  return {
    id: page.id,
    title: page.title,
    href: page.href,
    documentTitle: page.documentTitle,
  }
}

export const getGeneratedPagesRoot = (rootDir: string) => path.join(rootDir, 'pages', GENERATED_DIRNAME)

export type DocsSourcePaths = {
  contentRootPath: string
  docsConfigPath: string
  docsGraphPath: string
  generatedRootPath: string
}

const getDocsConfigPath = (rootDir: string) => path.join(rootDir, 'pages', '+docs.ts')

const getDocsGraphPath = (rootDir: string) => path.join(rootDir, 'docs', 'docs.graph.ts')

export const getDocsSourcePaths = (options: { rootDir: string; docsConfig: DocsConfig }): DocsSourcePaths => {
  const resolved = resolveDocsConfig(options.docsConfig)

  return {
    contentRootPath: path.join(options.rootDir, resolved.contentDir),
    docsConfigPath: getDocsConfigPath(options.rootDir),
    docsGraphPath: getDocsGraphPath(options.rootDir),
    generatedRootPath: getGeneratedPagesRoot(options.rootDir),
  }
}

export const isDocsSourcePath = (filePath: string, docsSourcePaths: DocsSourcePaths) => {
  const normalized = toPosix(filePath)
  const generatedRootPath = toPosix(docsSourcePaths.generatedRootPath)
  const docsConfigPath = toPosix(docsSourcePaths.docsConfigPath)
  const docsGraphPath = toPosix(docsSourcePaths.docsGraphPath)
  const contentRootPath = toPosix(docsSourcePaths.contentRootPath)

  if (normalized.startsWith(generatedRootPath)) {
    return false
  }

  return (
    normalized === docsConfigPath ||
    normalized === docsGraphPath ||
    normalized === contentRootPath ||
    normalized.startsWith(`${contentRootPath}/`)
  )
}

export const syncGeneratedDocsPages = (options: { rootDir: string; docsConfig: DocsConfig }) => {
  const { rootDir, docsConfig } = options
  const resolved = resolveDocsConfig(docsConfig)
  const generatedPagesRoot = getGeneratedPagesRoot(rootDir)
  const docsContentRoot = path.join(rootDir, resolved.contentDir)
  const expectedFiles = new Set<string>()
  const globalContextFilePath = path.join(generatedPagesRoot, '_docsGlobalContext.ts')

  fs.mkdirSync(generatedPagesRoot, { recursive: true })

  const globalContextData: DocsGlobalContextData = {
    siteTitle: resolved.siteTitle,
    basePath: resolved.basePath,
    theme: resolved.theme,
    footer: resolved.footer,
    brand: resolved.brand,
    head: resolved.head,
    partners: resolved.partners,
    algolia: resolved.algolia,
    pages: resolved.pages,
    navbarItems: resolved.navbarItems,
    sidebarSections: resolved.sections,
  }

  writeFileIfChanged(globalContextFilePath, getGeneratedGlobalContextSource(globalContextData))
  expectedFiles.add(globalContextFilePath)

  for (const [pageIndex, page] of resolved.pages.entries()) {
    const contentFilePath = path.join(docsContentRoot, page.source)

    if (!fs.existsSync(contentFilePath)) {
      throw new Error(`Docs page "${page.id}" points to missing source file: ${contentFilePath}`)
    }

    const pageSource = fs.readFileSync(contentFilePath, 'utf8')
    const data: DocPageData = {
      page: getResolvedPageById(resolved, page.id),
      headings: extractDocHeadings(pageSource),
      previousPage: toDocPageLinkData(resolved.pages[pageIndex - 1]),
      nextPage: toDocPageLinkData(resolved.pages[pageIndex + 1]),
    }

    const routeTargets = [
      { routeHref: page.href, routePath: page.slug },
      ...page.aliases.map((routePath, index) => ({
        routeHref: page.aliasHrefs[index] as string,
        routePath,
      })),
    ]

    for (const { routeHref, routePath } of routeTargets) {
      const pageDir = path.join(generatedPagesRoot, ...routePath.split('/'))
      const contentImportPath = getRelativeImportPath(pageDir, contentFilePath)

      const pageFilePath = path.join(pageDir, '+Page.tsx')
      const dataFilePath = path.join(pageDir, '+data.ts')
      const routeFilePath = path.join(pageDir, '+route.ts')
      const titleFilePath = path.join(pageDir, '+title.ts')

      writeFileIfChanged(pageFilePath, getGeneratedPageSource(contentImportPath))
      writeFileIfChanged(dataFilePath, getGeneratedDataSource(data))
      writeFileIfChanged(routeFilePath, getGeneratedRouteSource(routeHref))
      writeFileIfChanged(titleFilePath, getGeneratedTextExport(page.documentTitle))

      expectedFiles.add(pageFilePath)
      expectedFiles.add(dataFilePath)
      expectedFiles.add(routeFilePath)
      expectedFiles.add(titleFilePath)

      if (page.description) {
        const descriptionFilePath = path.join(pageDir, '+description.ts')
        writeFileIfChanged(descriptionFilePath, getGeneratedTextExport(page.description))
        expectedFiles.add(descriptionFilePath)
      }
    }
  }

  for (const filePath of collectFiles(generatedPagesRoot)) {
    if (expectedFiles.has(filePath)) {
      continue
    }

    fs.rmSync(filePath, { force: true })
  }

  removeEmptyDirectories(generatedPagesRoot, generatedPagesRoot)
}
