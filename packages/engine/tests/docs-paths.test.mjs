import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { resolveDocsConfig, resolveDocsHref, syncGeneratedDocsPages } from '../dist/runtime/node.js'

const createDocsGraph = () => {
  return {
    items: [
      {
        kind: 'section',
        id: 'docs',
        title: 'Docs',
        icon: 'BookOpen',
        items: [
          {
            kind: 'group',
            id: 'getting-started',
            title: 'Getting Started',
            href: 'intro',
            icon: 'FolderOpen',
            items: [
              {
                kind: 'page',
                id: 'intro',
                title: 'Intro',
                slug: 'intro',
                source: 'content/intro/content.mdx',
                aliases: ['start'],
                icon: 'FileText',
              },
            ],
          },
        ],
      },
      {
        kind: 'section',
        id: 'more',
        title: 'More',
        icon: 'SquareTerminal',
        href: '/pricing/',
        items: [
          {
            kind: 'page',
            id: 'pricing',
            title: 'Pricing',
            slug: 'pricing',
            source: 'content/pricing/content.mdx',
            icon: 'BadgeDollarSign',
          },
        ],
      },
    ],
  }
}

const createDocsConfig = (overrides = {}) => {
  return {
    basePath: '/docs',
    graph: createDocsGraph(),
    siteTitle: 'My Docs',
    ...overrides,
  }
}

test('resolveDocsConfig supports custom route bases, content roots, and docs-relative graph hrefs', () => {
  const resolved = resolveDocsConfig(
    createDocsConfig({
      basePath: '/guide',
      contentDir: 'docs-source',
    }),
  )

  assert.equal(resolved.basePath, '/guide')
  assert.equal(resolved.contentDir, 'docs-source')
  assert.equal(resolved.pages[0]?.href, '/guide/intro/')
  assert.deepEqual(resolved.pages[0]?.aliasHrefs, ['/guide/start/'])
  assert.equal(resolved.sections[0]?.items[0]?.kind, 'group')
  assert.equal(resolved.sections[0]?.items[0]?.href, '/guide/intro/')
  assert.equal(resolved.sections[0]?.icon, 'BookOpen')
  assert.equal(resolved.sections[0]?.items[0]?.icon, 'FolderOpen')
  assert.equal(resolved.pages[0]?.icon, 'FileText')
  assert.equal(resolved.sections[1]?.href, '/pricing/')
  assert.equal(resolved.sections[1]?.icon, 'SquareTerminal')
  assert.equal(resolved.pages[1]?.icon, 'BadgeDollarSign')
})

test('root route bases and docs-local href resolution avoid malformed slashes', () => {
  const resolved = resolveDocsConfig(
    createDocsConfig({
      basePath: '/',
    }),
  )

  assert.equal(resolved.pages[0]?.href, '/intro/')
  assert.deepEqual(resolved.pages[0]?.aliasHrefs, ['/start/'])
  assert.equal(resolveDocsHref('/guide', 'intro#setup'), '/guide/intro/')
  assert.equal(resolveDocsHref('/guide', '/guide/intro/'), '/guide/intro/')
  assert.equal(resolveDocsHref('/guide', '/pricing/'), null)
  assert.equal(resolveDocsHref('/', 'intro'), '/intro/')
})

test('basePath and contentDir validation fail fast for invalid values', () => {
  assert.equal(resolveDocsConfig(createDocsConfig()).robots, true)
  assert.equal(resolveDocsConfig(createDocsConfig({ robots: false })).robots, false)
  assert.equal(resolveDocsConfig(createDocsConfig()).customFonts, true)
  assert.equal(resolveDocsConfig(createDocsConfig({ customFonts: false })).customFonts, false)
  assert.equal(resolveDocsConfig(createDocsConfig()).head.customFonts, true)
  assert.equal(resolveDocsConfig(createDocsConfig({ customFonts: false })).head.customFonts, false)
  assert.equal(resolveDocsConfig(createDocsConfig({ customFonts: false })).head.fontPreset, 'none')
  assert.equal(resolveDocsConfig(createDocsConfig({ customFonts: false })).head.fontStylesheetHref, undefined)
  assert.deepEqual(resolveDocsConfig(createDocsConfig({ customFonts: false })).head.fontPreloadHrefs, [])
  assert.equal(resolveDocsConfig(createDocsConfig({ basePath: '/guide/' })).basePath, '/guide')
  assert.equal(resolveDocsConfig(createDocsConfig({ contentDir: './docs/content' })).contentDir, 'docs/content')
  assert.throws(() => resolveDocsConfig(createDocsConfig({ basePath: 'guide' })))
  assert.throws(() => resolveDocsConfig(createDocsConfig({ basePath: '/guide#hash' })))
  assert.throws(() => resolveDocsConfig(createDocsConfig({ contentDir: '../docs' })))
  assert.throws(() => resolveDocsConfig(createDocsConfig({ contentDir: '/docs' })))
  assert.throws(() =>
    resolveDocsConfig({
      ...createDocsConfig(),
      graph: {
        items: [
          {
            kind: 'section',
            id: 'docs',
            title: 'Docs',
            icon: 'NotALucideIcon',
            items: [
              {
                kind: 'page',
                id: 'intro',
                title: 'Intro',
                slug: 'intro',
                source: 'content/intro/content.mdx',
              },
            ],
          },
        ],
      },
    }),
  )
})

test('syncGeneratedDocsPages reads custom contentDir and emits custom route files', () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nivel-docs-paths-'))

  try {
    const introDir = path.join(rootDir, 'docs-source', 'content', 'intro')
    const pricingDir = path.join(rootDir, 'docs-source', 'content', 'pricing')

    fs.mkdirSync(introDir, { recursive: true })
    fs.mkdirSync(pricingDir, { recursive: true })
    fs.writeFileSync(path.join(introDir, 'content.mdx'), '# Intro\n')
    fs.writeFileSync(path.join(pricingDir, 'content.mdx'), '# Pricing\n')

    syncGeneratedDocsPages({
      rootDir,
      docsConfig: createDocsConfig({
        basePath: '/guide',
        contentDir: 'docs-source',
      }),
    })

    const introRoute = fs.readFileSync(path.join(rootDir, 'pages', '(nivel-generated)', 'intro', '+route.ts'), 'utf8')
    const aliasRoute = fs.readFileSync(path.join(rootDir, 'pages', '(nivel-generated)', 'start', '+route.ts'), 'utf8')
    const globalContext = fs.readFileSync(
      path.join(rootDir, 'pages', '(nivel-generated)', '_docsGlobalContext.ts'),
      'utf8',
    )

    assert.equal(introRoute, 'export default "/guide/intro"\n')
    assert.equal(aliasRoute, 'export default "/guide/start"\n')
    assert.match(globalContext, /"robots": true/)
    assert.match(globalContext, /"basePath": "\/guide"/)
    assert.match(globalContext, /"contentDir": "docs-source"/)
    assert.doesNotMatch(globalContext, /@unterberg\/nivel\/icons/)
    assert.match(globalContext, /const BadgeDollarSign = createDocsIcon\(/)
    assert.match(globalContext, /const BookOpen = createDocsIcon\(/)
    assert.match(globalContext, /const FileText = createDocsIcon\(/)
    assert.match(globalContext, /const FolderOpen = createDocsIcon\(/)
    assert.match(globalContext, /const SquareTerminal = createDocsIcon\(/)
    assert.match(globalContext, /"section:docs": BookOpen/)
    assert.match(globalContext, /"group:getting-started": FolderOpen/)
    assert.match(globalContext, /"page:intro": FileText/)
    assert.match(globalContext, /"section:more": SquareTerminal/)
    assert.match(globalContext, /"page:pricing": BadgeDollarSign/)
  } finally {
    fs.rmSync(rootDir, { force: true, recursive: true })
  }
})

test('syncGeneratedDocsPages imports component topBarNav entries without serializing component paths', () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nivel-docs-topbar-'))

  try {
    const introDir = path.join(rootDir, 'docs', 'content', 'intro')
    const pricingDir = path.join(rootDir, 'docs', 'content', 'pricing')

    fs.mkdirSync(introDir, { recursive: true })
    fs.mkdirSync(pricingDir, { recursive: true })
    fs.writeFileSync(path.join(introDir, 'content.mdx'), '# Intro\n')
    fs.writeFileSync(path.join(pricingDir, 'content.mdx'), '# Pricing\n')

    syncGeneratedDocsPages({
      rootDir,
      docsConfig: createDocsConfig({
        topBarNav: {
          components: ['./components/DocsMegaMenuTopBarItems', './components/DocsTopBarSearch'],
        },
      }),
    })

    const globalContext = fs.readFileSync(
      path.join(rootDir, 'pages', '(nivel-generated)', '_docsGlobalContext.ts'),
      'utf8',
    )

    assert.match(globalContext, /import TopBarNavComponent0 from "\.\.\/components\/DocsMegaMenuTopBarItems"/)
    assert.match(globalContext, /import TopBarNavComponent1 from "\.\.\/components\/DocsTopBarSearch"/)
    assert.match(globalContext, /"topBarNav": \{\n {4}"kind": "components"\n {2}\}/)
    assert.match(globalContext, /topBarNavComponents: \[TopBarNavComponent0, TopBarNavComponent1\]/)
    assert.doesNotMatch(globalContext, /"components": \[/)
  } finally {
    fs.rmSync(rootDir, { force: true, recursive: true })
  }
})
