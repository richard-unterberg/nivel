import fs from 'node:fs'
import path from 'node:path'
import { extractDocHeadings } from '../../docs/docHeadings.js'
import { getDocsIconMapKey } from '../../docs/iconKeys.js'
import { getResolvedPageById, resolveDocsConfig } from '../../docs/resolveDocsConfig.js'
import type {
  DocPageData,
  DocPageLinkData,
  DocsConfig,
  DocsGlobalContextSerializableData,
  DocsIconName,
  DocsGlobalContextTopBarNav,
  ResolvedSidebarNode,
  ResolvedTopBarNav,
} from '../../docs/types.js'
import { getGeneratedDocsIconNode } from '../../generated/iconNodes.js'

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

const serializeData = (data: DocPageData | DocsGlobalContextSerializableData) => JSON.stringify(data, null, 2)

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

const getGeneratedLayoutSource = () => {
  return [
    "import { DocsRouteLayout } from '@unterberg/nivel/client'",
    "import type { ReactNode } from 'react'",
    '',
    'const Layout = ({ children }: { children: ReactNode }) => {',
    '  return <DocsRouteLayout>{children}</DocsRouteLayout>',
    '}',
    '',
    'export default Layout',
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

type IconEntry = {
  iconKey: string
  iconName: DocsIconName
}

const getSidebarIconEntries = (nodes: ResolvedSidebarNode[]): IconEntry[] => {
  return nodes.flatMap((node) => {
    const iconEntries = node.icon ? [{ iconKey: getDocsIconMapKey(node.kind, node.id), iconName: node.icon }] : []

    if (node.kind === 'group') {
      return [...iconEntries, ...getSidebarIconEntries(node.items)]
    }

    return iconEntries
  })
}

const getGeneratedIconMapSource = (entries: IconEntry[]) => {
  if (entries.length === 0) {
    return '{}'
  }

  return ['{', ...entries.map(({ iconKey, iconName }) => `  ${JSON.stringify(iconKey)}: ${iconName},`), '}'].join('\n')
}

const getDocsIconNode = (iconName: DocsIconName) => {
  const iconNode = getGeneratedDocsIconNode(iconName)
  if (!iconNode) {
    throw new Error(`Unable to resolve generated docs icon node for "${iconName}".`)
  }

  return iconNode
}

const getGeneratedIconDefinitionsSource = (iconNames: DocsIconName[]) => {
  if (iconNames.length === 0) {
    return []
  }

  const definitions = iconNames.flatMap((iconName) => {
    return [`const ${iconName} = createDocsIcon(${JSON.stringify(getDocsIconNode(iconName))})`, '']
  })

  return [
    "import { createElement, forwardRef, type SVGProps } from 'react'",
    '',
    'type DocsGeneratedIconProps = SVGProps<SVGSVGElement> & {',
    '  size?: string | number',
    '  absoluteStrokeWidth?: boolean',
    '}',
    '',
    'type DocsGeneratedIconNode = [tagName: string, attrs: Record<string, string>][]',
    '',
    'const docsGeneratedIconSvgAttrs = {',
    "  xmlns: 'http://www.w3.org/2000/svg',",
    "  fill: 'none',",
    "  viewBox: '0 0 24 24',",
    "  stroke: 'currentColor',",
    '  strokeWidth: 2,',
    "  strokeLinecap: 'round',",
    "  strokeLinejoin: 'round',",
    '} as const',
    '',
    'const createDocsIcon = (iconNode: DocsGeneratedIconNode) => {',
    '  return forwardRef<SVGSVGElement, DocsGeneratedIconProps>(',
    '    ({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, children, ...props }, ref) => {',
    "      const resolvedSize = typeof size === 'number' ? size : Number(size)",
    '      const resolvedStrokeWidth =',
    '        absoluteStrokeWidth && Number.isFinite(resolvedSize) && resolvedSize > 0',
    '          ? (Number(strokeWidth) * 24) / resolvedSize',
    '          : strokeWidth',
    '',
    '      return createElement(',
    "        'svg',",
    '        {',
    '          ...docsGeneratedIconSvgAttrs,',
    '          ...props,',
    '          ref,',
    '          width: size,',
    '          height: size,',
    '          stroke: color,',
    '          strokeWidth: resolvedStrokeWidth,',
    '        },',
    '        ...iconNode.map(([tagName, attrs]) => createElement(tagName, attrs)),',
    '        children,',
    '      )',
    '    },',
    '  )',
    '}',
    '',
    ...definitions,
  ]
}

const getGeneratedGlobalContextSource = (
  data: DocsGlobalContextSerializableData,
  topBarNavComponentImportPaths: string[] = [],
) => {
  const iconEntries = data.sidebarSections.flatMap((section) => {
    const sectionIconEntries = section.icon
      ? [{ iconKey: getDocsIconMapKey('section', section.id), iconName: section.icon }]
      : []

    return [...sectionIconEntries, ...getSidebarIconEntries(section.items)]
  })
  const iconImports = [...new Set(iconEntries.map(({ iconName }) => iconName))].sort()

  return [
    "import type { DocsGlobalContextData, DocsGlobalContextSerializableData, DocsIconMap } from '@unterberg/nivel'",
    ...topBarNavComponentImportPaths.map(
      (importPath, index) => `import TopBarNavComponent${index} from ${JSON.stringify(importPath)}`,
    ),
    ...getGeneratedIconDefinitionsSource(iconImports),
    '',
    `const docsGlobalContextSerializableData: DocsGlobalContextSerializableData = ${serializeData(data)}`,
    '',
    `const docsIconMap: DocsIconMap = ${getGeneratedIconMapSource(iconEntries)}`,
    '',
    'const docsGlobalContextData: DocsGlobalContextData = {',
    '  ...docsGlobalContextSerializableData,',
    '  docsIconMap,',
    topBarNavComponentImportPaths.length > 0
      ? `  topBarNavComponents: [${topBarNavComponentImportPaths
          .map((_, index) => `TopBarNavComponent${index}`)
          .join(', ')}],`
      : null,
    '}',
    '',
    'export { docsGlobalContextData }',
    '',
  ]
    .filter((line): line is string => line !== null)
    .join('\n')
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

const getSerializableTopBarNav = (topBarNav: ResolvedTopBarNav): DocsGlobalContextTopBarNav => {
  if (topBarNav.kind === 'components') {
    return {
      kind: 'components',
    }
  }

  return topBarNav
}

const getTopBarNavComponentImportPaths = (options: { rootDir: string; topBarNav: ResolvedTopBarNav }) => {
  if (options.topBarNav.kind !== 'components') {
    return []
  }

  const generatedPagesRoot = getGeneratedPagesRoot(options.rootDir)

  return options.topBarNav.components.map((component) => {
    const componentPath = path.resolve(path.dirname(getDocsConfigPath(options.rootDir)), component)

    return getRelativeImportPath(generatedPagesRoot, componentPath)
  })
}

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
  if (isGeneratedDocsPath(filePath, docsSourcePaths)) {
    return false
  }

  const docsConfigPath = toPosix(docsSourcePaths.docsConfigPath)
  const docsGraphPath = toPosix(docsSourcePaths.docsGraphPath)
  const contentRootPath = toPosix(docsSourcePaths.contentRootPath)

  return (
    normalized === docsConfigPath ||
    normalized === docsGraphPath ||
    normalized === contentRootPath ||
    normalized.startsWith(`${contentRootPath}/`)
  )
}

export const isGeneratedDocsPath = (filePath: string, docsSourcePaths: DocsSourcePaths) => {
  const normalized = toPosix(filePath)
  const generatedRootPath = toPosix(docsSourcePaths.generatedRootPath)

  return normalized.startsWith(generatedRootPath)
}

export const syncGeneratedDocsPages = (options: { rootDir: string; docsConfig: DocsConfig }) => {
  const { rootDir, docsConfig } = options
  const resolved = resolveDocsConfig(docsConfig)
  const generatedPagesRoot = getGeneratedPagesRoot(rootDir)
  const docsContentRoot = path.join(rootDir, resolved.contentDir)
  const expectedFiles = new Set<string>()
  const globalContextFilePath = path.join(generatedPagesRoot, '_docsGlobalContext.ts')
  const layoutFilePath = path.join(generatedPagesRoot, '+Layout.tsx')

  fs.mkdirSync(generatedPagesRoot, { recursive: true })

  const globalContextData: DocsGlobalContextSerializableData = {
    siteTitle: resolved.siteTitle,
    robots: resolved.robots,
    basePath: resolved.basePath,
    contentDir: resolved.contentDir,
    theme: resolved.theme,
    footer: resolved.footer,
    brand: resolved.brand,
    head: resolved.head,
    partners: resolved.partners,
    social: resolved.social,
    pages: resolved.pages,
    navbarItems: resolved.navbarItems,
    topBarNav: getSerializableTopBarNav(resolved.topBarNav),
    sidebarSections: resolved.sections,
  }

  writeFileIfChanged(
    globalContextFilePath,
    getGeneratedGlobalContextSource(
      globalContextData,
      getTopBarNavComponentImportPaths({ rootDir, topBarNav: resolved.topBarNav }),
    ),
  )
  writeFileIfChanged(layoutFilePath, getGeneratedLayoutSource())
  expectedFiles.add(globalContextFilePath)
  expectedFiles.add(layoutFilePath)

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
