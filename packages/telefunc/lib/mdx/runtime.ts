import type {
  UniversalMdxCodeBlockChoiceStore,
  UniversalMdxRuntimeValue,
  UniversalResolveDocLinkArgs,
  UniversalResolvedDocLink,
} from '@unterberg/universal-mdx-mods'
import { getDocHeadings, hasDocSlug } from '@/lib/docs/contentManifest'
import { getDocHeadingMetadata, resolveHeadingByHrefPathname } from '@/lib/docs/headings'
import { getDocPageDataFromPageContext } from '@/lib/docs/pageContext'
import { getDocPath } from '@/lib/docs/systemConfig'
import { DEFAULT_LOCALE, resolveLocale } from '@/lib/i18n/config'
import { localizeHref } from '@/lib/i18n/routing'
import { getHeadingGroupTitle } from '@/lib/navigation/menuNavigation'
import { useUserSettingsStore } from '@/lib/settings-store'
import { readLegacyCodeBlockChoice } from '@/lib/settings-storage'

const telefuncCodeBlockChoiceStore: UniversalMdxCodeBlockChoiceStore = {
  subscribe: (listener) => useUserSettingsStore.subscribe(listener),
  getChoice: (choiceGroupName) => useUserSettingsStore.getState().codeBlockChoices[choiceGroupName] ?? null,
  setChoice: (choiceGroupName, choice) => useUserSettingsStore.getState().setCodeBlockChoice(choiceGroupName, choice),
  getLegacyChoice: readLegacyCodeBlockChoice,
}

type TelefuncMdxPageContext = Parameters<typeof getDocPageDataFromPageContext>[0] & {
  locale: string
}

const assertWarning = (condition: unknown, message: string) => {
  if (condition || !import.meta.env.DEV) {
    return
  }

  console.warn(`[DocPress][Warning] ${message}`)
}

const determineSectionTitle = (href: string) => {
  const hash = href.split('#')[1]

  if (!hash) {
    return null
  }

  return hash
    .split(':~:text')[0]
    ?.split('-')
    .map((word, index) => (index === 0 ? `${word[0]?.toUpperCase() ?? ''}${word.slice(1)}` : word))
    .join(' ')
}

const parseHref = (href: string) => {
  let hrefHash: string | null = null
  let hrefPathname: string | null = null

  if (!href.includes('#')) {
    hrefPathname = href
  } else {
    const [pathPart, ...hashParts] = href.split('#')
    if (pathPart) {
      hrefPathname = pathPart
    }
    hrefHash = hashParts.join('#')
  }

  return {
    hrefHash: hrefHash?.split(':~:text')[0] ?? null,
    hrefPathname,
  }
}

const normalizeDocPath = (value: string) => value.replace(/^\/+|\/+$/g, '')

const getSectionTitle = ({
  docPath,
  doNotInferSectionTitle,
  href,
  hrefHash,
  isCurrentPage,
  locale,
  noWarning,
  pageContext,
}: {
  docPath: string
  doNotInferSectionTitle?: boolean
  href: string
  hrefHash: string
  isCurrentPage: boolean
  locale: string
  noWarning?: boolean
  pageContext: TelefuncMdxPageContext
}) => {
  const docData = getDocPageDataFromPageContext(pageContext)
  const localeResolved = resolveLocale(locale)
  const localizedHeadings = getDocHeadings(docPath, localeResolved)
  const headings =
    isCurrentPage && docData
      ? docData.headings
      : localizedHeadings.length > 0
        ? localizedHeadings
        : getDocHeadings(docPath, DEFAULT_LOCALE)

  const section = headings.find((heading) => heading.id === hrefHash)

  if (section) {
    return section.title
  }

  if (doNotInferSectionTitle) {
    if (!noWarning) {
      assertWarning(false, `Page section title not found for <Link href="${href}" doNotInferSectionTitle={true} />.`)
    }
    return null
  }

  return determineSectionTitle(href)
}

const resolveTelefuncDocLink = (
  pageContext: TelefuncMdxPageContext,
  { href, doNotInferSectionTitle, noWarning }: UniversalResolveDocLinkArgs,
): UniversalResolvedDocLink | null => {
  const { hrefHash, hrefPathname } = parseHref(href)
  const locale = pageContext.locale
  const localeResolved = resolveLocale(locale)
  const docData = getDocPageDataFromPageContext(pageContext)
  const samePageDocPath = docData?.docSlug ?? null
  const resolved = hrefPathname ? resolveHeadingByHrefPathname(hrefPathname) : null
  const docPath = resolved?.docPath ?? (hrefPathname ? null : samePageDocPath)

  if (!resolved && hrefPathname) {
    const looksLikeMissingDocPage = hasDocSlug(normalizeDocPath(hrefPathname))
    if (looksLikeMissingDocPage && !noWarning) {
      assertWarning(false, `Couldn't find page with URL ${hrefPathname}.`)
    }
  }

  if (!docPath) {
    return null
  }

  const groupTitle = resolved ? getHeadingGroupTitle(resolved.headingKey, localeResolved) : null
  const pathnameCanonical = resolved ? getDocPath(resolved.docPath) : getDocPath(docPath)
  const normalizedHref = hrefHash ? `${pathnameCanonical}#${hrefHash}` : pathnameCanonical
  const isCurrentPage = docData ? docPath === docData.docSlug : false

  return {
    href: localizeHref(normalizedHref, localeResolved),
    title: resolved
      ? (getDocHeadingMetadata(resolved.docPath, localeResolved)?.title ??
        resolved.heading.navTitle?.[localeResolved] ??
        resolved.heading.title[localeResolved])
      : (getDocHeadingMetadata(docPath, localeResolved)?.title ?? undefined),
    breadcrumb: groupTitle ? [groupTitle] : undefined,
    sectionTitle: hrefHash
      ? (getSectionTitle({
          docPath,
          doNotInferSectionTitle,
          href,
          hrefHash,
          isCurrentPage,
          locale,
          noWarning,
          pageContext,
        }) ?? undefined)
      : undefined,
    isCurrentPage,
  }
}

export const getTelefuncMdxRuntimeValue = (pageContext: TelefuncMdxPageContext): UniversalMdxRuntimeValue => {
  const { locale } = pageContext

  return {
    locale,
    localizeHref: (href) => localizeHref(href, locale),
    resolveDocLink: (args) => resolveTelefuncDocLink(pageContext, args),
    codeBlockChoices: telefuncCodeBlockChoiceStore,
  }
}
