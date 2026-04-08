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
}

export type DocsGroupNode = {
  kind: 'group'
  id: string
  title?: string
  href?: string
  showInNav?: boolean
  items: DocsSidebarNode[]
  collapsible?: DocsCollapsible
}

export type DocsSectionNode = {
  kind: 'section'
  id: string
  title: string
  navTitle?: string
  href?: string
  items: DocsSidebarNode[]
}

export type DocsSidebarNode = DocsGroupNode | DocsPageNode

export type DocsGraph = {
  items: DocsSectionNode[]
}

export type DocsConfig = {
  siteTitle: string
  siteDescription?: string
  basePath: string
  contentDir?: string
  graph: DocsGraph
  theme?: DocsThemeConfig
  footer?: DocsFooterConfig
  brand?: DocsBrandConfig
  head?: DocsHeadConfig
  partners?: DocsPartnersConfig
  algolia?: DocsAlgoliaConfig
}

export type ResolvedDocsBrandConfig = {
  text: string
  href: string
  logoLight?: string
  logoDark?: string
  logoAlt: string
}

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

export type ResolvedDocsHeadConfig = DocsHeadConfig

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
}

export type ResolvedSidebarPage = {
  kind: 'page'
  id: string
  title: string
  navTitle: string
  href: string
  showInNav: boolean
}

export type ResolvedSidebarNode = ResolvedSidebarGroup | ResolvedSidebarPage

export type ResolvedDocsSection = {
  id: string
  title: string
  navTitle: string
  href: string
  items: ResolvedSidebarNode[]
}

export type ResolvedNavbarItem = {
  id: string
  title: string
  href: string
}

export type ResolvedDocsConfig = {
  siteTitle: string
  siteDescription: string | null
  basePath: string
  contentDir: string
  theme: Required<DocsThemeConfig>
  footer: Required<DocsFooterConfig>
  brand: ResolvedDocsBrandConfig
  head: ResolvedDocsHeadConfig
  partners: ResolvedDocsPartnersConfig
  algolia: ResolvedDocsAlgoliaConfig | null
  pages: ResolvedDocsPage[]
  sections: ResolvedDocsSection[]
  navbarItems: ResolvedNavbarItem[]
}

export type DocPageLinkData = Pick<ResolvedDocsPage, 'id' | 'title' | 'href' | 'documentTitle'>

export type DocsGlobalContextData = Pick<
  ResolvedDocsConfig,
  'siteTitle' | 'basePath' | 'theme' | 'footer' | 'brand' | 'head' | 'partners' | 'algolia' | 'pages' | 'navbarItems'
> & {
  sidebarSections: ResolvedDocsConfig['sections']
}

export type DocPageData = {
  page: ResolvedDocsPage
  headings: DocHeading[]
  previousPage: DocPageLinkData | null
  nextPage: DocPageLinkData | null
}
