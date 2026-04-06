import { nivelAssetUrl, resolvePublicAssetUrl, withSiteBaseUrl } from '../shared/assets.js'
import type {
  DocsAlgoliaConfig,
  DocsBrandConfig,
  DocsConfig,
  DocsDividerNode,
  DocsFooterConfig,
  DocsHeadConfig,
  DocsPartnerConfig,
  DocsPageNode,
  DocsSectionNode,
  DocsSidebarNode,
  ResolvedDocsAlgoliaConfig,
  ResolvedDocsBrandConfig,
  ResolvedDocsConfig,
  ResolvedDocsPartnerConfig,
  ResolvedDocsPage,
  ResolvedDocsPartnersConfig,
  ResolvedDocsSection,
  ResolvedNavbarItem,
  ResolvedSidebarNode,
  ThemePreference,
} from './types.js'

const normalizeBasePath = (value: string) => {
  const normalized = value.trim().replace(/^\/+|\/+$/g, '')
  return `/${normalized}` as '/docs'
}

const normalizeSlug = (value: string) => value.replace(/^\/+|\/+$/g, '')

const joinHref = (basePath: '/docs', slug: string) => `${basePath}/${normalizeSlug(slug)}/`

const normalizePathname = (value: string) => {
  const pathname = value.split('?')[0]?.split('#')[0] ?? value
  const normalized = pathname.trim().replace(/\/+$/g, '')
  return normalized === '' ? '/' : `${normalized}/`.replace(/\/+/g, '/')
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

const getSectionHref = (items: ResolvedSidebarNode[]): string | null => {
  for (const item of items) {
    if (item.kind === 'page') {
      return item.href
    }

    if (item.kind === 'group') {
      const href = getSectionHref(item.items)
      if (href) {
        return href
      }
    }
  }

  return null
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

const resolveHeadConfig = (head: DocsHeadConfig | undefined) => {
  const fontPreset = head?.fontPreset ?? 'inter'
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
  if (normalizeBasePath(config.basePath) !== '/docs') {
    throw new Error(`nivel currently requires basePath to be "/docs". Received ${JSON.stringify(config.basePath)}.`)
  }

  const pageIds = new Set<string>()
  const pageSlugs = new Set<string>()
  const pageAliases = new Set<string>()
  const groupIds = new Set<string>()
  const sectionIds = new Set<string>()
  const dividerIds = new Set<string>()
  const pages: ResolvedDocsPage[] = []
  const navbarItems: ResolvedNavbarItem[] = []

  const resolveSidebarNodes = (nodes: DocsSidebarNode[], sectionId: string): ResolvedSidebarNode[] => {
    return nodes.map((node) => {
      if (node.kind === 'group') {
        if (groupIds.has(node.id)) {
          throw new Error(`Duplicate docs group id "${node.id}".`)
        }

        groupIds.add(node.id)

        return {
          kind: 'group',
          id: node.id,
          title: node.title,
          collapsible: node.collapsible,
          items: resolveSidebarNodes(node.items, sectionId),
        }
      }

      if (node.kind === 'divider') {
        const divider = node as DocsDividerNode
        if (dividerIds.has(divider.id)) {
          throw new Error(`Duplicate docs divider id "${divider.id}".`)
        }

        dividerIds.add(divider.id)

        return {
          kind: 'divider',
          id: divider.id,
          title: divider.title,
        }
      }

      if (node.kind !== 'page') {
        throw new Error(`Invalid docs sidebar node: ${JSON.stringify(node)}`)
      }

      const pageNode = node as DocsPageNode
      const slug = normalizeSlug(pageNode.slug)
      const aliases = normalizeAliases(pageNode.aliases, slug)

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

      const href = joinHref('/docs', slug)
      const page: ResolvedDocsPage = {
        ...pageNode,
        slug,
        aliases,
        href,
        aliasHrefs: aliases.map((alias) => joinHref('/docs', alias)),
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

    sectionIds.add(section.id)

    const items = resolveSidebarNodes(section.items, section.id)
    const href = getSectionHref(items)

    if (!href) {
      throw new Error(`Docs section "${section.id}" must contain at least one page.`)
    }

    const resolvedSection: ResolvedDocsSection = {
      id: section.id,
      title: section.title,
      navTitle: section.navTitle ?? section.title,
      href,
      items,
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
    basePath: '/docs',
    theme: resolveThemeConfig(config.theme),
    footer: resolveFooterConfig(config.footer),
    brand: resolveBrandConfig(config.brand, config.siteTitle),
    head: resolveHeadConfig(config.head),
    partners: resolvePartnersConfig(config.partners),
    algolia: resolveAlgoliaConfig(config.algolia),
    pages,
    sections,
    navbarItems,
  }
}

export const getResolvedPageById = (config: { pages: ResolvedDocsPage[] }, pageId: string) => {
  const page = config.pages.find((candidate) => candidate.id === pageId)
  if (!page) {
    throw new Error(`Unknown docs page id "${pageId}".`)
  }
  return page
}

export const getResolvedSectionById = (
  config: { sections?: ResolvedDocsSection[]; sidebarSections?: ResolvedDocsSection[] },
  sectionId: string,
) => {
  const sections = config.sections ?? config.sidebarSections ?? []
  return sections.find((section) => section.id === sectionId) ?? null
}

export const getResolvedPageByPathname = (config: { pages: ResolvedDocsPage[] }, pathname: string) => {
  const normalizedPathname = normalizePathname(pathname)

  return (
    config.pages.find((page) => {
      if (normalizePathname(page.href) === normalizedPathname) {
        return true
      }

      return page.aliasHrefs.some((aliasHref) => normalizePathname(aliasHref) === normalizedPathname)
    }) ?? null
  )
}

export const getActiveSectionByPathname = (
  config: { pages: ResolvedDocsPage[]; sections?: ResolvedDocsSection[]; sidebarSections?: ResolvedDocsSection[] },
  pathname: string,
) => {
  const activePage = getResolvedPageByPathname(config, pathname)

  if (!activePage) {
    return null
  }

  return getResolvedSectionById(config, activePage.sectionId)
}

export const isSamePagePathname = (page: Pick<ResolvedDocsPage, 'href' | 'aliasHrefs'>, pathname: string) => {
  const normalizedPathname = normalizePathname(pathname)

  if (normalizePathname(page.href) === normalizedPathname) {
    return true
  }

  return page.aliasHrefs.some((aliasHref) => normalizePathname(aliasHref) === normalizedPathname)
}
