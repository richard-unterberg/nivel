import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ChoiceGroup, Pre } from '../dist/index.js'
import { getCodeBlockPropsFromMeta, parseMetaString, stripMetaProps } from '../dist/mdx/code-blocks.js'

test('parseMetaString preserves quoted values in rest while extracting requested props', () => {
  const meta = parseMetaString('choice=svelte title="src/routes/TodoList.svelte" env=client', ['choice'])

  assert.deepEqual(meta.props, { choice: 'svelte' })
  assert.equal(meta.rest, 'title="src/routes/TodoList.svelte" env=client')
})

test('getCodeBlockPropsFromMeta extracts explicit title and supported env', () => {
  const meta = getCodeBlockPropsFromMeta('title="hello.ts" env=server')

  assert.deepEqual(meta.props, {})
  assert.equal(meta.title, 'hello.ts')
  assert.equal(meta.env, 'server')
})

test('getCodeBlockPropsFromMeta keeps supported pre props and ignores unsupported env values', () => {
  const meta = getCodeBlockPropsFromMeta('file-added title="hello.ts" env=edge hide-menu render=true')

  assert.deepEqual(meta.props, { 'file-added': 'true', 'hide-menu': 'true', render: 'true' })
  assert.equal(meta.title, 'hello.ts')
  assert.equal(meta.env, null)
})

test('getCodeBlockPropsFromMeta no longer treats bare tokens as titles', () => {
  const meta = getCodeBlockPropsFromMeta('client')

  assert.deepEqual(meta.props, {})
  assert.equal(meta.title, null)
  assert.equal(meta.env, null)
})

test('stripMetaProps removes renderer-owned props from the pretty-code meta string', () => {
  const meta = stripMetaProps(
    'choice=svelte title="src/routes/TodoList.svelte" env=client file-added hide-menu render=true',
    ['title', 'env', 'file-added', 'hide-menu', 'render'],
  )

  assert.ok(!meta.includes('title='))
  assert.ok(!meta.includes('env='))
  assert.ok(!meta.includes('file-added'))
  assert.ok(!meta.includes('hide-menu'))
  assert.ok(!meta.includes('render='))
  assert.ok(meta.includes('choice=svelte'))
})

test('Pre renders explicit title and env badge', () => {
  const html = renderToStaticMarkup(
    React.createElement(
      Pre,
      {
        'data-code-env': 'server',
        'data-code-title': 'hello.ts',
        'data-language': 'ts',
      },
      React.createElement('code', null, 'console.log("hi")'),
    ),
  )

  assert.match(html, /hello\.ts/)
  assert.match(html, />server</)
})

test('Pre falls back to language label when title is absent', () => {
  const html = renderToStaticMarkup(
    React.createElement(
      Pre,
      {
        'data-code-env': 'client',
        'data-language': 'js',
      },
      React.createElement('code', null, 'console.log("hi")'),
    ),
  )

  assert.match(html, />JS</)
  assert.match(html, />client</)
})

test('Pre renders Mermaid diagrams when language is mermaid and render=true', () => {
  const html = renderToStaticMarkup(
    React.createElement(
      Pre,
      {
        'data-language': 'mermaid',
        render: 'true',
      },
      React.createElement('code', null, 'graph TD\nA-->B'),
    ),
  )

  assert.match(html, /data-mermaid-diagram/)
  assert.match(html, /Rendering diagram\.\.\./)
  assert.match(html, /graph TD/)
})

test('ChoiceGroup renders title and env from the active code block', () => {
  const html = renderToStaticMarkup(
    React.createElement(
      ChoiceGroup,
      {
        choiceGroup: {
          choices: ['solid'],
          default: 'solid',
          disabled: [],
          name: 'custom:solid',
        },
      },
      React.createElement(
        'div',
        { 'data-choice-value': 'solid' },
        React.createElement('pre', {
          'data-code-env': 'client',
          'data-code-title': 'components/TodoList.jsx',
        }),
      ),
    ),
  )

  assert.match(html, /components\/TodoList\.jsx/)
  assert.match(html, />client</)
})

test('ChoiceGroup falls back to the choice label when no title is present', () => {
  const html = renderToStaticMarkup(
    React.createElement(
      ChoiceGroup,
      {
        choiceGroup: {
          choices: ['React'],
          default: 'React',
          disabled: [],
          name: 'custom:React',
        },
      },
      React.createElement(
        'div',
        { 'data-choice-value': 'React' },
        React.createElement('pre', {
          'data-code-env': 'client',
        }),
      ),
    ),
  )

  assert.match(html, />React</)
  assert.match(html, />client</)
})
