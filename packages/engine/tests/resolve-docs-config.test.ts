import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveDocsConfig } from '../src/docs/resolveDocsConfig.ts'
import type { DocsConfig, DocsGraph } from '../src/docs/types.ts'

const graph = {
  items: [
    {
      kind: 'section',
      id: 'guide',
      title: 'Guide',
      navTitle: 'Docs',
      items: [
        {
          kind: 'page',
          id: 'intro',
          title: 'Introduction',
          slug: 'intro',
          source: 'intro.mdx',
        },
      ],
    },
    {
      kind: 'section',
      id: 'api',
      title: 'API',
      items: [
        {
          kind: 'page',
          id: 'reference',
          title: 'Reference',
          slug: 'reference',
          source: 'reference.mdx',
        },
      ],
    },
  ],
} satisfies DocsGraph

const createConfig = (overrides: Partial<DocsConfig> = {}): DocsConfig => {
  return {
    siteTitle: 'Test docs',
    basePath: '/docs',
    graph,
    ...overrides,
  }
}

test('topBarNav defaults to no topbar nav items', () => {
  const resolved = resolveDocsConfig(createConfig())

  assert.deepEqual(resolved.topBarNav, {
    kind: 'none',
    items: [],
  })
})

test('topBarNav false resolves to no topbar nav items', () => {
  const resolved = resolveDocsConfig(createConfig({ topBarNav: false }))

  assert.deepEqual(resolved.topBarNav, {
    kind: 'none',
    items: [],
  })
})

test('topBarNav true is rejected because mega menu composition is consumer-owned', () => {
  assert.throws(
    () => resolveDocsConfig(createConfig({ topBarNav: true } as Partial<DocsConfig>)),
    /topBarNav no longer accepts true/,
  )
})

test('topBarNav link arrays preserve order, CTA flags, and normalized hrefs', () => {
  const resolved = resolveDocsConfig(
    createConfig({
      topBarNav: [
        {
          label: 'Guide',
          href: 'guide',
        },
        {
          label: 'Dashboard',
          href: '/dashboard',
          isCta: true,
        },
        {
          label: 'Jump',
          href: '#overview',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/richard-unterberg/nivel',
        },
      ],
    }),
  )

  assert.deepEqual(resolved.topBarNav, {
    kind: 'links',
    items: [
      {
        label: 'Guide',
        href: '/docs/guide/',
        isCta: false,
      },
      {
        label: 'Dashboard',
        href: '/dashboard/',
        isCta: true,
      },
      {
        label: 'Jump',
        href: '#overview',
        isCta: false,
      },
      {
        label: 'GitHub',
        href: 'https://github.com/richard-unterberg/nivel',
        isCta: false,
      },
    ],
  })
})

test('topBarNav empty link arrays resolve to links mode with no items', () => {
  const resolved = resolveDocsConfig(createConfig({ topBarNav: [] }))

  assert.deepEqual(resolved.topBarNav, {
    kind: 'links',
    items: [],
  })
})

test('topBarNav components mode preserves normalized relative import paths', () => {
  const resolved = resolveDocsConfig(
    createConfig({
      topBarNav: {
        components: ['.\\components\\DocsMegaMenuTopBarItems', './components/DocsTopBarSearch'],
      },
    }),
  )

  assert.deepEqual(resolved.topBarNav, {
    kind: 'components',
    components: ['./components/DocsMegaMenuTopBarItems', './components/DocsTopBarSearch'],
  })
})

test('topBarNav components mode rejects invalid import paths', () => {
  assert.throws(
    () =>
      resolveDocsConfig(
        createConfig({
          topBarNav: {
            components: [],
          },
        }),
      ),
    /topBarNav components must include at least one relative import path/,
  )

  assert.throws(
    () =>
      resolveDocsConfig(
        createConfig({
          topBarNav: {
            component: './components/DocsTopBarNav',
          } as never,
        }),
      ),
    /topBarNav components must be an array of relative import paths/,
  )

  assert.throws(
    () =>
      resolveDocsConfig(
        createConfig({
          topBarNav: {
            components: [' '],
          },
        }),
      ),
    /topBarNav component 1 must be a non-empty relative import path/,
  )

  assert.throws(
    () =>
      resolveDocsConfig(
        createConfig({
          topBarNav: {
            components: ['@app/DocsTopBarSearch'],
          },
        }),
      ),
    /topBarNav component 1 must be a relative import path/,
  )
})

test('topBarNav rejects blank labels', () => {
  assert.throws(
    () =>
      resolveDocsConfig(
        createConfig({
          topBarNav: [
            {
              label: ' ',
              href: '/docs',
            },
          ],
        }),
      ),
    /topBarNav item 1 label must be a non-empty string/,
  )
})

test('topBarNav rejects blank hrefs', () => {
  assert.throws(
    () =>
      resolveDocsConfig(
        createConfig({
          topBarNav: [
            {
              label: 'Docs',
              href: ' ',
            },
          ],
        }),
      ),
    /topBarNav item 1 href must be a non-empty string/,
  )
})
