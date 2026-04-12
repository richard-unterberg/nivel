import assert from 'node:assert/strict'
import test from 'node:test'
import * as clientRuntime from '../src/runtime/client/index.ts'
import { createDocsRuntimeStore } from '../src/runtime/client/store/runtime-store.tsx'

test('search store actions update open state and query', () => {
  const store = createDocsRuntimeStore()

  assert.deepEqual(store.getState().searchState, {
    isOpen: false,
    query: '',
  })

  store.getState().searchActions.open()
  store.getState().searchActions.setQuery('telefunc')

  assert.deepEqual(store.getState().searchState, {
    isOpen: true,
    query: 'telefunc',
  })
})

test('search store clearQuery keeps open state while resetting the query', () => {
  const store = createDocsRuntimeStore()

  store.getState().searchActions.open()
  store.getState().searchActions.setQuery('telefunc')
  store.getState().searchActions.clearQuery()

  assert.deepEqual(store.getState().searchState, {
    isOpen: true,
    query: '',
  })
})

test('search store toggle and close actions can close an opened search panel', () => {
  const toggledStore = createDocsRuntimeStore()
  const closedStore = createDocsRuntimeStore()

  toggledStore.getState().searchActions.open()
  toggledStore.getState().searchActions.toggle()
  closedStore.getState().searchActions.open()
  closedStore.getState().searchActions.close()

  assert.equal(toggledStore.getState().searchState.isOpen, false)
  assert.equal(closedStore.getState().searchState.isOpen, false)
})

test('client runtime exports the public search hooks', () => {
  assert.equal(typeof clientRuntime.useDocsSearchActions, 'function')
  assert.equal(typeof clientRuntime.useDocsSearchStore, 'function')
})

test('client runtime exports the public sidebar hooks', () => {
  assert.equal(typeof clientRuntime.useDocsSidebarActions, 'function')
  assert.equal(typeof clientRuntime.useDocsSidebarStore, 'function')
})
