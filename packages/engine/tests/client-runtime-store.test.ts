import assert from 'node:assert/strict'
import test from 'node:test'
import * as clientRuntime from '../src/runtime/client/index.ts'
import { createDocsRuntimeStore } from '../src/runtime/client/store/runtime-store.tsx'

test('sidebar store actions update open node state', () => {
  const store = createDocsRuntimeStore()

  assert.deepEqual(store.getState().sidebarState, {
    openNodes: {},
  })

  store.getState().sidebarActions.setNodeOpen('section:docs', true)

  assert.deepEqual(store.getState().sidebarState, {
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

test('client runtime exports the public sidebar hooks', () => {
  assert.equal(typeof clientRuntime.useDocsSidebarActions, 'function')
  assert.equal(typeof clientRuntime.useDocsSidebarStore, 'function')
})

test('client runtime exports nivel action event helpers', () => {
  assert.equal(clientRuntime.NIVEL_ACTION_EVENT, 'nivel:action')
  assert.equal(typeof clientRuntime.dispatchNivelAction, 'function')
})
