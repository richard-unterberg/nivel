import type { DocsConfig } from '@unterberg/nivel'
import { docsGraph } from '../content/docs.graph'

const docsConfig = {
  graph: docsGraph,
  siteTitle: 'nivel documentation',
  siteDescription: 'nivel documentation',
  siteUrl: 'https://nivel-docs.de',
  robots: false,
  basePath: '/',
  contentDir: 'content',
  topBarNav: false,
  customFonts: false,
  theme: {
    light: 'telefunc-light',
    dark: 'telefunc-dark',
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
