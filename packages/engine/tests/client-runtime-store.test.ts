import assert from 'node:assert/strict'
import test from 'node:test'
import * as clientRuntime from '../src/runtime/client/index.ts'
import type { DocsGlobalContextData } from '../src/docs/types.ts'
import { createDocsRuntimeStore } from '../src/runtime/client/store/runtime-store.tsx'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { VikeReactProviderPageContext } from 'vike-react/usePageContext'

test('sidebar store actions update open node state', () => {
  const store = createDocsRuntimeStore()

  assert.deepEqual(store.getState().sidebarState, {
    isMobileMenuOpen: false,
    openNodes: {},
  })

  store.getState().sidebarActions.setNodeOpen('section:docs', true)

  assert.deepEqual(store.getState().sidebarState, {
    isMobileMenuOpen: false,
    openNodes: {
      'section:docs': true,
    },
  })
})

test('sidebar store actions preserve state when setting an unchanged value', () => {
  const store = createDocsRuntimeStore()

  store.getState().sidebarActions.setNodeOpen('section:docs', true)
  const previousState = store.getState()
  store.getState().sidebarActions.setNodeOpen('section:docs', true)

  assert.equal(store.getState(), previousState)
})

test('sidebar store actions update mobile menu state', () => {
  const store = createDocsRuntimeStore()

  store.getState().sidebarActions.openMobileMenu()

  assert.equal(store.getState().sidebarState.isMobileMenuOpen, true)

  store.getState().sidebarActions.closeMobileMenu()

  assert.equal(store.getState().sidebarState.isMobileMenuOpen, false)
})

test('sidebar store actions preserve state when setting unchanged mobile menu value', () => {
  const store = createDocsRuntimeStore()
  const previousState = store.getState()

  store.getState().sidebarActions.setMobileMenuOpen(false)

  assert.equal(store.getState(), previousState)
})

test('client runtime exports the public sidebar hooks', () => {
  assert.equal(typeof clientRuntime.useDocsSidebarActions, 'function')
  assert.equal(typeof clientRuntime.useDocsSidebarStore, 'function')
})

test('client runtime exports docs context hook', () => {
  assert.equal(typeof clientRuntime.useDocsContext, 'function')
})

test('useDocsContext reads Vike global context outside the Nivel provider', () => {
  const docs = {
    siteTitle: 'Head Context Docs',
  } as DocsGlobalContextData
  const ReadDocsTitle = () => {
    const docsContext = clientRuntime.useDocsContext()

    return React.createElement('title', null, docsContext.siteTitle)
  }
  const html = renderToStaticMarkup(
    React.createElement(
      VikeReactProviderPageContext,
      {
        pageContext: {
          globalContext: {
            docs,
          },
        } as never,
      },
      React.createElement(ReadDocsTitle),
    ),
  )

  assert.equal(html, '<title>Head Context Docs</title>')
})

test('client runtime exports nivel action event helpers', () => {
  assert.equal(clientRuntime.NIVEL_ACTION_EVENT, 'nivel:action')
  assert.equal(typeof clientRuntime.dispatchNivelAction, 'function')
})
