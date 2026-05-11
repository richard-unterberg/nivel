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

export type JsonPrimitive = string | number | boolean | null

export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

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

export type DocsAlgoliaFieldsConfig = {
  href?: string
  title?: string
  excerpt?: string
  sectionTitle?: string
}

export type DocsAlgoliaConfig = {
  appId: string
  apiKey: string
  indexName: string
  fields?: DocsAlgoliaFieldsConfig
  searchParams?: Record<string, JsonValue>
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

export type TopBarNavComponentOptions = {
  component: string
}

export type TopBarNavOptions = false | TopBarNavItem[] | TopBarNavComponentOptions

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
  algolia?: DocsAlgoliaConfig
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

export type ResolvedDocsAlgoliaFieldsConfig = {
  href: string
  title: string
  excerpt: string
  sectionTitle: string
}

export type ResolvedDocsAlgoliaConfig = {
  appId: string
  apiKey: string
  indexName: string
  fields: ResolvedDocsAlgoliaFieldsConfig
  searchParams: Record<string, JsonValue>
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
      kind: 'component'
      component: string
    }

export type DocsGlobalContextTopBarNav =
  | Exclude<ResolvedTopBarNav, { kind: 'component' }>
  | {
      kind: 'component'
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
  algolia: ResolvedDocsAlgoliaConfig | null
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
  | 'algolia'
  | 'pages'
  | 'navbarItems'
  | 'social'
> & {
  sidebarSections: ResolvedDocsConfig['sections']
  topBarNav: DocsGlobalContextTopBarNav
}

export type DocsGlobalContextData = DocsGlobalContextSerializableData & {
  docsIconMap: DocsIconMap
  topBarNavComponent?: ComponentType<TopBarNavComponentProps>
}

export type TopBarNavComponentProps = {
  docs: DocsGlobalContextData
  isLandingPage: boolean
  activeSection: ResolvedDocsSection | null
  buttonClassName: string
  activeButtonClassName: string
}

export type DocPageData = {
  page: ResolvedDocsPage
  headings: DocHeading[]
  previousPage: DocPageLinkData | null
  nextPage: DocPageLinkData | null
}
