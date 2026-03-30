import { cmMerge } from '@classmatejs/react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { getDocHeadings } from '@/lib/docs/contentManifest'
import { getDocHeadingMetadata, resolveHeadingByHrefPathname } from '@/lib/docs/headings'
import { getDocPageDataFromPageContext } from '@/lib/docs/pageContext'
import { DEFAULT_LOCALE, resolveLocale } from '@/lib/i18n/config'
import { localizeHref } from '@/lib/i18n/routing'
import { getHeadingGroupTitle } from '@/lib/navigation/menuNavigation'

type AnchorProps = ComponentPropsWithoutRef<'a'> & {
  href?: string
  path?: string
  text?: string | ReactNode
  noBreadcrumb?: boolean
  doNotInferSectionTitle?: boolean
  noWarning?: boolean
}

type LinkData = {
  docPath: string
  linkBreadcrumb: string[] | null
  title: string
}

function assertUsage(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[DocPress][Wrong Usage] ${message}`)
  }
}

const assertWarning = (condition: unknown, message: string) => {
  if (condition || !import.meta.env.DEV) {
    return
  }

  console.warn(`[DocPress][Warning] ${message}`)
}

const parseMarkdownMini = (markdown: string) => {
  type Part = { content: string; nodeType: 'code' | 'text' }
  const parts: Part[] = []
  let current: Part | undefined

  for (const letter of markdown.split('')) {
    if (letter === '`') {
      if (current?.nodeType === 'code') {
        parts.push(current)
        current = undefined
      } else {
        if (current) {
          parts.push(current)
        }
        current = { nodeType: 'code', content: '' }
      }
      continue
    }

    current ??= { nodeType: 'text', content: '' }
    current.content += letter
  }

  if (current) {
    parts.push(current)
  }

  return (
    <>
      {parts.map((part, index) =>
        part.nodeType === 'code' ? <code key={index}>{part.content}</code> : <span key={index}>{part.content}</span>,
      )}
    </>
  )
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

const getLocalizedMdxHref = (href: string, locale: string | undefined) => {
  if (href.startsWith('#')) {
    return href
  }

  const { hrefHash, hrefPathname } = parseHref(href)
  const resolved = hrefPathname ? resolveHeadingByHrefPathname(hrefPathname) : null
  const pathnameCanonical = resolved ? `/${resolved.docPath}` : (hrefPathname ?? href)
  const normalizedHref = hrefHash ? `${pathnameCanonical}#${hrefHash}` : pathnameCanonical

  return localizeHref(normalizedHref, locale)
}

const findLinkData = (href: string, locale: string, noWarning?: boolean): LinkData | null => {
  const resolved = resolveHeadingByHrefPathname(href)
  const localeResolved = resolveLocale(locale)

  if (!resolved) {
    if (!noWarning) {
      assertWarning(false, `Couldn't find page with URL ${href}.`)
    }
    return null
  }

  const groupTitle = getHeadingGroupTitle(resolved.headingKey, localeResolved)

  return {
    docPath: resolved.docPath,
    linkBreadcrumb: groupTitle ? [groupTitle] : null,
    title:
      getDocHeadingMetadata(resolved.docPath, localeResolved)?.title ??
      resolved.heading.navTitle?.[localeResolved] ??
      resolved.heading.title[localeResolved],
  }
}

const getSectionTitle = ({
  docPath,
  doNotInferSectionTitle,
  href,
  hrefHash,
  isLinkOnSamePage,
  locale,
  noWarning,
  pageContext,
}: {
  docPath: string
  doNotInferSectionTitle?: boolean
  href: string
  hrefHash: string
  isLinkOnSamePage: boolean
  locale: string
  noWarning?: boolean
  pageContext: ReturnType<typeof usePageContext>
}) => {
  const docData = getDocPageDataFromPageContext(pageContext)
  const localeResolved = resolveLocale(locale)
  const headings =
    isLinkOnSamePage && docData
      ? docData.headings
      : getDocHeadings(docPath, localeResolved).length > 0
        ? getDocHeadings(docPath, localeResolved)
        : getDocHeadings(docPath, DEFAULT_LOCALE)

  const section = headings.find((heading) => heading.id === hrefHash)

  if (section) {
    return parseMarkdownMini(section.title)
  }

  if (doNotInferSectionTitle) {
    if (!noWarning) {
      assertWarning(false, `Page section title not found for <Link href="${href}" doNotInferSectionTitle={true} />.`)
    }
    return null
  }

  const inferred = determineSectionTitle(href)
  return inferred ? inferred : null
}

const getLinkTextData = ({
  doNotInferSectionTitle,
  href,
  noWarning,
  pageContext,
}: {
  doNotInferSectionTitle?: boolean
  href: string
  noWarning?: boolean
  pageContext: ReturnType<typeof usePageContext>
}) => {
  const { hrefHash, hrefPathname } = parseHref(href)
  const locale = pageContext.locale
  const docData = getDocPageDataFromPageContext(pageContext)
  const linkData = findLinkData(hrefPathname || `/${docData?.docSlug ?? ''}`, locale, noWarning)

  if (!linkData) {
    return null
  }

  const isLinkOnSamePage = docData ? linkData.docPath === docData.docSlug : false
  let sectionTitle: ReactNode = null

  if (hrefHash) {
    sectionTitle = getSectionTitle({
      docPath: linkData.docPath,
      doNotInferSectionTitle,
      href,
      hrefHash,
      isLinkOnSamePage,
      locale,
      noWarning,
      pageContext,
    })
  }

  return { isLinkOnSamePage, linkData, sectionTitle }
}

const getLinkText = ({
  isLinkOnSamePage,
  linkData,
  noBreadcrumb,
  sectionTitle,
}: {
  isLinkOnSamePage: boolean
  linkData: LinkData
  noBreadcrumb?: boolean
  sectionTitle: ReactNode
}) => {
  const breadcrumbParts: ReactNode[] = []

  if (linkData.linkBreadcrumb) {
    breadcrumbParts.push(
      ...linkData.linkBreadcrumb
        .slice()
        .reverse()
        .map((item) => parseMarkdownMini(item)),
    )
  }

  breadcrumbParts.push(parseMarkdownMini(linkData.title))

  if (sectionTitle) {
    breadcrumbParts.push(sectionTitle)
  }

  if (noBreadcrumb || isLinkOnSamePage) {
    return breadcrumbParts[breadcrumbParts.length - 1] ?? null
  }

  return (
    <>
      {breadcrumbParts.map((title, index) => (
        <span key={index}>
          {index > 0 ? ' > ' : null}
          {title}
        </span>
      ))}
    </>
  )
}

const Link = ({
  href,
  path,
  text,
  noBreadcrumb,
  doNotInferSectionTitle,
  noWarning,
  children,
  className,
  ...props
}: AnchorProps) => {
  const pageContext = usePageContext()
  const hrefValue = href ?? path

  if (typeof hrefValue !== 'string' || hrefValue === '') {
    assertWarning(false, '<Link /> is missing both `href` and `path`.')

    return (
      <a className={cmMerge(className, 'inline-flex gap-1 items-center')} {...props}>
        {text ?? children ?? 'LINK-TARGET-NOT-FOUND'}
      </a>
    )
  }

  // Temporary compatibility for older MDX examples that still use `path=`.
  if (!href && path) {
    return (
      <a href={path} className={cmMerge(className, 'inline-flex gap-1 items-center')} {...props}>
        {text ?? children ?? path}
      </a>
    )
  }

  assertUsage(
    hrefValue.startsWith('/') || hrefValue.startsWith('#'),
    `<Link href /> prop \`href==='${hrefValue}'\` but should start with '/' or '#'`,
  )
  assertUsage(!text || !children, 'Cannot use both `text` or `children`')

  const content = text ?? children
  const linkTextData = getLinkTextData({ href: hrefValue, pageContext, doNotInferSectionTitle, noWarning })
  const inferredText =
    content ??
    (linkTextData
      ? getLinkText({
          noBreadcrumb,
          ...linkTextData,
        })
      : 'LINK-TARGET-NOT-FOUND')

  return (
    <a href={getLocalizedMdxHref(hrefValue, pageContext.locale)} className={cmMerge(className, '')} {...props}>
      {inferredText}
    </a>
  )
}

export default Link
