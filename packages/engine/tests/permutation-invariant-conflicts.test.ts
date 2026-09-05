import assert from 'node:assert/strict'
import test from 'node:test'
import { isDeepStrictEqual } from 'node:util'
import { resolveDocsConfig } from '../src/docs/resolveDocsConfig.ts'
import type {
  DocsConfig,
  DocsGraph,
  DocsPageNode,
  DocsSidebarNode,
  ResolvedDocsConfig,
  ResolvedSidebarNode,
} from '../src/docs/types.ts'
import {
  equivalentPermutationPairs,
  m01SlugSlugPair,
  m02AliasAliasPair,
  m03AliasSlugPair,
  m04NormalizedAliasSlugPair,
  m05CollisionFreePair,
  m06NestedGroupsPair,
  m07SectionsPair,
  m08TopologyChangePair,
  m09MultipleConflictsPair,
  type EquivalentConflictPair,
  type FixtureClaimKind,
} from './fixtures/permutation-invariant-conflicts.ts'

type SemanticNodeSignature = {
  nodeKey: string
  rawAttributes: Record<string, unknown>
}

type RouteClaimSignature = {
  pageId: string
  claimKind: FixtureClaimKind
  rawValue: string
  normalizedValue: string
}

type DuplicateRouteDiagnostic = {
  family: 'duplicate-page-route'
  reportedClaimKind: FixtureClaimKind
  normalizedValue: string
  errorName: string
  rawMessage: string
}

type OtherErrorDiagnostic = {
  family: 'other-error'
  reportedClaimKind: null
  normalizedValue: null
  errorName: string
  rawMessage: string
}

type SuccessObservation = {
  claims: Array<{
    pageId: string
    slug: string
    aliases: string[]
    href: string
    aliasHrefs: string[]
    sectionId: string
  }>
  projections: {
    pages: string[]
    sections: Array<{ id: string; href: string }>
    navbarItems: Array<{ id: string; href: string }>
    sidebarPreorder: string[]
  }
}

type ResolutionObservation =
  | {
      validity: 'valid'
      diagnostic: null
      success: SuccessObservation
    }
  | {
      validity: 'invalid'
      diagnostic: DuplicateRouteDiagnostic | OtherErrorDiagnostic
      success: null
    }

type PairComparison = {
  sameValidity: boolean
  sameDiagnosticFamily: boolean | null
  sameReportedClaimKind: boolean | null
  sameConflictValue: boolean | null
  sameErrorName: boolean | null
  sameRawMessage: boolean | null
  sameClaims: boolean | null
  samePageOrder: boolean | null
  sameSectionOrder: boolean | null
  sameNavbarOrder: boolean | null
  sameSidebarOrder: boolean | null
}

const normalizeFixtureRouteClaim = (value: string) => value.replace(/^\/+|\/+$/g, '')

const compareStructuredValues = (left: unknown, right: unknown) => {
  return JSON.stringify(left).localeCompare(JSON.stringify(right))
}

const collectPageClaims = (page: DocsPageNode, claims: RouteClaimSignature[]) => {
  const normalizedSlug = normalizeFixtureRouteClaim(page.slug)
  claims.push({
    pageId: page.id,
    claimKind: 'slug',
    rawValue: page.slug,
    normalizedValue: normalizedSlug,
  })

  const normalizedAliases = new Set<string>()
  for (const rawAlias of page.aliases ?? []) {
    const normalizedAlias = normalizeFixtureRouteClaim(rawAlias)
    if (!normalizedAlias || normalizedAlias === normalizedSlug || normalizedAliases.has(normalizedAlias)) {
      continue
    }

    normalizedAliases.add(normalizedAlias)
    claims.push({
      pageId: page.id,
      claimKind: 'alias',
      rawValue: rawAlias,
      normalizedValue: normalizedAlias,
    })
  }
}

const getUnorderedSemanticSignature = (graph: DocsGraph) => {
  const nodes: SemanticNodeSignature[] = []
  const edges: string[] = []
  const normalizedRouteClaims: RouteClaimSignature[] = []

  const visitSidebarNode = (node: DocsSidebarNode, parentKey: string) => {
    const nodeKey = `${node.kind}:${node.id}`
    edges.push(`${parentKey}->${nodeKey}`)

    if (node.kind === 'group') {
      nodes.push({
        nodeKey,
        rawAttributes: {
          kind: node.kind,
          id: node.id,
          title: node.title,
          href: node.href,
          showInNav: node.showInNav,
          collapsible: node.collapsible ? { isDefaultOpen: node.collapsible.isDefaultOpen } : undefined,
          icon: node.icon,
        },
      })

      for (const child of node.items) {
        visitSidebarNode(child, nodeKey)
      }
      return
    }

    nodes.push({
      nodeKey,
      rawAttributes: {
        kind: node.kind,
        id: node.id,
        title: node.title,
        slug: node.slug,
        aliases: node.aliases ? [...node.aliases] : undefined,
        source: node.source,
        showInNav: node.showInNav,
        tableOfContents: node.tableOfContents,
        navTitle: node.navTitle,
        description: node.description,
        icon: node.icon,
      },
    })
    collectPageClaims(node, normalizedRouteClaims)
  }

  for (const section of graph.items) {
    const sectionKey = `section:${section.id}`
    nodes.push({
      nodeKey: sectionKey,
      rawAttributes: {
        kind: section.kind,
        id: section.id,
        title: section.title,
        navTitle: section.navTitle,
        href: section.href,
        icon: section.icon,
      },
    })
    edges.push(`root->${sectionKey}`)

    for (const child of section.items) {
      visitSidebarNode(child, sectionKey)
    }
  }

  return {
    nodes: nodes.sort(compareStructuredValues),
    edges: edges.sort(),
    normalizedRouteClaims: normalizedRouteClaims.sort(compareStructuredValues),
  }
}

const getOrderedTraversalSignature = (graph: DocsGraph) => {
  const positionedEdges: string[] = []

  const visitSidebarNode = (node: DocsSidebarNode, parentKey: string, position: number) => {
    const nodeKey = `${node.kind}:${node.id}`
    positionedEdges.push(`${parentKey}->${nodeKey}@${position}`)

    if (node.kind === 'group') {
      node.items.forEach((child, childPosition) => {
        visitSidebarNode(child, nodeKey, childPosition)
      })
    }
  }

  graph.items.forEach((section, sectionPosition) => {
    const sectionKey = `section:${section.id}`
    positionedEdges.push(`root->${sectionKey}@${sectionPosition}`)

    section.items.forEach((child, childPosition) => {
      visitSidebarNode(child, sectionKey, childPosition)
    })
  })

  return positionedEdges.sort()
}

const collectSidebarPreorder = (resolved: ResolvedDocsConfig) => {
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

const createConfig = (graph: DocsGraph): DocsConfig => ({
  siteTitle: 'AP2 2.3 fixture',
  basePath: '/docs',
  graph,
})

const observeResolution = (config: DocsConfig): ResolutionObservation => {
  try {
    const resolved = resolveDocsConfig(config)
    return {
      validity: 'valid',
      diagnostic: null,
      success: {
        claims: resolved.pages
          .map((page) => ({
            pageId: page.id,
            slug: page.slug,
            aliases: [...page.aliases],
            href: page.href,
            aliasHrefs: [...page.aliasHrefs],
            sectionId: page.sectionId,
          }))
          .sort((left, right) => left.pageId.localeCompare(right.pageId)),
        projections: {
          pages: resolved.pages.map((page) => page.id),
          sections: resolved.sections.map((section) => ({ id: section.id, href: section.href })),
          navbarItems: resolved.navbarItems.map((item) => ({ id: item.id, href: item.href })),
          sidebarPreorder: collectSidebarPreorder(resolved),
        },
      },
    }
  } catch (error: unknown) {
    const errorName = error instanceof Error ? error.name : 'NonErrorThrow'
    const rawMessage = error instanceof Error ? error.message : String(error)
    const routeConflictMatch = /^Duplicate docs page (slug|alias) "([^"]+)"\.$/.exec(rawMessage)

    if (routeConflictMatch) {
      return {
        validity: 'invalid',
        diagnostic: {
          family: 'duplicate-page-route',
          reportedClaimKind: routeConflictMatch[1] as FixtureClaimKind,
          normalizedValue: routeConflictMatch[2] ?? '',
          errorName,
          rawMessage,
        },
        success: null,
      }
    }

    return {
      validity: 'invalid',
      diagnostic: {
        family: 'other-error',
        reportedClaimKind: null,
        normalizedValue: null,
        errorName,
        rawMessage,
      },
      success: null,
    }
  }
}

const compareObservations = (variantA: ResolutionObservation, variantB: ResolutionObservation): PairComparison => {
  const bothInvalid = variantA.validity === 'invalid' && variantB.validity === 'invalid'
  const bothValid = variantA.validity === 'valid' && variantB.validity === 'valid'

  return {
    sameValidity: variantA.validity === variantB.validity,
    sameDiagnosticFamily: bothInvalid ? variantA.diagnostic.family === variantB.diagnostic.family : null,
    sameReportedClaimKind: bothInvalid
      ? variantA.diagnostic.reportedClaimKind === variantB.diagnostic.reportedClaimKind
      : null,
    sameConflictValue: bothInvalid ? variantA.diagnostic.normalizedValue === variantB.diagnostic.normalizedValue : null,
    sameErrorName: bothInvalid ? variantA.diagnostic.errorName === variantB.diagnostic.errorName : null,
    sameRawMessage: bothInvalid ? variantA.diagnostic.rawMessage === variantB.diagnostic.rawMessage : null,
    sameClaims: bothValid ? isDeepStrictEqual(variantA.success.claims, variantB.success.claims) : null,
    samePageOrder: bothValid
      ? isDeepStrictEqual(variantA.success.projections.pages, variantB.success.projections.pages)
      : null,
    sameSectionOrder: bothValid
      ? isDeepStrictEqual(variantA.success.projections.sections, variantB.success.projections.sections)
      : null,
    sameNavbarOrder: bothValid
      ? isDeepStrictEqual(variantA.success.projections.navbarItems, variantB.success.projections.navbarItems)
      : null,
    sameSidebarOrder: bothValid
      ? isDeepStrictEqual(variantA.success.projections.sidebarPreorder, variantB.success.projections.sidebarPreorder)
      : null,
  }
}

const observePair = (pair: { variantA: DocsGraph; variantB: DocsGraph }) => {
  return {
    variantA: observeResolution(createConfig(pair.variantA)),
    variantB: observeResolution(createConfig(pair.variantB)),
  }
}

const assertKnownConflictParticipants = (
  pair: EquivalentConflictPair,
  normalizedRouteClaims: RouteClaimSignature[],
  variantLabel: 'A' | 'B',
) => {
  for (const conflict of pair.conflicts) {
    const expectedClaims = conflict.participants
      .map((participant) => ({
        pageId: participant.pageId,
        claimKind: participant.claimKind,
        normalizedValue: conflict.normalizedValue,
      }))
      .sort(compareStructuredValues)
    const actualClaims = normalizedRouteClaims
      .filter((claim) => claim.normalizedValue === conflict.normalizedValue)
      .map((claim) => ({
        pageId: claim.pageId,
        claimKind: claim.claimKind,
        normalizedValue: claim.normalizedValue,
      }))
      .sort(compareStructuredValues)

    assert.deepEqual(
      actualClaims,
      expectedClaims,
      `${pair.matrixId} variant ${variantLabel} fixture metadata must name every claimant for ${conflict.normalizedValue}`,
    )
  }
}

const assertEquivalentPermutation = (pair: EquivalentConflictPair) => {
  const variantA = getUnorderedSemanticSignature(pair.variantA)
  const variantB = getUnorderedSemanticSignature(pair.variantB)

  assert.equal(pair.semanticallyEquivalent, true)
  assert.deepEqual(variantA, variantB)
  assert.notDeepEqual(getOrderedTraversalSignature(pair.variantA), getOrderedTraversalSignature(pair.variantB))
  assertKnownConflictParticipants(pair, variantA.normalizedRouteClaims, 'A')
  assertKnownConflictParticipants(pair, variantB.normalizedRouteClaims, 'B')
}

const createDuplicateRouteFailure = (
  reportedClaimKind: FixtureClaimKind,
  normalizedValue: string,
): ResolutionObservation => ({
  validity: 'invalid',
  diagnostic: {
    family: 'duplicate-page-route',
    reportedClaimKind,
    normalizedValue,
    errorName: 'Error',
    rawMessage: `Duplicate docs page ${reportedClaimKind} "${normalizedValue}".`,
  },
  success: null,
})

const m05ClaimsBaseline = [
  {
    pageId: 'm05-guide',
    slug: 'guide',
    aliases: ['guide-v1'],
    href: '/docs/guide/',
    aliasHrefs: ['/docs/guide-v1/'],
    sectionId: 'm05-section',
  },
  {
    pageId: 'm05-overview',
    slug: 'overview',
    aliases: ['start'],
    href: '/docs/overview/',
    aliasHrefs: ['/docs/start/'],
    sectionId: 'm05-section',
  },
  {
    pageId: 'm05-reference',
    slug: 'reference',
    aliases: [],
    href: '/docs/reference/',
    aliasHrefs: [],
    sectionId: 'm05-section',
  },
]

const m05VariantABaseline = {
  validity: 'valid',
  diagnostic: null,
  success: {
    claims: m05ClaimsBaseline,
    projections: {
      pages: ['m05-overview', 'm05-guide', 'm05-reference'],
      sections: [{ id: 'm05-section', href: '/docs/overview/' }],
      navbarItems: [{ id: 'm05-section', href: '/docs/overview/' }],
      sidebarPreorder: ['group:m05-group', 'page:m05-overview', 'page:m05-guide', 'page:m05-reference'],
    },
  },
} satisfies ResolutionObservation

const m05VariantBBaseline = {
  validity: 'valid',
  diagnostic: null,
  success: {
    claims: m05ClaimsBaseline,
    projections: {
      pages: ['m05-reference', 'm05-overview', 'm05-guide'],
      sections: [{ id: 'm05-section', href: '/docs/overview/' }],
      navbarItems: [{ id: 'm05-section', href: '/docs/overview/' }],
      sidebarPreorder: ['group:m05-group', 'page:m05-reference', 'page:m05-overview', 'page:m05-guide'],
    },
  },
} satisfies ResolutionObservation

const m08ClaimsBaseline = [
  {
    pageId: 'm08-anchor-a',
    slug: 'topology-a',
    aliases: [],
    href: '/docs/topology-a/',
    aliasHrefs: [],
    sectionId: 'm08-section',
  },
  {
    pageId: 'm08-anchor-b',
    slug: 'topology-b',
    aliases: [],
    href: '/docs/topology-b/',
    aliasHrefs: [],
    sectionId: 'm08-section',
  },
  {
    pageId: 'm08-moved',
    slug: 'topology-moved',
    aliases: [],
    href: '/docs/topology-moved/',
    aliasHrefs: [],
    sectionId: 'm08-section',
  },
]

const m08VariantABaseline = {
  validity: 'valid',
  diagnostic: null,
  success: {
    claims: m08ClaimsBaseline,
    projections: {
      pages: ['m08-anchor-a', 'm08-moved', 'm08-anchor-b'],
      sections: [{ id: 'm08-section', href: '/docs/topology-a/' }],
      navbarItems: [{ id: 'm08-section', href: '/docs/topology-a/' }],
      sidebarPreorder: [
        'group:m08-alpha',
        'page:m08-anchor-a',
        'page:m08-moved',
        'group:m08-beta',
        'page:m08-anchor-b',
      ],
    },
  },
} satisfies ResolutionObservation

const m08VariantBBaseline = {
  validity: 'valid',
  diagnostic: null,
  success: {
    claims: m08ClaimsBaseline,
    projections: {
      pages: ['m08-anchor-a', 'm08-anchor-b', 'm08-moved'],
      sections: [{ id: 'm08-section', href: '/docs/topology-a/' }],
      navbarItems: [{ id: 'm08-section', href: '/docs/topology-a/' }],
      sidebarPreorder: [
        'group:m08-alpha',
        'page:m08-anchor-a',
        'group:m08-beta',
        'page:m08-anchor-b',
        'page:m08-moved',
      ],
    },
  },
} satisfies ResolutionObservation

test('M01 baseline fixture variants are equivalent permutations', () => {
  assertEquivalentPermutation(m01SlugSlugPair)
})

test('M01 baseline variant A records the current resolver slug conflict', () => {
  assert.deepEqual(
    observeResolution(createConfig(m01SlugSlugPair.variantA)),
    createDuplicateRouteFailure('slug', 'shared-slug'),
  )
})

test('M01 baseline variant B records the current resolver slug conflict', () => {
  assert.deepEqual(
    observeResolution(createConfig(m01SlugSlugPair.variantB)),
    createDuplicateRouteFailure('slug', 'shared-slug'),
  )
})

test('M01 baseline pair comparison records matching first observable throws', () => {
  const observations = observePair(m01SlugSlugPair)
  assert.deepEqual(compareObservations(observations.variantA, observations.variantB), {
    sameValidity: true,
    sameDiagnosticFamily: true,
    sameReportedClaimKind: true,
    sameConflictValue: true,
    sameErrorName: true,
    sameRawMessage: true,
    sameClaims: null,
    samePageOrder: null,
    sameSectionOrder: null,
    sameNavbarOrder: null,
    sameSidebarOrder: null,
  })
})

test('M02 baseline fixture variants are equivalent permutations', () => {
  assertEquivalentPermutation(m02AliasAliasPair)
})

test('M02 baseline variant A records the current resolver alias conflict', () => {
  assert.deepEqual(
    observeResolution(createConfig(m02AliasAliasPair.variantA)),
    createDuplicateRouteFailure('alias', 'shared-alias'),
  )
})

test('M02 baseline variant B records the current resolver alias conflict', () => {
  assert.deepEqual(
    observeResolution(createConfig(m02AliasAliasPair.variantB)),
    createDuplicateRouteFailure('alias', 'shared-alias'),
  )
})

test('M02 baseline pair comparison records matching first observable throws', () => {
  const observations = observePair(m02AliasAliasPair)
  assert.deepEqual(compareObservations(observations.variantA, observations.variantB), {
    sameValidity: true,
    sameDiagnosticFamily: true,
    sameReportedClaimKind: true,
    sameConflictValue: true,
    sameErrorName: true,
    sameRawMessage: true,
    sameClaims: null,
    samePageOrder: null,
    sameSectionOrder: null,
    sameNavbarOrder: null,
    sameSidebarOrder: null,
  })
})

test('M03 regression fixture variants are equivalent permutations', () => {
  assertEquivalentPermutation(m03AliasSlugPair)
})

test('M03 regression variant A rejects the alias-first conflict with an alias diagnostic', () => {
  assert.deepEqual(
    observeResolution(createConfig(m03AliasSlugPair.variantA)),
    createDuplicateRouteFailure('alias', 'api'),
  )
})

test('M03 regression variant B rejects the slug-first conflict with the same alias diagnostic', () => {
  assert.deepEqual(
    observeResolution(createConfig(m03AliasSlugPair.variantB)),
    createDuplicateRouteFailure('alias', 'api'),
  )
})

test('M03 regression pair comparison records permutation-invariant validity and diagnostics', () => {
  const observations = observePair(m03AliasSlugPair)
  assert.deepEqual(compareObservations(observations.variantA, observations.variantB), {
    sameValidity: true,
    sameDiagnosticFamily: true,
    sameReportedClaimKind: true,
    sameConflictValue: true,
    sameErrorName: true,
    sameRawMessage: true,
    sameClaims: null,
    samePageOrder: null,
    sameSectionOrder: null,
    sameNavbarOrder: null,
    sameSidebarOrder: null,
  })
})

test('M04 regression fixture variants are equivalent after current route-claim normalization', () => {
  assertEquivalentPermutation(m04NormalizedAliasSlugPair)
})

test('M04 regression variant A rejects the normalized alias-first conflict with an alias diagnostic', () => {
  assert.deepEqual(
    observeResolution(createConfig(m04NormalizedAliasSlugPair.variantA)),
    createDuplicateRouteFailure('alias', 'normalized-api'),
  )
})

test('M04 regression variant B rejects the normalized slug-first conflict with the same alias diagnostic', () => {
  assert.deepEqual(
    observeResolution(createConfig(m04NormalizedAliasSlugPair.variantB)),
    createDuplicateRouteFailure('alias', 'normalized-api'),
  )
})

test('M04 regression pair comparison records permutation-invariant validity after normalization', () => {
  const observations = observePair(m04NormalizedAliasSlugPair)
  assert.deepEqual(compareObservations(observations.variantA, observations.variantB), {
    sameValidity: true,
    sameDiagnosticFamily: true,
    sameReportedClaimKind: true,
    sameConflictValue: true,
    sameErrorName: true,
    sameRawMessage: true,
    sameClaims: null,
    samePageOrder: null,
    sameSectionOrder: null,
    sameNavbarOrder: null,
    sameSidebarOrder: null,
  })
})

test('M05 baseline fixture variants are equivalent conflict-free permutations', () => {
  assertEquivalentPermutation(m05CollisionFreePair)
})

test('M05 baseline variant A records current resolver claims and declared traversal order', () => {
  assert.deepEqual(observeResolution(createConfig(m05CollisionFreePair.variantA)), m05VariantABaseline)
})

test('M05 baseline variant B records current resolver claims and permuted traversal order', () => {
  assert.deepEqual(observeResolution(createConfig(m05CollisionFreePair.variantB)), m05VariantBBaseline)
})

test('M05 baseline pair comparison separates equal claims from order-sensitive projections', () => {
  const observations = observePair(m05CollisionFreePair)
  assert.deepEqual(compareObservations(observations.variantA, observations.variantB), {
    sameValidity: true,
    sameDiagnosticFamily: null,
    sameReportedClaimKind: null,
    sameConflictValue: null,
    sameErrorName: null,
    sameRawMessage: null,
    sameClaims: true,
    samePageOrder: false,
    sameSectionOrder: true,
    sameNavbarOrder: true,
    sameSidebarOrder: false,
  })
})

test('M06 regression fixture variants preserve nested parent-child edges while permuting groups', () => {
  assertEquivalentPermutation(m06NestedGroupsPair)
})

test('M06 regression variant A rejects the nested alias-first conflict with an alias diagnostic', () => {
  assert.deepEqual(
    observeResolution(createConfig(m06NestedGroupsPair.variantA)),
    createDuplicateRouteFailure('alias', 'nested-api'),
  )
})

test('M06 regression variant B rejects the nested slug-first conflict with the same alias diagnostic', () => {
  assert.deepEqual(
    observeResolution(createConfig(m06NestedGroupsPair.variantB)),
    createDuplicateRouteFailure('alias', 'nested-api'),
  )
})

test('M06 regression pair comparison records permutation-invariant validity across nested groups', () => {
  const observations = observePair(m06NestedGroupsPair)
  assert.deepEqual(compareObservations(observations.variantA, observations.variantB), {
    sameValidity: true,
    sameDiagnosticFamily: true,
    sameReportedClaimKind: true,
    sameConflictValue: true,
    sameErrorName: true,
    sameRawMessage: true,
    sameClaims: null,
    samePageOrder: null,
    sameSectionOrder: null,
    sameNavbarOrder: null,
    sameSidebarOrder: null,
  })
})

test('M07 regression fixture variants preserve section membership while permuting sections', () => {
  assertEquivalentPermutation(m07SectionsPair)
})

test('M07 regression variant A rejects the alias-first section conflict with an alias diagnostic', () => {
  assert.deepEqual(
    observeResolution(createConfig(m07SectionsPair.variantA)),
    createDuplicateRouteFailure('alias', 'section-api'),
  )
})

test('M07 regression variant B rejects the slug-first section conflict with the same alias diagnostic', () => {
  assert.deepEqual(
    observeResolution(createConfig(m07SectionsPair.variantB)),
    createDuplicateRouteFailure('alias', 'section-api'),
  )
})

test('M07 regression pair comparison records permutation-invariant validity across sections', () => {
  const observations = observePair(m07SectionsPair)
  assert.deepEqual(compareObservations(observations.variantA, observations.variantB), {
    sameValidity: true,
    sameDiagnosticFamily: true,
    sameReportedClaimKind: true,
    sameConflictValue: true,
    sameErrorName: true,
    sameRawMessage: true,
    sameClaims: null,
    samePageOrder: null,
    sameSectionOrder: null,
    sameNavbarOrder: null,
    sameSidebarOrder: null,
  })
})

test('M08 baseline fixture metadata and signatures exclude the topology change from invariant pairs', () => {
  const variantA = getUnorderedSemanticSignature(m08TopologyChangePair.variantA)
  const variantB = getUnorderedSemanticSignature(m08TopologyChangePair.variantB)

  assert.equal(m08TopologyChangePair.semanticallyEquivalent, false)
  assert.equal(m08TopologyChangePair.exclusionReason, 'parent-child-topology-changed')
  assert.deepEqual(variantA.nodes, variantB.nodes)
  assert.deepEqual(variantA.normalizedRouteClaims, variantB.normalizedRouteClaims)
  assert.notDeepEqual(variantA.edges, variantB.edges)
  assert.notDeepEqual(variantA, variantB)
  assert.deepEqual(
    equivalentPermutationPairs.map((pair) => pair.matrixId),
    ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M09'],
  )
})

test('M08 baseline variant A records current resolver success for the original topology', () => {
  assert.deepEqual(observeResolution(createConfig(m08TopologyChangePair.variantA)), m08VariantABaseline)
})

test('M08 baseline variant B records current resolver success for the changed topology', () => {
  assert.deepEqual(observeResolution(createConfig(m08TopologyChangePair.variantB)), m08VariantBBaseline)
})

test('M08 baseline control comparison is observational and not an invariant-pair result', () => {
  const observations = observePair(m08TopologyChangePair)
  assert.deepEqual(compareObservations(observations.variantA, observations.variantB), {
    sameValidity: true,
    sameDiagnosticFamily: null,
    sameReportedClaimKind: null,
    sameConflictValue: null,
    sameErrorName: null,
    sameRawMessage: null,
    sameClaims: true,
    samePageOrder: false,
    sameSectionOrder: true,
    sameNavbarOrder: true,
    sameSidebarOrder: false,
  })
})

test('M09 baseline fixture variants are equivalent permutations with two independent conflicts', () => {
  assertEquivalentPermutation(m09MultipleConflictsPair)
})

test('M09 baseline fixture metadata has distinct conflict values and disjoint participants', () => {
  const [firstConflict, secondConflict] = m09MultipleConflictsPair.conflicts

  assert.equal(m09MultipleConflictsPair.conflicts.length, 2)
  assert.ok(firstConflict)
  assert.ok(secondConflict)
  assert.notEqual(firstConflict.normalizedValue, secondConflict.normalizedValue)

  const firstParticipants = new Set(
    firstConflict.participants.map((participant) => `${participant.pageId}:${participant.claimKind}`),
  )
  const secondParticipants = new Set(
    secondConflict.participants.map((participant) => `${participant.pageId}:${participant.claimKind}`),
  )

  assert.equal(firstParticipants.size, firstConflict.participants.length)
  assert.equal(secondParticipants.size, secondConflict.participants.length)
  for (const participant of firstParticipants) {
    assert.equal(secondParticipants.has(participant), false)
  }

  // This verifies only the controlled fixture input; the fail-fast resolver does not return a conflict set.
})

test('M09 baseline variant A records only the current resolver first observable slug throw', () => {
  assert.deepEqual(
    observeResolution(createConfig(m09MultipleConflictsPair.variantA)),
    createDuplicateRouteFailure('slug', 'multi-slug'),
  )
})

test('M09 baseline variant B records only the current resolver first observable alias throw', () => {
  assert.deepEqual(
    observeResolution(createConfig(m09MultipleConflictsPair.variantB)),
    createDuplicateRouteFailure('alias', 'multi-alias'),
  )
})

test('M09 baseline pair comparison is limited to different first observable throws', () => {
  const observations = observePair(m09MultipleConflictsPair)
  assert.deepEqual(compareObservations(observations.variantA, observations.variantB), {
    sameValidity: true,
    sameDiagnosticFamily: true,
    sameReportedClaimKind: false,
    sameConflictValue: false,
    sameErrorName: true,
    sameRawMessage: false,
    sameClaims: null,
    samePageOrder: null,
    sameSectionOrder: null,
    sameNavbarOrder: null,
    sameSidebarOrder: null,
  })
})

const assertThreeSequentialObservations = (graph: DocsGraph, expected: ResolutionObservation) => {
  const config = createConfig(graph)
  const configBeforeCalls = structuredClone(config)
  const observations = Array.from({ length: 3 }, () => observeResolution(config))

  assert.equal(observations.length, 3)
  assert.deepEqual(observations[0], expected)
  assert.deepEqual(observations[1], expected)
  assert.deepEqual(observations[2], expected)
  assert.deepEqual(config, configBeforeCalls)
}

test('M10 regression records three sequential repeat observations and unchanged input for M03 variant A', () => {
  assertThreeSequentialObservations(m03AliasSlugPair.variantA, createDuplicateRouteFailure('alias', 'api'))
})

test('M10 regression records three sequential repeat observations and unchanged input for M03 variant B', () => {
  assertThreeSequentialObservations(m03AliasSlugPair.variantB, createDuplicateRouteFailure('alias', 'api'))
})

test('M10 baseline records three sequential repeat observations and unchanged input for M05 variant A', () => {
  assertThreeSequentialObservations(m05CollisionFreePair.variantA, m05VariantABaseline)
})

test('M10 baseline records three sequential repeat observations and unchanged input for M09 variant B', () => {
  assertThreeSequentialObservations(
    m09MultipleConflictsPair.variantB,
    createDuplicateRouteFailure('alias', 'multi-alias'),
  )
})
