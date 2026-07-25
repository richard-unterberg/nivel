import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveDocsConfig } from '../src/docs/resolveDocsConfig.ts'
import type {
  DocsConfig,
  DocsGraph,
  DocsSidebarNode,
  ResolvedDocsConfig,
  ResolvedSidebarNode,
} from '../src/docs/types.ts'
import {
  hiddenBGraph,
  movedPageGraph,
  orderedABCGraph,
  orderedCABGraph,
  reorderedGroupsGraph,
} from './fixtures/order-semantics.ts'

const getUnorderedStructureSignature = (graph: DocsGraph) => {
  const nodes: string[] = []
  const edges: string[] = []

  const visitSidebarNode = (node: DocsSidebarNode, parentKey: string) => {
    const nodeKey = `${node.kind}:${node.id}`
    nodes.push(nodeKey)
    edges.push(`${parentKey}->${nodeKey}`)

    if (node.kind === 'group') {
      for (const child of node.items) {
        visitSidebarNode(child, nodeKey)
      }
    }
  }

  for (const section of graph.items) {
    const sectionKey = `section:${section.id}`
    nodes.push(sectionKey)

    for (const child of section.items) {
      visitSidebarNode(child, sectionKey)
    }
  }

  return {
    nodes: nodes.sort(),
    edges: edges.sort(),
  }
}

const getOrderedStructureSignature = (graph: DocsGraph) => {
  const nodes: string[] = []
  const edges: string[] = []

  const visitSidebarNode = (node: DocsSidebarNode, parentKey: string, position: number) => {
    const nodeKey = `${node.kind}:${node.id}`
    nodes.push(nodeKey)
    edges.push(`${parentKey}->${nodeKey}@${position}`)

    if (node.kind === 'group') {
      node.items.forEach((child, childPosition) => {
        visitSidebarNode(child, nodeKey, childPosition)
      })
    }
  }

  graph.items.forEach((section, sectionPosition) => {
    const sectionKey = `section:${section.id}`
    nodes.push(sectionKey)
    edges.push(`root->${sectionKey}@${sectionPosition}`)

    section.items.forEach((child, childPosition) => {
      visitSidebarNode(child, sectionKey, childPosition)
    })
  })

  return {
    nodes: nodes.sort(),
    edges: edges.sort(),
  }
}

const collectResolvedSidebarOrder = (resolved: ResolvedDocsConfig) => {
  const order: string[] = []

  const visit = (nodes: ResolvedSidebarNode[]) => {
    for (const node of nodes) {
      order.push(`${node.kind}:${node.id}`)
      if (node.kind === 'group') {
        visit(node.items)
      }
    }
  }

  for (const section of resolved.sections) {
    visit(section.items)
  }

  return order
}

const collectVisibleSidebarOrder = (resolved: ResolvedDocsConfig) => {
  const order: string[] = []

  const visit = (nodes: ResolvedSidebarNode[]) => {
    for (const node of nodes) {
      if (!node.showInNav) {
        continue
      }

      order.push(`${node.kind}:${node.id}`)
      if (node.kind === 'group') {
        visit(node.items)
      }
    }
  }

  for (const section of resolved.sections) {
    visit(section.items)
  }

  return order
}

const createConfig = (graph: DocsGraph): DocsConfig => ({
  siteTitle: 'Order semantics fixture',
  basePath: '/docs',
  graph,
})

test('unordered structure is unchanged by sibling page reordering', () => {
  assert.deepEqual(getUnorderedStructureSignature(orderedABCGraph), getUnorderedStructureSignature(orderedCABGraph))
})

test('ordered structure distinguishes sibling page reordering', () => {
  assert.notDeepEqual(getOrderedStructureSignature(orderedABCGraph), getOrderedStructureSignature(orderedCABGraph))
})

test('current resolver preserves input page order in its flat page projection', () => {
  const resolvedABC = resolveDocsConfig(createConfig(orderedABCGraph))
  const resolvedCAB = resolveDocsConfig(createConfig(orderedCABGraph))

  assert.deepEqual(
    resolvedABC.pages.map((page) => page.id),
    ['a', 'b', 'c', 'd'],
  )
  assert.deepEqual(
    resolvedCAB.pages.map((page) => page.id),
    ['c', 'a', 'b', 'd'],
  )
})

test('current resolver preserves nested input order in its sidebar projection', () => {
  const resolvedABC = resolveDocsConfig(createConfig(orderedABCGraph))
  const resolvedCAB = resolveDocsConfig(createConfig(orderedCABGraph))

  assert.deepEqual(collectResolvedSidebarOrder(resolvedABC), [
    'group:alpha',
    'page:a',
    'page:b',
    'page:c',
    'group:beta',
    'page:d',
  ])
  assert.deepEqual(collectResolvedSidebarOrder(resolvedCAB), [
    'group:alpha',
    'page:c',
    'page:a',
    'page:b',
    'group:beta',
    'page:d',
  ])
})

test('showInNav false hides a page only from the visible sidebar projection', () => {
  const resolved = resolveDocsConfig(createConfig(hiddenBGraph))
  const alpha = resolved.sections[0]?.items.find((node) => node.kind === 'group' && node.id === 'alpha')
  const pageB = alpha?.kind === 'group' ? alpha.items.find((node) => node.id === 'b') : undefined

  assert.ok(resolved.pages.some((page) => page.id === 'b'))
  assert.equal(pageB?.kind, 'page')
  assert.equal(pageB?.showInNav, false)
  assert.ok(collectResolvedSidebarOrder(resolved).includes('page:b'))
  assert.ok(!collectVisibleSidebarOrder(resolved).includes('page:b'))
  assert.deepEqual(getUnorderedStructureSignature(hiddenBGraph), getUnorderedStructureSignature(orderedABCGraph))
})

test('current resolver preserves reordered groups while topology remains unchanged', () => {
  const resolvedReference = resolveDocsConfig(createConfig(orderedABCGraph))
  const resolvedReordered = resolveDocsConfig(createConfig(reorderedGroupsGraph))

  assert.deepEqual(
    getUnorderedStructureSignature(orderedABCGraph),
    getUnorderedStructureSignature(reorderedGroupsGraph),
  )
  assert.notDeepEqual(getOrderedStructureSignature(orderedABCGraph), getOrderedStructureSignature(reorderedGroupsGraph))
  assert.deepEqual(
    resolvedReference.sections[0]?.items.map((node) => node.id),
    ['alpha', 'beta'],
  )
  assert.deepEqual(
    resolvedReordered.sections[0]?.items.map((node) => node.id),
    ['beta', 'alpha'],
  )
})

test('moving a page to another group changes topology rather than only order', () => {
  const reference = getUnorderedStructureSignature(orderedABCGraph)
  const moved = getUnorderedStructureSignature(movedPageGraph)

  assert.notDeepEqual(reference, moved)
  assert.ok(reference.edges.includes('group:alpha->page:b'))
  assert.ok(!reference.edges.includes('group:beta->page:b'))
  assert.ok(!moved.edges.includes('group:alpha->page:b'))
  assert.ok(moved.edges.includes('group:beta->page:b'))
})

test('current resolver projections are deterministic for repeated identical inputs', () => {
  const projections = Array.from({ length: 3 }, () => {
    const resolved = resolveDocsConfig(createConfig(orderedCABGraph))

    return {
      pages: resolved.pages.map((page) => page.id),
      groups: resolved.sections[0]?.items.map((node) => node.id),
      sidebar: collectResolvedSidebarOrder(resolved),
      visibleSidebar: collectVisibleSidebarOrder(resolved),
    }
  })

  assert.deepEqual(projections[1], projections[0])
  assert.deepEqual(projections[2], projections[0])
})
