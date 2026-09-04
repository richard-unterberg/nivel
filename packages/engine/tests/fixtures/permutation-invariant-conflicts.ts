import type { DocsGraph } from '../../src/docs/types.ts'

export type FixtureClaimKind = 'slug' | 'alias'

type FixtureConflict = {
  kind: 'slug-slug' | 'alias-alias' | 'alias-slug'
  normalizedValue: string
  participants: Array<{
    pageId: string
    claimKind: FixtureClaimKind
  }>
}

export type EquivalentConflictPair = {
  matrixId: string
  semanticallyEquivalent: true
  variantA: DocsGraph
  variantB: DocsGraph
  conflicts: FixtureConflict[]
}

export type TopologyChangePair = {
  matrixId: 'M08'
  semanticallyEquivalent: false
  exclusionReason: 'parent-child-topology-changed'
  variantA: DocsGraph
  variantB: DocsGraph
  conflicts: []
}

const m01SlugSlugVariantA = {
  items: [
    {
      kind: 'section',
      id: 'm01-section',
      title: 'm01-section',
      href: '/docs/shared-slug',
      items: [
        {
          kind: 'group',
          id: 'm01-group',
          title: 'm01-group',
          items: [
            {
              kind: 'page',
              id: 'm01-slug-a',
              title: 'm01-slug-a',
              slug: 'shared-slug',
              source: 'm01-slug-a.mdx',
            },
            {
              kind: 'page',
              id: 'm01-slug-b',
              title: 'm01-slug-b',
              slug: 'shared-slug',
              source: 'm01-slug-b.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

const m01SlugSlugVariantB = {
  items: [
    {
      kind: 'section',
      id: 'm01-section',
      title: 'm01-section',
      href: '/docs/shared-slug',
      items: [
        {
          kind: 'group',
          id: 'm01-group',
          title: 'm01-group',
          items: [
            {
              kind: 'page',
              id: 'm01-slug-b',
              title: 'm01-slug-b',
              slug: 'shared-slug',
              source: 'm01-slug-b.mdx',
            },
            {
              kind: 'page',
              id: 'm01-slug-a',
              title: 'm01-slug-a',
              slug: 'shared-slug',
              source: 'm01-slug-a.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const m01SlugSlugPair = {
  matrixId: 'M01',
  semanticallyEquivalent: true,
  variantA: m01SlugSlugVariantA,
  variantB: m01SlugSlugVariantB,
  conflicts: [
    {
      kind: 'slug-slug',
      normalizedValue: 'shared-slug',
      participants: [
        { pageId: 'm01-slug-a', claimKind: 'slug' },
        { pageId: 'm01-slug-b', claimKind: 'slug' },
      ],
    },
  ],
} satisfies EquivalentConflictPair

const m02AliasAliasVariantA = {
  items: [
    {
      kind: 'section',
      id: 'm02-section',
      title: 'm02-section',
      href: '/docs/alias-owner-a',
      items: [
        {
          kind: 'group',
          id: 'm02-group',
          title: 'm02-group',
          items: [
            {
              kind: 'page',
              id: 'm02-alias-a',
              title: 'm02-alias-a',
              slug: 'alias-owner-a',
              aliases: ['shared-alias'],
              source: 'm02-alias-a.mdx',
            },
            {
              kind: 'page',
              id: 'm02-alias-b',
              title: 'm02-alias-b',
              slug: 'alias-owner-b',
              aliases: ['shared-alias'],
              source: 'm02-alias-b.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

const m02AliasAliasVariantB = {
  items: [
    {
      kind: 'section',
      id: 'm02-section',
      title: 'm02-section',
      href: '/docs/alias-owner-a',
      items: [
        {
          kind: 'group',
          id: 'm02-group',
          title: 'm02-group',
          items: [
            {
              kind: 'page',
              id: 'm02-alias-b',
              title: 'm02-alias-b',
              slug: 'alias-owner-b',
              aliases: ['shared-alias'],
              source: 'm02-alias-b.mdx',
            },
            {
              kind: 'page',
              id: 'm02-alias-a',
              title: 'm02-alias-a',
              slug: 'alias-owner-a',
              aliases: ['shared-alias'],
              source: 'm02-alias-a.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const m02AliasAliasPair = {
  matrixId: 'M02',
  semanticallyEquivalent: true,
  variantA: m02AliasAliasVariantA,
  variantB: m02AliasAliasVariantB,
  conflicts: [
    {
      kind: 'alias-alias',
      normalizedValue: 'shared-alias',
      participants: [
        { pageId: 'm02-alias-a', claimKind: 'alias' },
        { pageId: 'm02-alias-b', claimKind: 'alias' },
      ],
    },
  ],
} satisfies EquivalentConflictPair

const m03AliasSlugVariantA = {
  items: [
    {
      kind: 'section',
      id: 'm03-section',
      title: 'm03-section',
      href: '/docs/api',
      items: [
        {
          kind: 'group',
          id: 'm03-group',
          title: 'm03-group',
          items: [
            {
              kind: 'page',
              id: 'm03-alias-owner',
              title: 'm03-alias-owner',
              slug: 'legacy-api',
              aliases: ['api'],
              source: 'm03-alias-owner.mdx',
            },
            {
              kind: 'page',
              id: 'm03-slug-owner',
              title: 'm03-slug-owner',
              slug: 'api',
              source: 'm03-slug-owner.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

const m03AliasSlugVariantB = {
  items: [
    {
      kind: 'section',
      id: 'm03-section',
      title: 'm03-section',
      href: '/docs/api',
      items: [
        {
          kind: 'group',
          id: 'm03-group',
          title: 'm03-group',
          items: [
            {
              kind: 'page',
              id: 'm03-slug-owner',
              title: 'm03-slug-owner',
              slug: 'api',
              source: 'm03-slug-owner.mdx',
            },
            {
              kind: 'page',
              id: 'm03-alias-owner',
              title: 'm03-alias-owner',
              slug: 'legacy-api',
              aliases: ['api'],
              source: 'm03-alias-owner.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const m03AliasSlugPair = {
  matrixId: 'M03',
  semanticallyEquivalent: true,
  variantA: m03AliasSlugVariantA,
  variantB: m03AliasSlugVariantB,
  conflicts: [
    {
      kind: 'alias-slug',
      normalizedValue: 'api',
      participants: [
        { pageId: 'm03-alias-owner', claimKind: 'alias' },
        { pageId: 'm03-slug-owner', claimKind: 'slug' },
      ],
    },
  ],
} satisfies EquivalentConflictPair

const m04NormalizedAliasSlugVariantA = {
  items: [
    {
      kind: 'section',
      id: 'm04-section',
      title: 'm04-section',
      href: '/docs/normalized-api',
      items: [
        {
          kind: 'group',
          id: 'm04-group',
          title: 'm04-group',
          items: [
            {
              kind: 'page',
              id: 'm04-alias-owner',
              title: 'm04-alias-owner',
              slug: 'legacy-normalized-api',
              aliases: ['/normalized-api/'],
              source: 'm04-alias-owner.mdx',
            },
            {
              kind: 'page',
              id: 'm04-slug-owner',
              title: 'm04-slug-owner',
              slug: 'normalized-api',
              source: 'm04-slug-owner.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

const m04NormalizedAliasSlugVariantB = {
  items: [
    {
      kind: 'section',
      id: 'm04-section',
      title: 'm04-section',
      href: '/docs/normalized-api',
      items: [
        {
          kind: 'group',
          id: 'm04-group',
          title: 'm04-group',
          items: [
            {
              kind: 'page',
              id: 'm04-slug-owner',
              title: 'm04-slug-owner',
              slug: 'normalized-api',
              source: 'm04-slug-owner.mdx',
            },
            {
              kind: 'page',
              id: 'm04-alias-owner',
              title: 'm04-alias-owner',
              slug: 'legacy-normalized-api',
              aliases: ['/normalized-api/'],
              source: 'm04-alias-owner.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const m04NormalizedAliasSlugPair = {
  matrixId: 'M04',
  semanticallyEquivalent: true,
  variantA: m04NormalizedAliasSlugVariantA,
  variantB: m04NormalizedAliasSlugVariantB,
  conflicts: [
    {
      kind: 'alias-slug',
      normalizedValue: 'normalized-api',
      participants: [
        { pageId: 'm04-alias-owner', claimKind: 'alias' },
        { pageId: 'm04-slug-owner', claimKind: 'slug' },
      ],
    },
  ],
} satisfies EquivalentConflictPair

const m05CollisionFreeVariantA = {
  items: [
    {
      kind: 'section',
      id: 'm05-section',
      title: 'm05-section',
      href: '/docs/overview',
      items: [
        {
          kind: 'group',
          id: 'm05-group',
          title: 'm05-group',
          items: [
            {
              kind: 'page',
              id: 'm05-overview',
              title: 'm05-overview',
              slug: 'overview',
              aliases: ['/start/'],
              source: 'm05-overview.mdx',
            },
            {
              kind: 'page',
              id: 'm05-guide',
              title: 'm05-guide',
              slug: 'guide',
              aliases: ['/guide-v1/'],
              source: 'm05-guide.mdx',
            },
            {
              kind: 'page',
              id: 'm05-reference',
              title: 'm05-reference',
              slug: 'reference',
              source: 'm05-reference.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

const m05CollisionFreeVariantB = {
  items: [
    {
      kind: 'section',
      id: 'm05-section',
      title: 'm05-section',
      href: '/docs/overview',
      items: [
        {
          kind: 'group',
          id: 'm05-group',
          title: 'm05-group',
          items: [
            {
              kind: 'page',
              id: 'm05-reference',
              title: 'm05-reference',
              slug: 'reference',
              source: 'm05-reference.mdx',
            },
            {
              kind: 'page',
              id: 'm05-overview',
              title: 'm05-overview',
              slug: 'overview',
              aliases: ['/start/'],
              source: 'm05-overview.mdx',
            },
            {
              kind: 'page',
              id: 'm05-guide',
              title: 'm05-guide',
              slug: 'guide',
              aliases: ['/guide-v1/'],
              source: 'm05-guide.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const m05CollisionFreePair = {
  matrixId: 'M05',
  semanticallyEquivalent: true,
  variantA: m05CollisionFreeVariantA,
  variantB: m05CollisionFreeVariantB,
  conflicts: [],
} satisfies EquivalentConflictPair

const m06NestedGroupsVariantA = {
  items: [
    {
      kind: 'section',
      id: 'm06-section',
      title: 'm06-section',
      href: '/docs/nested-api',
      items: [
        {
          kind: 'group',
          id: 'm06-root',
          title: 'm06-root',
          items: [
            {
              kind: 'group',
              id: 'm06-alias-branch',
              title: 'm06-alias-branch',
              items: [
                {
                  kind: 'page',
                  id: 'm06-alias-owner',
                  title: 'm06-alias-owner',
                  slug: 'legacy-nested-api',
                  aliases: ['nested-api'],
                  source: 'm06-alias-owner.mdx',
                },
              ],
            },
            {
              kind: 'group',
              id: 'm06-slug-branch',
              title: 'm06-slug-branch',
              items: [
                {
                  kind: 'page',
                  id: 'm06-slug-owner',
                  title: 'm06-slug-owner',
                  slug: 'nested-api',
                  source: 'm06-slug-owner.mdx',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

const m06NestedGroupsVariantB = {
  items: [
    {
      kind: 'section',
      id: 'm06-section',
      title: 'm06-section',
      href: '/docs/nested-api',
      items: [
        {
          kind: 'group',
          id: 'm06-root',
          title: 'm06-root',
          items: [
            {
              kind: 'group',
              id: 'm06-slug-branch',
              title: 'm06-slug-branch',
              items: [
                {
                  kind: 'page',
                  id: 'm06-slug-owner',
                  title: 'm06-slug-owner',
                  slug: 'nested-api',
                  source: 'm06-slug-owner.mdx',
                },
              ],
            },
            {
              kind: 'group',
              id: 'm06-alias-branch',
              title: 'm06-alias-branch',
              items: [
                {
                  kind: 'page',
                  id: 'm06-alias-owner',
                  title: 'm06-alias-owner',
                  slug: 'legacy-nested-api',
                  aliases: ['nested-api'],
                  source: 'm06-alias-owner.mdx',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const m06NestedGroupsPair = {
  matrixId: 'M06',
  semanticallyEquivalent: true,
  variantA: m06NestedGroupsVariantA,
  variantB: m06NestedGroupsVariantB,
  conflicts: [
    {
      kind: 'alias-slug',
      normalizedValue: 'nested-api',
      participants: [
        { pageId: 'm06-alias-owner', claimKind: 'alias' },
        { pageId: 'm06-slug-owner', claimKind: 'slug' },
      ],
    },
  ],
} satisfies EquivalentConflictPair

const m07SectionsVariantA = {
  items: [
    {
      kind: 'section',
      id: 'm07-alias-section',
      title: 'm07-alias-section',
      navTitle: 'm07-alias-section',
      href: '/docs/legacy-section-api',
      items: [
        {
          kind: 'page',
          id: 'm07-alias-owner',
          title: 'm07-alias-owner',
          slug: 'legacy-section-api',
          aliases: ['section-api'],
          source: 'm07-alias-owner.mdx',
        },
      ],
    },
    {
      kind: 'section',
      id: 'm07-slug-section',
      title: 'm07-slug-section',
      navTitle: 'm07-slug-section',
      href: '/docs/section-api',
      items: [
        {
          kind: 'page',
          id: 'm07-slug-owner',
          title: 'm07-slug-owner',
          slug: 'section-api',
          source: 'm07-slug-owner.mdx',
        },
      ],
    },
  ],
} satisfies DocsGraph

const m07SectionsVariantB = {
  items: [
    {
      kind: 'section',
      id: 'm07-slug-section',
      title: 'm07-slug-section',
      navTitle: 'm07-slug-section',
      href: '/docs/section-api',
      items: [
        {
          kind: 'page',
          id: 'm07-slug-owner',
          title: 'm07-slug-owner',
          slug: 'section-api',
          source: 'm07-slug-owner.mdx',
        },
      ],
    },
    {
      kind: 'section',
      id: 'm07-alias-section',
      title: 'm07-alias-section',
      navTitle: 'm07-alias-section',
      href: '/docs/legacy-section-api',
      items: [
        {
          kind: 'page',
          id: 'm07-alias-owner',
          title: 'm07-alias-owner',
          slug: 'legacy-section-api',
          aliases: ['section-api'],
          source: 'm07-alias-owner.mdx',
        },
      ],
    },
  ],
} satisfies DocsGraph

export const m07SectionsPair = {
  matrixId: 'M07',
  semanticallyEquivalent: true,
  variantA: m07SectionsVariantA,
  variantB: m07SectionsVariantB,
  conflicts: [
    {
      kind: 'alias-slug',
      normalizedValue: 'section-api',
      participants: [
        { pageId: 'm07-alias-owner', claimKind: 'alias' },
        { pageId: 'm07-slug-owner', claimKind: 'slug' },
      ],
    },
  ],
} satisfies EquivalentConflictPair

const m08TopologyChangeVariantA = {
  items: [
    {
      kind: 'section',
      id: 'm08-section',
      title: 'm08-section',
      href: '/docs/topology-a',
      items: [
        {
          kind: 'group',
          id: 'm08-alpha',
          title: 'm08-alpha',
          items: [
            {
              kind: 'page',
              id: 'm08-anchor-a',
              title: 'm08-anchor-a',
              slug: 'topology-a',
              source: 'm08-anchor-a.mdx',
            },
            {
              kind: 'page',
              id: 'm08-moved',
              title: 'm08-moved',
              slug: 'topology-moved',
              source: 'm08-moved.mdx',
            },
          ],
        },
        {
          kind: 'group',
          id: 'm08-beta',
          title: 'm08-beta',
          items: [
            {
              kind: 'page',
              id: 'm08-anchor-b',
              title: 'm08-anchor-b',
              slug: 'topology-b',
              source: 'm08-anchor-b.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

const m08TopologyChangeVariantB = {
  items: [
    {
      kind: 'section',
      id: 'm08-section',
      title: 'm08-section',
      href: '/docs/topology-a',
      items: [
        {
          kind: 'group',
          id: 'm08-alpha',
          title: 'm08-alpha',
          items: [
            {
              kind: 'page',
              id: 'm08-anchor-a',
              title: 'm08-anchor-a',
              slug: 'topology-a',
              source: 'm08-anchor-a.mdx',
            },
          ],
        },
        {
          kind: 'group',
          id: 'm08-beta',
          title: 'm08-beta',
          items: [
            {
              kind: 'page',
              id: 'm08-anchor-b',
              title: 'm08-anchor-b',
              slug: 'topology-b',
              source: 'm08-anchor-b.mdx',
            },
            {
              kind: 'page',
              id: 'm08-moved',
              title: 'm08-moved',
              slug: 'topology-moved',
              source: 'm08-moved.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const m08TopologyChangePair = {
  matrixId: 'M08',
  semanticallyEquivalent: false,
  exclusionReason: 'parent-child-topology-changed',
  variantA: m08TopologyChangeVariantA,
  variantB: m08TopologyChangeVariantB,
  conflicts: [],
} satisfies TopologyChangePair

const m09MultipleConflictsVariantA = {
  items: [
    {
      kind: 'section',
      id: 'm09-section',
      title: 'm09-section',
      href: '/docs/multi-slug',
      items: [
        {
          kind: 'group',
          id: 'm09-group',
          title: 'm09-group',
          items: [
            {
              kind: 'page',
              id: 'm09-slug-a',
              title: 'm09-slug-a',
              slug: 'multi-slug',
              source: 'm09-slug-a.mdx',
            },
            {
              kind: 'page',
              id: 'm09-slug-b',
              title: 'm09-slug-b',
              slug: 'multi-slug',
              source: 'm09-slug-b.mdx',
            },
            {
              kind: 'page',
              id: 'm09-alias-a',
              title: 'm09-alias-a',
              slug: 'multi-alias-owner-a',
              aliases: ['multi-alias'],
              source: 'm09-alias-a.mdx',
            },
            {
              kind: 'page',
              id: 'm09-alias-b',
              title: 'm09-alias-b',
              slug: 'multi-alias-owner-b',
              aliases: ['multi-alias'],
              source: 'm09-alias-b.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

const m09MultipleConflictsVariantB = {
  items: [
    {
      kind: 'section',
      id: 'm09-section',
      title: 'm09-section',
      href: '/docs/multi-slug',
      items: [
        {
          kind: 'group',
          id: 'm09-group',
          title: 'm09-group',
          items: [
            {
              kind: 'page',
              id: 'm09-alias-a',
              title: 'm09-alias-a',
              slug: 'multi-alias-owner-a',
              aliases: ['multi-alias'],
              source: 'm09-alias-a.mdx',
            },
            {
              kind: 'page',
              id: 'm09-alias-b',
              title: 'm09-alias-b',
              slug: 'multi-alias-owner-b',
              aliases: ['multi-alias'],
              source: 'm09-alias-b.mdx',
            },
            {
              kind: 'page',
              id: 'm09-slug-a',
              title: 'm09-slug-a',
              slug: 'multi-slug',
              source: 'm09-slug-a.mdx',
            },
            {
              kind: 'page',
              id: 'm09-slug-b',
              title: 'm09-slug-b',
              slug: 'multi-slug',
              source: 'm09-slug-b.mdx',
            },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const m09MultipleConflictsPair = {
  matrixId: 'M09',
  semanticallyEquivalent: true,
  variantA: m09MultipleConflictsVariantA,
  variantB: m09MultipleConflictsVariantB,
  conflicts: [
    {
      kind: 'slug-slug',
      normalizedValue: 'multi-slug',
      participants: [
        { pageId: 'm09-slug-a', claimKind: 'slug' },
        { pageId: 'm09-slug-b', claimKind: 'slug' },
      ],
    },
    {
      kind: 'alias-alias',
      normalizedValue: 'multi-alias',
      participants: [
        { pageId: 'm09-alias-a', claimKind: 'alias' },
        { pageId: 'm09-alias-b', claimKind: 'alias' },
      ],
    },
  ],
} satisfies EquivalentConflictPair

export const equivalentPermutationPairs = [
  m01SlugSlugPair,
  m02AliasAliasPair,
  m03AliasSlugPair,
  m04NormalizedAliasSlugPair,
  m05CollisionFreePair,
  m06NestedGroupsPair,
  m07SectionsPair,
  m09MultipleConflictsPair,
] satisfies EquivalentConflictPair[]
