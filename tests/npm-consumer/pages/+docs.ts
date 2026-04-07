import type { DocsConfig } from '@unterberg/nivel'
import { docsGraph } from '../docs/docs.graph'

const docsConfig = {
  graph: docsGraph,
  siteTitle: 'Nivel npm consumer',
  siteDescription: 'Minimal standalone consumer for the published @unterberg/nivel package.',
  basePath: '/docs',
  brand: {
    text: 'Nivel fixture',
    href: '/docs/getting-started/',
  },
  footer: {
    pagination: true,
  },
  theme: {
    light: 'telefunc-light',
    dark: 'telefunc-dark',
    defaultPreference: 'dark',
  },
} satisfies DocsConfig

export default docsConfig
