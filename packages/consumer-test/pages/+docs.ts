import { defineDocsConfig } from '@unterberg/nivel'
import { docsGraph } from '../docs/docs.graph'

export default defineDocsConfig({
  siteTitle: 'telefunc',
  siteDescription: 'telefunc documentation',
  basePath: '/docs',
  theme: {
    light: 'telefunc-light',
    dark: 'telefunc-dark',
    defaultPreference: 'dark',
  },
  footer: {
    pagination: true,
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
  partners: {
    primary: [
      {
        name: 'Tencent Cloud',
        href: 'https://www.tencentcloud.com',
        logoLight: 'partners/tencent.svg',
      },
    ],
    gold: [
      {
        name: 'Telefunc',
        href: '#',
        logoLight: 'partners/telefunc.svg',
      },
      {
        name: 'Void(0)',
        href: '#',
        logoLight: 'partners/void-0.svg',
      },
    ],
  },
  graph: docsGraph,
})
