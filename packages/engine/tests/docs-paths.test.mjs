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
        items: [
          {
            kind: 'group',
            id: 'getting-started',
            title: 'Getting Started',
            href: 'intro',
            items: [
              {
                kind: 'page',
                id: 'intro',
                title: 'Intro',
                slug: 'intro',
                source: 'content/intro/content.mdx',
                aliases: ['start'],
              },
            ],
          },
        ],
      },
      {
        kind: 'section',
        id: 'more',
        title: 'More',
        href: '/pricing/',
        items: [
          {
            kind: 'page',
            id: 'pricing',
            title: 'Pricing',
            slug: 'pricing',
            source: 'content/pricing/content.mdx',
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
  assert.equal(resolved.sections[1]?.href, '/pricing/')
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
  assert.equal(resolveDocsConfig(createDocsConfig({ basePath: '/guide/' })).basePath, '/guide')
  assert.equal(resolveDocsConfig(createDocsConfig({ contentDir: './docs/content' })).contentDir, 'docs/content')
  assert.throws(() => resolveDocsConfig(createDocsConfig({ basePath: 'guide' })))
  assert.throws(() => resolveDocsConfig(createDocsConfig({ basePath: '/guide#hash' })))
  assert.throws(() => resolveDocsConfig(createDocsConfig({ contentDir: '../docs' })))
  assert.throws(() => resolveDocsConfig(createDocsConfig({ contentDir: '/docs' })))
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
    assert.match(globalContext, /"basePath": "\/guide"/)
  } finally {
    fs.rmSync(rootDir, { force: true, recursive: true })
  }
})
