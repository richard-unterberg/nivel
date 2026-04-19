import type { DocsConfig } from '@unterberg/nivel'
import { docsGraph } from '../docs/docs.graph'

const docsConfig = {
  graph: docsGraph,
  siteTitle: 'telefunc',
  siteDescription: 'telefunc documentation',
  siteUrl: 'https://nivel-docs.de',
  robots: false,
  basePath: '/',
  contentDir: 'docs',
  theme: {
    light: 'telefunc-light',
    dark: 'telefunc-dark',
    defaultPreference: 'dark',
  },
  footer: {
    pagination: true,
  },
  algolia: {
    appId: 'NONXS2JSTL',
    apiKey: '9bf6a6f9bc168ca425e8e19a62cd8ba1',
    indexName: 'telefunc',
  },
  brand: {
    text: 'Telefunc',
    href: '/',
    logoLight: '/logo-light.svg',
    logoDark: '/logo-dark.svg',
    logoAlt: 'Telefunc logo',
  },
  head: {
    faviconSvg: '/favicon.svg',
    faviconIco: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png',
  },
  social: {
    github: 'https://github.com/telefunc/telefunc',
    discord: 'https://discord.com/invite/VJKjMNMguV',
    x: 'https://discord.com/invite/VJKjMNMguV',
  },
  partners: {
    primary: [
      {
        name: 'Tencent Edge One',
        href: 'https://edgeone.ai/',
        logoLight: 'partners/tencent_edgeone_dark.webp',
        logoDark: 'partners/tencent_edgeone_light.webp',
      },
    ],
  },
} satisfies DocsConfig

export default docsConfig
