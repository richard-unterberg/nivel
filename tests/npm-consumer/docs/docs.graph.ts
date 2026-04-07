import type { DocsGraph } from '@unterberg/nivel'

export const docsGraph = {
  items: [
    {
      kind: 'section',
      id: 'docs',
      title: 'Docs',
      items: [
        {
          kind: 'page',
          id: 'gettingStarted',
          title: 'Getting Started',
          slug: 'getting-started',
          source: 'content/getting-started/content.mdx',
          description: 'Minimal standalone consumer for validating the published @unterberg/nivel package.',
        },
      ],
    },
  ],
} satisfies DocsGraph
