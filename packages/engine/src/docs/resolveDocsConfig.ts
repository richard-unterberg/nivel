import { nivelAssetUrl, resolvePublicAssetUrl, withSiteBaseUrl } from '../shared/assets.js'
import type {
  DocsAlgoliaConfig,
  DocsBrandConfig,
  DocsConfig,
  DocsFooterConfig,
  DocsHeadConfig,
  DocsPageNode,
  DocsPartnerConfig,
  DocsSectionNode,
  DocsSidebarNode,
  ResolvedDocsAlgoliaConfig,
  ResolvedDocsBrandConfig,
  ResolvedDocsConfig,
  ResolvedDocsPage,
  ResolvedDocsPartnerConfig,
  ResolvedDocsPartnersConfig,
  ResolvedDocsSection,
  ResolvedDocsSocialConfig,
  ResolvedNavbarItem,
  ResolvedSidebarNode,
  ResolvedTopBarNav,
  TopBarNavComponentsOptions,
  ThemePreference,
  TopBarNavOptions,
} from './types.js'
import { assertDocsIconName } from './icons.js'

const isExternalHref = (value: string) => {
  return /^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith('mailto:') || value.startsWith('tel:')
}

const normalizeBasePath = (value: string) => {
  const normalized = value.trim()

  if (!normalized) {
    throw new Error('Docs basePath must be a non-empty absolute path.')
  }

  if (!normalized.startsWith('/') || normalized.startsWith('//')) {
    throw new Error(`Docs basePath must start with "/". Received ${JSON.stringify(value)}.`)
  }

  if (normalized.includes('?') || normalized.includes('#')) {
    throw new Error(`Docs basePath cannot include query strings or hashes. Received ${JSON.stringify(value)}.`)
  }

  const collapsed = normalized.replace(/\/+/g, '/').replace(/\/+$/g, '')
  return collapsed === '' ? '/' : collapsed
}

const normalizeContentDir = (value: string | undefined) => {
  const normalized = (value ?? 'docs').trim()

  if (!normalized) {
    throw new Error('Docs contentDir must be a non-empty project-relative path.')
  }

  if (normalized.startsWith('/') || normalized.startsWith('\\')) {
    throw new Error(`Docs contentDir must be project-relative. Received ${JSON.stringify(value)}.`)
  }

  if (/^[a-zA-Z]:[\\/]/.test(normalized)) {
    throw new Error(`Docs contentDir must be project-relative. Received ${JSON.stringify(value)}.`)
  }

  const segments = normalized.replaceAll('\\', '/').split('/')
  const resolvedSegments: string[] = []

  for (const segment of segments) {
    if (segment === '' || segment === '.') {
      continue
    }

    if (segment === '..') {
      throw new Error(`Docs contentDir cannot escape the project root. Received ${JSON.stringify(value)}.`)
    }

    resolvedSegments.push(segment)
  }

  if (resolvedSegments.length === 0) {
    throw new Error(`Docs contentDir must contain at least one path segment. Received ${JSON.stringify(value)}.`)
  }

  return resolvedSegments.join('/')
}

const normalizeSlug = (value: string) => value.replace(/^\/+|\/+$/g, '')

const joinDocsHref = (basePath: string, slug: string) => {
  const normalizedBasePath = normalizeBasePath(basePath)
  const normalizedSlug = normalizeSlug(slug)

  if (!normalizedSlug) {
    return normalizedBasePath === '/' ? '/' : `${normalizedBasePath}/`
  }

  return normalizedBasePath === '/' ? `/${normalizedSlug}/` : `${normalizedBasePath}/${normalizedSlug}/`
}

const normalizePathname = (value: string) => {
  const pathname = value.split('?')[0]?.split('#')[0] ?? value
  const normalized = pathname.trim().replace(/\/+$/g, '')
  return normalized === '' ? '/' : `${normalized}/`.replace(/\/+/g, '/')
}

export const resolveDocsHref = (basePath: string, href: string) => {
  const normalized = href.trim()

  if (!normalized || normalized.startsWith('#') || isExternalHref(normalized)) {
    return null
  }

  const pathname = normalized.split('?')[0]?.split('#')[0] ?? normalized

  if (!pathname) {
    return null
  }

  if (pathname.startsWith('/')) {
    const normalizedPathname = normalizePathname(pathname)
    const normalizedBasePath = normalizeBasePath(basePath)

    if (normalizedBasePath === '/') {
      return normalizedPathname
    }

    return normalizedPathname === `${normalizedBasePath}/` || normalizedPathname.startsWith(`${normalizedBasePath}/`)
      ? normalizedPathname
      : null
  }

  if (pathname.startsWith('./') || pathname.startsWith('../')) {
    return null
  }

  return joinDocsHref(basePath, pathname)
}

const normalizeSourcePath = (value: string) => {
  const segments = value.replaceAll('\\', '/').split('/')
  const normalizedSegments: string[] = []

  for (const segment of segments) {
    if (segment === '' || segment === '.') {
      continue
    }

    if (segment === '..') {
      normalizedSegments.pop()
      continue
    }

    normalizedSegments.push(segment)
  }

  return normalizedSegments.join('/')
}

const getSectionHref = (items: ResolvedSidebarNode[], visibleOnly = false): string | null => {
  for (const item of items) {
    if (item.kind === 'page') {
      if (visibleOnly && !item.showInNav) {
        continue
      }

      return item.href
    }

    if (item.kind === 'group') {
      if (visibleOnly && !item.showInNav) {
        continue
      }

      const href = getSectionHref(item.items, visibleOnly)
      if (href) {
        return href
      }
    }
  }

  return null
}

const resolveNavigationHref = (value: string, fieldName: string, basePath: string) => {
  const normalized = value.trim()

  if (!normalized) {
    throw new Error(`Docs ${fieldName} must be a non-empty string.`)
  }

  if (normalized.startsWith('#') || isExternalHref(normalized)) {
    return normalized
  }

  if (!normalized.startsWith('/')) {
    return joinDocsHref(basePath, normalized)
  }

  return normalizePathname(normalized)
}

const resolveTopBarNavComponentPath = (component: string, index: number) => {
  const normalized = component.trim().replaceAll('\\', '/')
  const fieldName = `topBarNav component ${index + 1}`

  if (!normalized) {
    throw new Error(`Docs ${fieldName} must be a non-empty relative import path.`)
  }

  if (!normalized.startsWith('./') && !normalized.startsWith('../')) {
    throw new Error(`Docs ${fieldName} must be a relative import path. Received ${JSON.stringify(normalized)}.`)
  }

  if (normalized.includes('?') || normalized.includes('#')) {
    throw new Error(`Docs ${fieldName} cannot include query strings or hashes. Received ${JSON.stringify(normalized)}.`)
  }

  return normalized
}

const resolveTopBarNavConfig = (topBarNav: TopBarNavOptions | undefined, basePath: string): ResolvedTopBarNav => {
  if (topBarNav === undefined || topBarNav === false) {
    return {
      kind: 'none',
      items: [],
    }
  }

  if ((topBarNav as unknown) === true) {
    throw new Error('Docs topBarNav no longer accepts true. Use a consumer component for mega menu composition.')
  }

  if (!Array.isArray(topBarNav)) {
    const components = (topBarNav as TopBarNavComponentsOptions).components

    if (!Array.isArray(components)) {
      throw new Error('Docs topBarNav components must be an array of relative import paths.')
    }

    if (components.length === 0) {
      throw new Error('Docs topBarNav components must include at least one relative import path.')
    }

    return {
      kind: 'components',
      components: components.map(resolveTopBarNavComponentPath),
    }
  }

  return {
    kind: 'links',
    items: topBarNav.map((item, index) => {
      const label = item.label.trim()

      if (!label) {
        throw new Error(`Docs topBarNav item ${index + 1} label must be a non-empty string.`)
      }

      return {
        label,
        href: resolveNavigationHref(item.href, `topBarNav item ${index + 1} href`, basePath),
        isCta: item.isCta ?? false,
      }
    }),
  }
}

const resolveThemeConfig = (theme: DocsConfig['theme']) => {
  return {
    light: theme?.light ?? 'consumer-light',
    dark: theme?.dark ?? 'consumer-dark',
    defaultPreference: (theme?.defaultPreference ?? 'light') as ThemePreference,
  }
}

const resolveFooterConfig = (footer: DocsFooterConfig | undefined) => {
  return {
    pagination: footer?.pagination ?? false,
  }
}

const resolveRobotsConfig = (robots: DocsConfig['robots']) => {
  return robots ?? true
}

const resolveCustomFontsConfig = (customFonts: DocsConfig['customFonts']) => {
  return customFonts ?? true
}

const resolveBrandConfig = (brand: DocsBrandConfig | undefined, siteTitle: string): ResolvedDocsBrandConfig => {
  const text = brand?.text ?? siteTitle

  return {
    text,
    href: withSiteBaseUrl(brand?.href ?? '/'),
    logoLight: resolvePublicAssetUrl(brand?.logoLight),
    logoDark: resolvePublicAssetUrl(brand?.logoDark),
    logoAlt: brand?.logoAlt ?? `${text} logo`,
  }
}

const resolveHeadConfig = (head: DocsHeadConfig | undefined, customFonts: boolean) => {
  const fontPreset = customFonts ? (head?.fontPreset ?? 'inter') : 'none'
  const defaultFontStylesheetHref = fontPreset === 'inter' ? nivelAssetUrl('fonts/fonts-inter.css') : undefined
  const defaultFontPreloadHrefs =
    fontPreset === 'inter'
      ? [
          nivelAssetUrl('fonts/inter-v20-latin-regular.woff2'),
          nivelAssetUrl('fonts/inter-v20-latin-600.woff2'),
          nivelAssetUrl('fonts/inter-v20-latin-800.woff2'),
        ]
      : []

  return {
    customFonts,
    faviconSvg: resolvePublicAssetUrl(head?.faviconSvg),
    faviconIco: resolvePublicAssetUrl(head?.faviconIco),
    appleTouchIcon: resolvePublicAssetUrl(head?.appleTouchIcon),
    fontPreset,
    fontStylesheetHref: head?.fontStylesheetHref ?? defaultFontStylesheetHref,
    fontPreloadHrefs: head?.fontPreloadHrefs ?? defaultFontPreloadHrefs,
  }
}

const resolvePartnerAssetUrl = (value: string | undefined) => {
  if (!value) {
    return undefined
  }

  return resolvePublicAssetUrl(value)
}

const resolvePartner = (partner: DocsPartnerConfig): ResolvedDocsPartnerConfig => {
  return {
    name: partner.name,
    href: withSiteBaseUrl(partner.href),
    logoLight: resolvePartnerAssetUrl(partner.logoLight) ?? partner.logoLight,
    logoDark: resolvePartnerAssetUrl(partner.logoDark),
    logoAlt: partner.logoAlt ?? `${partner.name} logo`,
  }
}

const resolveSocialConfig = (social: DocsConfig['social']): ResolvedDocsSocialConfig => {
  // keep the order from the config
  return {
    ...social,
  }
}

const resolvePartnersConfig = (partners: DocsConfig['partners']): ResolvedDocsPartnersConfig => {
  return {
    primary: (partners?.primary ?? []).map(resolvePartner),
    gold: (partners?.gold ?? []).map(resolvePartner),
  }
}

const requireTrimmedString = (value: string, fieldName: string) => {
  const normalized = value.trim()

  if (!normalized) {
    throw new Error(`Docs algolia config "${fieldName}" must be a non-empty string.`)
  }

  return normalized
}

const resolveAlgoliaConfig = (algolia: DocsAlgoliaConfig | undefined): ResolvedDocsAlgoliaConfig | null => {
  if (!algolia) {
    return null
  }

  return {
    appId: requireTrimmedString(algolia.appId, 'appId'),
    apiKey: requireTrimmedString(algolia.apiKey, 'apiKey'),
    indexName: requireTrimmedString(algolia.indexName, 'indexName'),
    fields: {
      href: algolia.fields?.href?.trim() || 'href',
      title: algolia.fields?.title?.trim() || 'title',
      excerpt: algolia.fields?.excerpt?.trim() || 'excerpt',
      sectionTitle: algolia.fields?.sectionTitle?.trim() || 'sectionTitle',
    },
    searchParams: algolia.searchParams ?? {},
  }
}

const normalizeAliases = (aliases: string[] | undefined, slug: string) => {
  const normalizedAliases = new Set<string>()

  for (const alias of aliases ?? []) {
    const normalizedAlias = normalizeSlug(alias)
    if (!normalizedAlias || normalizedAlias === slug) {
      continue
    }

    normalizedAliases.add(normalizedAlias)
  }

  return [...normalizedAliases]
}

export const resolveDocsConfig = (config: DocsConfig): ResolvedDocsConfig => {
  const normalizedBasePath = normalizeBasePath(config.basePath)
  const normalizedContentDir = normalizeContentDir(config.contentDir)
  const customFonts = resolveCustomFontsConfig(config.customFonts)

  const pageIds = new Set<string>()
  const pageSlugs = new Set<string>()
  const pageAliases = new Set<string>()
  const groupIds = new Set<string>()
  const sectionIds = new Set<string>()
  const pages: ResolvedDocsPage[] = []
  const navbarItems: ResolvedNavbarItem[] = []

  const resolveSidebarNodes = (nodes: DocsSidebarNode[], sectionId: string): ResolvedSidebarNode[] => {
    return nodes.map((node) => {
      if (node.kind === 'group') {
        if (groupIds.has(node.id)) {
          throw new Error(`Duplicate docs group id "${node.id}".`)
        }

        if (node.icon) {
          assertDocsIconName(node.icon, `Docs group "${node.id}" icon`)
        }

        groupIds.add(node.id)

        return {
          kind: 'group',
          id: node.id,
          title: node.title,
          href: node.href ? resolveNavigationHref(node.href, `group "${node.id}" href`, normalizedBasePath) : undefined,
          showInNav: node.showInNav ?? true,
          collapsible: node.collapsible,
          items: resolveSidebarNodes(node.items, sectionId),
          icon: node.icon,
        }
      }

      if (node.kind !== 'page') {
        throw new Error(`Invalid docs sidebar node: ${JSON.stringify(node)}`)
      }

      const pageNode = node as DocsPageNode
      const slug = normalizeSlug(pageNode.slug)
      const aliases = normalizeAliases(pageNode.aliases, slug)

      if (pageNode.icon) {
        assertDocsIconName(pageNode.icon, `Docs page "${pageNode.id}" icon`)
      }

      if (!slug) {
        throw new Error(`Docs page "${pageNode.id}" must define a non-empty slug.`)
      }

      if (pageIds.has(pageNode.id)) {
        throw new Error(`Duplicate docs page id "${pageNode.id}".`)
      }

      if (pageSlugs.has(slug)) {
        throw new Error(`Duplicate docs page slug "${slug}".`)
      }

      for (const alias of aliases) {
        if (pageSlugs.has(alias) || pageAliases.has(alias)) {
          throw new Error(`Duplicate docs page alias "${alias}".`)
        }
      }

      pageIds.add(pageNode.id)
      pageSlugs.add(slug)
      for (const alias of aliases) {
        pageAliases.add(alias)
      }

      const href = joinDocsHref(normalizedBasePath, slug)
      const page: ResolvedDocsPage = {
        ...pageNode,
        slug,
        aliases,
        href,
        aliasHrefs: aliases.map((alias) => joinDocsHref(normalizedBasePath, alias)),
        tableOfContents: pageNode.tableOfContents ?? true,
        sectionId,
        documentTitle: `${pageNode.title} | ${config.siteTitle}`,
        source: normalizeSourcePath(pageNode.source),
      }
      pages.push(page)

      return {
        kind: 'page',
        id: pageNode.id,
        title: pageNode.title,
        navTitle: pageNode.navTitle ?? pageNode.title,
        href,
        showInNav: pageNode.showInNav ?? true,
        icon: pageNode.icon,
      }
    })
  }

  const sections: ResolvedDocsSection[] = config.graph.items.map((section: DocsSectionNode) => {
    if (section.kind !== 'section') {
      throw new Error(`Top-level docs graph items must be sections. Received ${JSON.stringify(section)}`)
    }

    if (sectionIds.has(section.id)) {
      throw new Error(`Duplicate docs section id "${section.id}".`)
    }

    if (section.icon) {
      assertDocsIconName(section.icon, `Docs section "${section.id}" icon`)
    }

    sectionIds.add(section.id)

    const items = resolveSidebarNodes(section.items, section.id)
    const firstVisibleHref = getSectionHref(items, true)
    const href = section.href
      ? resolveNavigationHref(section.href, `section "${section.id}" href`, normalizedBasePath)
      : (firstVisibleHref ?? getSectionHref(items))

    if (!href) {
      throw new Error(`Docs section "${section.id}" must contain at least one page.`)
    }

    const resolvedSection: ResolvedDocsSection = {
      id: section.id,
      title: section.title,
      navTitle: section.navTitle ?? section.title,
      href,
      items,
      icon: section.icon,
    }

    navbarItems.push({
      id: section.id,
      title: resolvedSection.navTitle,
      href: resolvedSection.href,
    })

    return resolvedSection
  })

  if (pages.length === 0) {
    throw new Error('Docs graph must contain at least one page.')
  }

  return {
    siteTitle: config.siteTitle,
    siteDescription: config.siteDescription ?? null,
    robots: resolveRobotsConfig(config.robots),
    customFonts,
    basePath: normalizedBasePath,
    contentDir: normalizedContentDir,
    theme: resolveThemeConfig(config.theme),
    footer: resolveFooterConfig(config.footer),
    brand: resolveBrandConfig(config.brand, config.siteTitle),
    head: resolveHeadConfig(config.head, customFonts),
    partners: resolvePartnersConfig(config.partners),
    social: resolveSocialConfig(config.social),
    algolia: resolveAlgoliaConfig(config.algolia),
    pages,
    sections,
    navbarItems,
    topBarNav: resolveTopBarNavConfig(config.topBarNav, normalizedBasePath),
  }
}

export const getResolvedPageById = (config: { pages: ResolvedDocsPage[] }, pageId: string) => {
  const page = config.pages.find((candidate) => candidate.id === pageId)
  if (!page) {
    throw new Error(`Unknown docs page id "${pageId}".`)
  }
  return page
}
