import assert from 'node:assert/strict'
import test from 'node:test'
import { getEditPageHref } from '../src/runtime/client/components/Footer.tsx'

test('edit page links include an optional repository path prefix', () => {
  assert.equal(
    getEditPageHref({
      github: 'https://github.com/richard-unterberg/marmo',
      branch: 'master',
      pathPrefix: 'docs',
      contentDir: 'content',
      source: 'gettingStarted.mdx',
    }),
    'https://github.com/richard-unterberg/marmo/edit/master/docs/content/gettingStarted.mdx',
  )
})

test('edit page links remain unchanged when no repository path prefix is configured', () => {
  assert.equal(
    getEditPageHref({
      github: 'https://github.com/example/docs',
      branch: 'main',
      pathPrefix: undefined,
      contentDir: 'docs',
      source: 'guide/intro.mdx',
    }),
    'https://github.com/example/docs/edit/main/docs/guide/intro.mdx',
  )
})
