import type { DocsConfig } from '@unterberg/nivel'
import { docsGraph } from '../content/docs.graph'

const docsConfig = {
  graph: docsGraph,
  siteTitle: 'Nivel',
  siteDescription: 'Build structure-first documentation sites for React with Nivel.',
  siteUrl: 'https://nivel-docs.de',
  robots: true,
  basePath: '/docs/',
  contentDir: 'content',
  topBarNav: [
    { label: 'Get started', href: 'getting-started', isCta: true },
    { label: 'Concepts', href: 'docs-graph' },
    { label: 'API', href: 'public-entry-points' },
  ],
  customFonts: false,
  theme: {
    light: 'nivel-docs-light',
    dark: 'nivel-docs-dark',
    defaultPreference: 'dark',
  },
  footer: {
    pagination: true,
  },
  brand: {
    text: 'Nivel',
    href: '/',
    logoLight: '/logo-light.svg',
    logoDark: '/logo-dark.svg',
    logoAlt: 'Nivel logo',
  },
  head: {
    faviconSvg: '/favicon.svg',
    faviconIco: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png',
  },
  social: {
    github: 'https://github.com/richard-unterberg/nivel',
    editLinkBranch: 'master',
    editLinkPathPrefix: 'packages/docs',
  },
} satisfies DocsConfig

export default docsConfig
