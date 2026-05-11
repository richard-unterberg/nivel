import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import type { DocsIconName } from './icons.js'

export type { DocsIconName } from './icons.js'

export type DocsCollapsible = {
  isDefaultOpen?: boolean
}

export type ThemePreference = 'light' | 'dark'

export type DocsThemeConfig = {
  light: string
  dark: string
  defaultPreference?: ThemePreference
}

export type DocsFooterConfig = {
  pagination?: boolean
}

export type DocsBrandConfig = {
  text?: string
  href?: string
  logoLight?: string
  logoDark?: string
  logoAlt?: string
}

export type DocsPartnerConfig = {
  name: string
  href: string
  logoLight: string
  logoDark?: string
  logoAlt?: string
}

export type DocsPartnersConfig = {
  primary?: DocsPartnerConfig[]
  gold?: DocsPartnerConfig[]
}

export type DocsSocialConfig = {
  github?: string
  discord?: string
  x?: string
  bluesky?: string
  linkedin?: string
}

export type DocsHeadConfig = {
  faviconSvg?: string
  faviconIco?: string
  appleTouchIcon?: string
  fontPreset?: 'inter' | 'none'
  fontStylesheetHref?: string
  fontPreloadHrefs?: string[]
}

export type TopBarNavItem = {
  label: string
  href: string
  isCta?: boolean
}

export type TopBarNavComponentsOptions = {
  components: string[]
}

export type TopBarNavOptions = false | TopBarNavItem[] | TopBarNavComponentsOptions

export type DocsPageNode = {
  kind: 'page'
  id: string
  title: string
  slug: string
  source: string
  showInNav?: boolean
  aliases?: string[]
  tableOfContents?: boolean
  navTitle?: string
  description?: string
  icon?: DocsIconName
}

export type DocsGroupNode = {
  kind: 'group'
  id: string
  title?: string
  href?: string
  showInNav?: boolean
  items: DocsSidebarNode[]
  collapsible?: DocsCollapsible
  icon?: DocsIconName
}

export type DocsSectionNode = {
  kind: 'section'
  id: string
  title: string
  navTitle?: string
  href?: string
  items: DocsSidebarNode[]
  icon?: DocsIconName
}

export type DocsSidebarNode = DocsGroupNode | DocsPageNode

export type DocsGraph = {
  items: DocsSectionNode[]
}

export type DocsConfig = {
  siteTitle: string
  siteDescription?: string
  siteUrl?: string
  robots?: boolean
  customFonts?: boolean
  basePath: string
  contentDir?: string
  graph: DocsGraph
  theme?: DocsThemeConfig
  footer?: DocsFooterConfig
  social?: DocsSocialConfig
  brand?: DocsBrandConfig
  head?: DocsHeadConfig
  partners?: DocsPartnersConfig
  topBarNav?: TopBarNavOptions
}

export type ResolvedDocsBrandConfig = {
  text: string
  href: string
  logoLight?: string
  logoDark?: string
  logoAlt: string
}

export type ResolvedDocsSocialConfig = DocsSocialConfig

export type ResolvedDocsPartnerConfig = {
  name: string
  href: string
  logoLight: string
  logoDark?: string
  logoAlt: string
}

export type ResolvedDocsPartnersConfig = {
  primary: ResolvedDocsPartnerConfig[]
  gold: ResolvedDocsPartnerConfig[]
}

export type ResolvedDocsHeadConfig = DocsHeadConfig & {
  customFonts: boolean
}

export type DocHeading = {
  depth: number
  id: string
  title: string
}

export type ResolvedDocsPage = Omit<DocsPageNode, 'aliases'> & {
  aliases: string[]
  href: string
  aliasHrefs: string[]
  tableOfContents: boolean
  documentTitle: string
  sectionId: string
}

export type ResolvedSidebarGroup = {
  kind: 'group'
  id: string
  title?: string
  href?: string
  showInNav: boolean
  items: ResolvedSidebarNode[]
  collapsible?: DocsCollapsible
  icon?: DocsIconName
}

export type ResolvedSidebarPage = {
  kind: 'page'
  id: string
  title: string
  navTitle: string
  href: string
  showInNav: boolean
  icon?: DocsIconName
}

export type ResolvedSidebarNode = ResolvedSidebarGroup | ResolvedSidebarPage

export type ResolvedDocsSection = {
  id: string
  title: string
  navTitle: string
  href: string
  items: ResolvedSidebarNode[]
  icon?: DocsIconName
}

export type ResolvedNavbarItem = {
  id: string
  title: string
  href: string
}

export type ResolvedTopBarNavItem = {
  label: string
  href: string
  isCta: boolean
}

export type ResolvedTopBarNav =
  | {
      kind: 'none'
      items: []
    }
  | {
      kind: 'links'
      items: ResolvedTopBarNavItem[]
    }
  | {
      kind: 'components'
      components: string[]
    }

export type DocsGlobalContextTopBarNav =
  | Exclude<ResolvedTopBarNav, { kind: 'components' }>
  | {
      kind: 'components'
    }

export type ResolvedDocsConfig = {
  siteTitle: string
  siteDescription: string | null
  robots: boolean
  customFonts: boolean
  basePath: string
  contentDir: string
  theme: Required<DocsThemeConfig>
  footer: Required<DocsFooterConfig>
  brand: ResolvedDocsBrandConfig
  head: ResolvedDocsHeadConfig
  social: ResolvedDocsSocialConfig
  partners: ResolvedDocsPartnersConfig
  pages: ResolvedDocsPage[]
  sections: ResolvedDocsSection[]
  navbarItems: ResolvedNavbarItem[]
  topBarNav: ResolvedTopBarNav
}

export type DocPageLinkData = Pick<ResolvedDocsPage, 'id' | 'title' | 'href' | 'documentTitle'>

export type DocsIconMap = Partial<Record<string, LucideIcon>>

export type DocsGlobalContextSerializableData = Pick<
  ResolvedDocsConfig,
  | 'siteTitle'
  | 'robots'
  | 'basePath'
  | 'theme'
  | 'footer'
  | 'brand'
  | 'head'
  | 'partners'
  | 'pages'
  | 'navbarItems'
  | 'social'
> & {
  sidebarSections: ResolvedDocsConfig['sections']
  topBarNav: DocsGlobalContextTopBarNav
}

export type DocsGlobalContextData = DocsGlobalContextSerializableData & {
  docsIconMap: DocsIconMap
  topBarNavComponents?: ComponentType[]
}

export type DocPageData = {
  page: ResolvedDocsPage
  headings: DocHeading[]
  previousPage: DocPageLinkData | null
  nextPage: DocPageLinkData | null
}
