import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const cliEntrypoint = path.join(repoRoot, 'packages', 'engine', 'bin', 'nivel.mjs')

const runCli = (args, cwd) => {
  return spawnSync(process.execPath, [cliEntrypoint, ...args], {
    cwd,
    encoding: 'utf8',
  })
}

const createTempRoot = (packageJson = {}) => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nivel-init-'))
  fs.writeFileSync(path.join(rootDir, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)

  return rootDir
}

const linkWorkspaceEngine = (rootDir) => {
  const targetDir = path.join(rootDir, 'node_modules', '@unterberg')
  fs.mkdirSync(targetDir, { recursive: true })
  fs.symlinkSync(path.join(repoRoot, 'packages', 'engine'), path.join(targetDir, 'nivel'))
}

const createDocsContent = (rootDir) => {
  const filePath = path.join(rootDir, 'docs', 'content', 'getting-started', 'content.mdx')
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, '# Getting started\n')
}

test('nivel init creates visible consumer files and standard scripts', () => {
  const rootDir = createTempRoot({
    name: 'consumer-app',
    packageManager: 'npm@11.6.3',
    scripts: {
      dev: 'vike dev',
    },
  })

  const result = runCli(['init', '--root', rootDir], repoRoot)

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Created files:/)
  assert.match(result.stdout, /Updated package\.json scripts:/)

  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'))

  assert.equal(packageJson.scripts['generate:docs'], 'nivel prepare')
  assert.equal(packageJson.scripts.predev, 'npm run generate:docs')
  assert.equal(packageJson.scripts.prebuild, 'npm run generate:docs')
  assert.equal(packageJson.scripts.pretypecheck, 'npm run generate:docs')
  assert.equal(fs.existsSync(path.join(rootDir, 'vite.config.ts')), true)
  assert.equal(fs.existsSync(path.join(rootDir, 'pages', '+config.ts')), true)
  assert.equal(fs.existsSync(path.join(rootDir, 'pages', '+Head.tsx')), true)
  assert.equal(fs.existsSync(path.join(rootDir, 'pages', '+Layout.tsx')), true)
  assert.equal(fs.existsSync(path.join(rootDir, 'pages', '+onCreateGlobalContext.ts')), true)
  assert.equal(fs.existsSync(path.join(rootDir, 'pages', '+Wrapper.tsx')), true)
  assert.equal(fs.existsSync(path.join(rootDir, 'pages', '+docs.ts')), true)
  assert.equal(fs.existsSync(path.join(rootDir, 'docs', 'docs.graph.ts')), true)
  assert.equal(fs.existsSync(path.join(rootDir, 'global.d.ts')), true)
  assert.equal(fs.existsSync(path.join(rootDir, 'styles', 'global.css')), true)
  assert.equal(fs.existsSync(path.join(rootDir, 'styles', 'theme.css')), true)
  const configSource = fs.readFileSync(path.join(rootDir, 'pages', '+config.ts'), 'utf8')
  const viteConfigSource = fs.readFileSync(path.join(rootDir, 'vite.config.ts'), 'utf8')
  const wrapperSource = fs.readFileSync(path.join(rootDir, 'pages', '+Wrapper.tsx'), 'utf8')
  assert.match(configSource, /createNivelVikeConfig/)
  assert.match(configSource, /prerender: true/)
  assert.match(configSource, /prefetchStaticAssets/)
  assert.doesNotMatch(configSource, /import type \{ Config \} from 'vike\/types'/)
  assert.match(viteConfigSource, /@unterberg\/nivel\/tailwind/)
  assert.match(viteConfigSource, /nivelTailwindVite\(\)/)
  assert.match(wrapperSource, /\.\.\/styles\/global\.css/)
  const docsConfigSource = fs.readFileSync(path.join(rootDir, 'pages', '+docs.ts'), 'utf8')
  assert.match(docsConfigSource, /satisfies DocsConfig/)
  assert.doesNotMatch(docsConfigSource, /defineDocsConfig/)
})

test('nivel init does not overwrite existing files without --force', () => {
  const rootDir = createTempRoot({
    name: 'consumer-app',
    packageManager: 'pnpm@10.28.1',
  })
  const docsFilePath = path.join(rootDir, 'pages', '+docs.ts')

  fs.mkdirSync(path.dirname(docsFilePath), { recursive: true })
  fs.writeFileSync(docsFilePath, 'const sentinel = true\n')

  const result = runCli(['init', '--root', rootDir], repoRoot)

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Skipped existing files: pages\/\+docs\.ts/)
  assert.equal(fs.readFileSync(docsFilePath, 'utf8'), 'const sentinel = true\n')

  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'))
  assert.equal(packageJson.scripts.predev, 'pnpm generate:docs')
})

test('nivel init overwrites managed files with --force and reports missing dependencies', () => {
  const rootDir = createTempRoot({
    name: 'consumer-app',
    scripts: {
      build: 'vike build',
    },
    dependencies: {
      react: '^19.1.1',
    },
  })
  const headFilePath = path.join(rootDir, 'pages', '+Head.tsx')

  fs.mkdirSync(path.dirname(headFilePath), { recursive: true })
  fs.writeFileSync(headFilePath, 'const stale = true\n')
  fs.mkdirSync(path.join(rootDir, 'styles'), { recursive: true })
  fs.writeFileSync(path.join(rootDir, 'styles', 'global.css'), 'body {}\n')

  const result = runCli(['init', '--root', rootDir, '--force'], repoRoot)

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Overwritten files: .*pages\/\+Head\.tsx/)
  assert.match(result.stdout, /Missing dependencies: /)
  assert.doesNotMatch(result.stdout, /tailwindcss|@tailwindcss\/vite|@tailwindcss\/typography|daisyui/)
  assert.equal(fs.readFileSync(headFilePath, 'utf8').includes('MetaHead'), true)
  assert.match(fs.readFileSync(path.join(rootDir, 'styles', 'global.css'), 'utf8'), /@unterberg\/nivel\/tailwind\.css/)
})

test('nivel prepare warns when the Tailwind bootstrap contract is missing', () => {
  const rootDir = createTempRoot({
    name: 'consumer-app',
    packageManager: 'npm@11.6.3',
    type: 'module',
  })

  linkWorkspaceEngine(rootDir)

  const initResult = runCli(['init', '--root', rootDir], repoRoot)
  assert.equal(initResult.status, 0, initResult.stderr)

  createDocsContent(rootDir)
  fs.rmSync(path.join(rootDir, 'styles', 'global.css'))

  const result = runCli(['prepare', '--root', rootDir], repoRoot)

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stderr, /Tailwind integration warning:/)
  assert.match(result.stderr, /styles\/global\.css should import @unterberg\/nivel\/tailwind\.css/)
})

test('nivel init rejects unknown options', () => {
  const rootDir = createTempRoot({ name: 'consumer-app' })
  const result = runCli(['init', '--root', rootDir, '--wat'], repoRoot)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /Unknown option --wat/)
})
