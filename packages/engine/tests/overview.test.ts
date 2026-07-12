import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Overview } from '../src/mdx/components/Overview.js'

test('Overview renders an item excerpt as text content', () => {
  const markup = renderToStaticMarkup(
    createElement(Overview, {
      items: [
        {
          title: 'Base Composition',
          href: '/get-started',
          excerpt: 'Getting started with `marmo`',
        },
      ],
    }),
  )

  assert.match(markup, /<p class="text-sm leading-relaxed text-base-muted">/)
  assert.match(markup, /Getting started with <code[^>]*>marmo<\/code>/)
})
