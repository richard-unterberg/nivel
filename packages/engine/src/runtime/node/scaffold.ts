import fs from 'node:fs'
import path from 'node:path'

const MANAGED_SCRIPT_NAMES = ['generate:docs', 'predev', 'prebuild', 'pretypecheck'] as const

const REQUIRED_DEPENDENCIES = ['@unterberg/nivel', 'react', 'react-dom', 'vike', 'vike-react'] as const
const REQUIRED_DEV_DEPENDENCIES = ['vite', 'typescript', '@types/react', '@types/react-dom'] as const

type InitConsumerOptions = { force: boolean; rootDir: string }

type InitConsumerResult = {
  allDependenciesPresent: boolean
  createdFiles: string[]
  missingDependencies: string[]
  overwrittenFiles: string[]
  skippedFiles: string[]
  updatedScripts: string[]
}

type PackageJsonShape = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  packageManager?: string
  scripts?: Record<string, string>
}

const getViteConfigTemplate = () => {
  return [
    "import { nivelTailwindVite } from '@unterberg/nivel/tailwind'",
    "import vike from 'vike/plugin'",
    '',
    'process.env.VIKE_CRAWL ??= JSON.stringify({ git: false })',
    '',
    'const base = (() => {',
    "  const normalized = process.env.PAGES_BASE_PATH?.trim().replace(/^\\/+|\\/+$/g, '') ?? ''",
    "  return normalized ? `/${normalized}/` : '/'",
    '})()',
    '',
    'export default {',
    '  base,',
    '  plugins: [nivelTailwindVite(), vike()],',
    '}',
    '',
  ].join('\n')
}

const getDocsConfigTemplate = () => {
  return [
    "import { defineDocsConfig } from '@unterberg/nivel/config'",
    "import { docsGraph } from '../docs/docs.graph'",
    '',
    'const docsConfig = defineDocsConfig({',
    '  graph: docsGraph,',
    "  siteTitle: 'My Docs',",
    "  siteDescription: 'Documentation site powered by @unterberg/nivel.',",
    "  basePath: '/docs',",
    '})',
    '',
    'export default docsConfig',
    '',
  ].join('\n')
}

const getDocsGraphTemplate = () => {
  return [
    "import { defineDocsGraph } from '@unterberg/nivel/config'",
    '',
    'export const docsGraph = defineDocsGraph({',
    '  items: [',
    '    {',
    "      kind: 'section',",
    "      id: 'docs',",
    "      title: 'Docs',",
    '      items: [',
    '        {',
    "          kind: 'page',",
    "          id: 'gettingStarted',",
    "          title: 'Getting Started',",
    "          slug: 'getting-started',",
    "          source: 'content/getting-started/content.mdx',",
    "          description: 'Getting started with @unterberg/nivel.',",
    '        },',
    '      ],',
    '    },',
    '  ],',
    '})',
    '',
  ].join('\n')
}

const getConfigTemplate = () => {
  return [
    "import nivel from '@unterberg/nivel/vike'",
    "import type { Config } from 'vike/types'",
    "import vikeReact from 'vike-react/config'",
    "import docsConfig from './+docs'",
    '',
    'export { config }',
    '',
    "const themePreference = docsConfig.theme?.defaultPreference ?? 'light'",
    'const dataTheme =',
    "  themePreference === 'dark'",
    "    ? (docsConfig.theme?.dark ?? 'consumer-dark')",
    "    : (docsConfig.theme?.light ?? 'consumer-light')",
    '',
    'const config: Config = {',
    '  ...nivel,',
    '  extends: [vikeReact],',
    '  title: docsConfig.siteTitle,',
    '  description: docsConfig.siteDescription ?? `${docsConfig.siteTitle} documentation`,',
    "  htmlAttributes: { 'data-theme': dataTheme },",
    '',
    '  // User-facing Vike levers stay visible in +config.ts.',
    '  prerender: true,',
    '  // ssr: true,',
    "  // prefetchStaticAssets: 'viewport',",
    '}',
    '',
  ].join('\n')
}

const getHeadTemplate = () => {
  return [
    "import { MetaHead } from '@unterberg/nivel/client'",
    '',
    'export const Head = () => {',
    '  return <MetaHead />',
    '}',
    '',
  ].join('\n')
}

const getLayoutTemplate = () => {
  return [
    "import { AppLayout } from '@unterberg/nivel/client'",
    "import type { ReactNode } from 'react'",
    '',
    'const Layout = ({ children }: { children: ReactNode }) => {',
    '  return <AppLayout>{children}</AppLayout>',
    '}',
    '',
    'export default Layout',
    '',
  ].join('\n')
}

const getGlobalContextTemplate = () => {
  return [
    "import { docsGlobalContextData } from './(nivel-generated)/_docsGlobalContext'",
    '',
    'export const onCreateGlobalContext = (globalContext: { docs?: typeof docsGlobalContextData }) => {',
    '  globalContext.docs = docsGlobalContextData',
    '}',
    '',
  ].join('\n')
}

const getWrapperTemplate = () => {
  return [
    "import type { ReactNode } from 'react'",
    "import '../styles/global.css'",
    '',
    'const Wrapper = ({ children }: { children: ReactNode }) => {',
    '  return <>{children}</>',
    '}',
    '',
    'export default Wrapper',
    '',
  ].join('\n')
}

const getGlobalStyleTemplate = () => {
  return [
    "@import '@unterberg/nivel/tailwind.css';",
    "@import './theme.css';",
    '',
    "@source '../pages';",
    "@source '../docs';",
    '',
    '@layer base {',
    '  html,',
    '  body {',
    '    @apply bg-base-100 text-base-content font-sans antialiased md:subpixel-antialiased;',
    '  }',
    '',
    '  .prose-container {',
    '    @apply prose prose-neutral max-w-none dark:prose-invert;',
    '    @apply prose-a:text-primary;',
    '    @apply prose-pre:bg-base-200!;',
    '    @apply prose-code:rounded!;',
    '    @apply prose-code:bg-primary/5!;',
    '    @apply prose-code:border-primary/15!;',
    '    @apply prose-code:dark:bg-primary/10!;',
    '    @apply prose-code:dark:border-primary/20!;',
    '    @apply prose-p:leading-[180%];',
    '    @apply prose-li:leading-[180%];',
    '    @apply prose-p:after:content-none;',
    '    @apply prose-p:before:content-none;',
    '    @apply prose-blockquote:not-italic;',
    '    @apply prose-blockquote:bg-base-200;',
    '    @apply prose-blockquote:py-2;',
    '  }',
    '}',
    '',
  ].join('\n')
}

const getThemeTemplate = () => {
  return [
    '@custom-variant dark (&:where(',
    "    [data-theme='consumer-dark'],",
    "    [data-theme='consumer-dark'] *",
    '  ));',
    '',
    "@plugin '@unterberg/nivel/daisyui-theme' {",
    "  name: 'consumer-light';",
    '  default: true;',
    '  prefersdark: false;',
    "  color-scheme: 'light';",
    '  --color-base-100: #f6f6f4;',
    '  --color-base-200: #ffffff;',
    '  --color-base-300: #ecebe7;',
    '  --color-base-content: #171717;',
    '  --color-primary: #0f766e;',
    '  --color-primary-content: #f8fafc;',
    '  --color-secondary: #d97706;',
    '  --color-secondary-content: #111827;',
    '  --color-accent: #1d4ed8;',
    '  --color-accent-content: #f8fafc;',
    '  --color-neutral: #171717;',
    '  --color-neutral-content: #f8fafc;',
    '  --color-info: #2563eb;',
    '  --color-info-content: #eff6ff;',
    '  --color-success: #15803d;',
    '  --color-success-content: #f0fdf4;',
    '  --color-warning: #d97706;',
    '  --color-warning-content: #fff7ed;',
    '  --color-error: #dc2626;',
    '  --color-error-content: #fef2f2;',
    '  --radius-selector: 0.25rem;',
    '  --radius-field: 0.5rem;',
    '  --radius-box: 1rem;',
    '  --size-selector: 0.25rem;',
    '  --size-field: 0.25rem;',
    '  --border: 1px;',
    '  --depth: 0;',
    '  --noise: 0;',
    '}',
    '',
    "@plugin '@unterberg/nivel/daisyui-theme' {",
    "  name: 'consumer-dark';",
    '  default: false;',
    '  prefersdark: false;',
    "  color-scheme: 'dark';",
    '  --color-base-100: #151515;',
    '  --color-base-200: #1e1e1e;',
    '  --color-base-300: #2a2a2a;',
    '  --color-base-content: #ededed;',
    '  --color-primary: #2dd4bf;',
    '  --color-primary-content: #042f2e;',
    '  --color-secondary: #f59e0b;',
    '  --color-secondary-content: #1c1917;',
    '  --color-accent: #60a5fa;',
    '  --color-accent-content: #172554;',
    '  --color-neutral: #ededed;',
    '  --color-neutral-content: #171717;',
    '  --color-info: #60a5fa;',
    '  --color-info-content: #172554;',
    '  --color-success: #4ade80;',
    '  --color-success-content: #052e16;',
    '  --color-warning: #fbbf24;',
    '  --color-warning-content: #451a03;',
    '  --color-error: #f87171;',
    '  --color-error-content: #450a0a;',
    '  --radius-selector: 0.25rem;',
    '  --radius-field: 0.5rem;',
    '  --radius-box: 1rem;',
    '  --size-selector: 0.25rem;',
    '  --size-field: 0.25rem;',
    '  --border: 1px;',
    '  --depth: 0;',
    '  --noise: 0;',
    '}',
    '',
    '@theme inline {',
    '  --color-base-muted: color-mix(',
    '    in oklab,',
    '    var(--color-base-content) 65%,',
    '    transparent',
    '  );',
    '  --color-base-muted-medium: color-mix(',
    '    in oklab,',
    '    var(--color-base-content) 40%,',
    '    transparent',
    '  );',
    '  --color-base-muted-light: color-mix(',
    '    in oklab,',
    '    var(--color-base-content) 12%,',
    '    transparent',
    '  );',
    '  --color-base-muted-superlight: color-mix(',
    '    in oklab,',
    '    var(--color-base-content) 5%,',
    '    transparent',
    '  );',
    '  --color-primary-muted: color-mix(',
    '    in oklab,',
    '    var(--color-primary) 80%,',
    '    transparent',
    '  );',
    '  --color-primary-muted-medium: color-mix(',
    '    in oklab,',
    '    var(--color-primary) 50%,',
    '    transparent',
    '  );',
    '  --color-primary-muted-light: color-mix(',
    '    in oklab,',
    '    var(--color-primary) 20%,',
    '    transparent',
    '  );',
    '  --color-primary-muted-superlight: color-mix(',
    '    in oklab,',
    '    var(--color-primary) 5%,',
    '    transparent',
    '  );',
    "  --font-sans: 'Inter', 'Helvetica Neue', sans-serif;",
    '  --font-mono:',
    "    'Monaco', 'SF Mono', SF Mono, SF Mono Regular, Consolas, 'Liberation Mono',",
    '    Menlo, Courier, monospace;',
    '}',
    '',
  ].join('\n')
}

const getGlobalTypesTemplate = () => {
  return [
    "declare module '*.mdx' {",
    "  import type { ComponentType } from 'react'",
    '',
    '  const MdxComponent: ComponentType',
    '  export default MdxComponent',
    '}',
    '',
    "declare module '*.css'",
    '',
    'declare global {',
    '  namespace Vike {',
    '    interface GlobalContext {',
    "      docs: import('@unterberg/nivel').DocsGlobalContextData",
    '    }',
    '  }',
    '}',
    '',
  ].join('\n')
}

const getManagedFileEntries = () => {
  return [
    ['vite.config.ts', getViteConfigTemplate()],
    ['pages/+docs.ts', getDocsConfigTemplate()],
    ['docs/docs.graph.ts', getDocsGraphTemplate()],
    ['pages/+config.ts', getConfigTemplate()],
    ['pages/+Head.tsx', getHeadTemplate()],
    ['pages/+Layout.tsx', getLayoutTemplate()],
    ['pages/+onCreateGlobalContext.ts', getGlobalContextTemplate()],
    ['pages/+Wrapper.tsx', getWrapperTemplate()],
    ['styles/global.css', getGlobalStyleTemplate()],
    ['styles/theme.css', getThemeTemplate()],
    ['global.d.ts', getGlobalTypesTemplate()],
  ] as const
}

const readFileIfExists = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    return null
  }

  return fs.readFileSync(filePath, 'utf8')
}

export const getTailwindBootstrapWarnings = (rootDir: string) => {
  const warnings: string[] = []
  const viteConfigPath = path.join(rootDir, 'vite.config.ts')
  const wrapperPath = path.join(rootDir, 'pages', '+Wrapper.tsx')
  const globalCssPath = path.join(rootDir, 'styles', 'global.css')
  const themeCssPath = path.join(rootDir, 'styles', 'theme.css')

  const viteConfigSource = readFileIfExists(viteConfigPath)
  if (!viteConfigSource?.includes('@unterberg/nivel/tailwind') || !viteConfigSource.includes('nivelTailwindVite()')) {
    warnings.push(
      'vite.config.ts should use @unterberg/nivel/tailwind and call nivelTailwindVite() for the engine-owned Tailwind integration.',
    )
  }

  const wrapperSource = readFileIfExists(wrapperPath)
  if (!wrapperSource?.includes('../styles/global.css')) {
    warnings.push('pages/+Wrapper.tsx should import ../styles/global.css.')
  }

  const globalCssSource = readFileIfExists(globalCssPath)
  if (
    !globalCssSource?.includes('@unterberg/nivel/tailwind.css') ||
    !globalCssSource.includes("@import './theme.css';") ||
    !globalCssSource.includes("@source '../pages';") ||
    !globalCssSource.includes("@source '../docs';")
  ) {
    warnings.push(
      "styles/global.css should import @unterberg/nivel/tailwind.css, import ./theme.css, and declare @source '../pages' plus @source '../docs'.",
    )
  }

  if (!fs.existsSync(themeCssPath)) {
    warnings.push('styles/theme.css is missing; define local daisyUI themes there.')
  }

  return warnings
}

const getGenerateDocsRunner = (packageJson: PackageJsonShape) => {
  const packageManager = packageJson.packageManager?.trim() ?? ''

  if (packageManager.startsWith('pnpm@')) {
    return 'pnpm generate:docs'
  }

  if (packageManager.startsWith('npm@')) {
    return 'npm run generate:docs'
  }

  return 'npm run generate:docs'
}

const getManagedScripts = (packageJson: PackageJsonShape) => {
  const generateDocsRunner = getGenerateDocsRunner(packageJson)

  return {
    'generate:docs': 'nivel prepare',
    predev: generateDocsRunner,
    prebuild: generateDocsRunner,
    pretypecheck: generateDocsRunner,
  } satisfies Record<(typeof MANAGED_SCRIPT_NAMES)[number], string>
}

const writeFile = (filePath: string, source: string) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, source)
}

const writeManagedFile = (
  rootDir: string,
  relativeFilePath: string,
  source: string,
  force: boolean,
  result: InitConsumerResult,
) => {
  const filePath = path.join(rootDir, relativeFilePath)
  const exists = fs.existsSync(filePath)

  if (exists && !force) {
    result.skippedFiles.push(relativeFilePath)
    return
  }

  writeFile(filePath, source)

  if (exists) {
    result.overwrittenFiles.push(relativeFilePath)
    return
  }

  result.createdFiles.push(relativeFilePath)
}

const readPackageJson = (rootDir: string) => {
  const packageJsonPath = path.join(rootDir, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`Expected package.json in ${rootDir}`)
  }

  return {
    packageJson: JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as PackageJsonShape,
    packageJsonPath,
  }
}

const patchPackageScripts = (packageJson: PackageJsonShape, packageJsonPath: string, result: InitConsumerResult) => {
  const scripts = { ...(packageJson.scripts ?? {}) }
  const managedScripts = getManagedScripts(packageJson)

  for (const scriptName of MANAGED_SCRIPT_NAMES) {
    if (scripts[scriptName] === managedScripts[scriptName]) {
      continue
    }

    scripts[scriptName] = managedScripts[scriptName]
    result.updatedScripts.push(scriptName)
  }

  const nextPackageJson = {
    ...packageJson,
    scripts,
  }

  fs.writeFileSync(packageJsonPath, `${JSON.stringify(nextPackageJson, null, 2)}\n`)
}

const getMissingDependencies = (packageJson: PackageJsonShape) => {
  const installed = new Set<string>([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ])

  return [...REQUIRED_DEPENDENCIES, ...REQUIRED_DEV_DEPENDENCIES].filter((packageName) => !installed.has(packageName))
}

export const getInitSummary = (result: InitConsumerResult) => {
  const lines = ['Initialized nivel consumer scaffolding.']

  if (result.createdFiles.length > 0) {
    lines.push(`Created files: ${result.createdFiles.join(', ')}`)
  }

  if (result.overwrittenFiles.length > 0) {
    lines.push(`Overwritten files: ${result.overwrittenFiles.join(', ')}`)
  }

  if (result.skippedFiles.length > 0) {
    lines.push(`Skipped existing files: ${result.skippedFiles.join(', ')}`)
  }

  if (result.updatedScripts.length > 0) {
    lines.push(`Updated package.json scripts: ${result.updatedScripts.join(', ')}`)
  }

  lines.push('Scaffolded vite.config.ts and local Tailwind starter files remain visible and editable in the consumer.')

  if (result.missingDependencies.length > 0) {
    lines.push(`Missing dependencies: ${result.missingDependencies.join(', ')}`)
  } else if (!result.allDependenciesPresent) {
    lines.push('Dependency validation completed with warnings.')
  } else {
    lines.push('All required dependencies are already present.')
  }

  return `${lines.join('\n')}\n`
}

export const initConsumer = (options: InitConsumerOptions): InitConsumerResult => {
  const result: InitConsumerResult = {
    allDependenciesPresent: true,
    createdFiles: [],
    missingDependencies: [],
    overwrittenFiles: [],
    skippedFiles: [],
    updatedScripts: [],
  }

  const { packageJson, packageJsonPath } = readPackageJson(options.rootDir)

  for (const [relativeFilePath, source] of getManagedFileEntries()) {
    writeManagedFile(options.rootDir, relativeFilePath, source, options.force, result)
  }

  patchPackageScripts(packageJson, packageJsonPath, result)

  result.missingDependencies = getMissingDependencies(packageJson)
  result.allDependenciesPresent = result.missingDependencies.length === 0

  return result
}
