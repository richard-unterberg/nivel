import type { DocsGraph } from '../../src/docs/types.ts'

export const orderedABCGraph = {
  items: [
    {
      kind: 'section',
      id: 'docs',
      title: 'Docs',
      items: [
        {
          kind: 'group',
          id: 'alpha',
          title: 'Alpha',
          items: [
            { kind: 'page', id: 'a', title: 'A', slug: 'a', source: 'a.mdx' },
            { kind: 'page', id: 'b', title: 'B', slug: 'b', source: 'b.mdx' },
            { kind: 'page', id: 'c', title: 'C', slug: 'c', source: 'c.mdx' },
          ],
        },
        {
          kind: 'group',
          id: 'beta',
          title: 'Beta',
          items: [{ kind: 'page', id: 'd', title: 'D', slug: 'd', source: 'd.mdx' }],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const orderedCABGraph = {
  items: [
    {
      kind: 'section',
      id: 'docs',
      title: 'Docs',
      items: [
        {
          kind: 'group',
          id: 'alpha',
          title: 'Alpha',
          items: [
            { kind: 'page', id: 'c', title: 'C', slug: 'c', source: 'c.mdx' },
            { kind: 'page', id: 'a', title: 'A', slug: 'a', source: 'a.mdx' },
            { kind: 'page', id: 'b', title: 'B', slug: 'b', source: 'b.mdx' },
          ],
        },
        {
          kind: 'group',
          id: 'beta',
          title: 'Beta',
          items: [{ kind: 'page', id: 'd', title: 'D', slug: 'd', source: 'd.mdx' }],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const hiddenBGraph = {
  items: [
    {
      kind: 'section',
      id: 'docs',
      title: 'Docs',
      items: [
        {
          kind: 'group',
          id: 'alpha',
          title: 'Alpha',
          items: [
            { kind: 'page', id: 'a', title: 'A', slug: 'a', source: 'a.mdx' },
            { kind: 'page', id: 'b', title: 'B', slug: 'b', source: 'b.mdx', showInNav: false },
            { kind: 'page', id: 'c', title: 'C', slug: 'c', source: 'c.mdx' },
          ],
        },
        {
          kind: 'group',
          id: 'beta',
          title: 'Beta',
          items: [{ kind: 'page', id: 'd', title: 'D', slug: 'd', source: 'd.mdx' }],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const reorderedGroupsGraph = {
  items: [
    {
      kind: 'section',
      id: 'docs',
      title: 'Docs',
      items: [
        {
          kind: 'group',
          id: 'beta',
          title: 'Beta',
          items: [{ kind: 'page', id: 'd', title: 'D', slug: 'd', source: 'd.mdx' }],
        },
        {
          kind: 'group',
          id: 'alpha',
          title: 'Alpha',
          items: [
            { kind: 'page', id: 'a', title: 'A', slug: 'a', source: 'a.mdx' },
            { kind: 'page', id: 'b', title: 'B', slug: 'b', source: 'b.mdx' },
            { kind: 'page', id: 'c', title: 'C', slug: 'c', source: 'c.mdx' },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph

export const movedPageGraph = {
  items: [
    {
      kind: 'section',
      id: 'docs',
      title: 'Docs',
      items: [
        {
          kind: 'group',
          id: 'alpha',
          title: 'Alpha',
          items: [
            { kind: 'page', id: 'a', title: 'A', slug: 'a', source: 'a.mdx' },
            { kind: 'page', id: 'c', title: 'C', slug: 'c', source: 'c.mdx' },
          ],
        },
        {
          kind: 'group',
          id: 'beta',
          title: 'Beta',
          items: [
            { kind: 'page', id: 'b', title: 'B', slug: 'b', source: 'b.mdx' },
            { kind: 'page', id: 'd', title: 'D', slug: 'd', source: 'd.mdx' },
          ],
        },
      ],
    },
  ],
} satisfies DocsGraph
