import { cmMerge } from '@classmatejs/react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { withSiteBaseUrl } from '../../shared/assets.js'
import { useUniversalMdxRuntime } from './UniversalMdxProvider.js'

export type LinkProps = ComponentPropsWithoutRef<'a'> & {
  href?: string
  text?: string | ReactNode
  noBreadcrumb?: boolean
  doNotInferSectionTitle?: boolean
  noWarning?: boolean
}

function assertUsage(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[UniversalMdxMods][Wrong Usage] ${message}`)
  }
}

const assertWarning = (condition: unknown, message: string) => {
  const isDev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true

  if (condition || !isDev) {
    return
  }

  console.warn(`[UniversalMdxMods][Warning] ${message}`)
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

const isExternalHref = (href: string) => {
  return /^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
}

const renderLabelPart = (value: ReactNode) => {
  return typeof value === 'string' ? parseMarkdownMini(value) : value
}

const getLinkText = ({
  isCurrentPage,
  breadcrumb,
  noBreadcrumb,
  sectionTitle,
  title,
}: {
  isCurrentPage?: boolean
  breadcrumb?: ReactNode[]
  noBreadcrumb?: boolean
  sectionTitle?: ReactNode
  title?: ReactNode
}) => {
  const breadcrumbParts: ReactNode[] = []

  if (breadcrumb) {
    breadcrumbParts.push(...breadcrumb.map((item) => renderLabelPart(item)))
  }

  if (title) {
    breadcrumbParts.push(renderLabelPart(title))
  }

  if (sectionTitle) {
    breadcrumbParts.push(renderLabelPart(sectionTitle))
  }

  if (noBreadcrumb || isCurrentPage) {
    return breadcrumbParts[breadcrumbParts.length - 1] ?? null
  }

  return (
    <>
      {breadcrumbParts.map((part, index) => (
        <span key={index}>
          {index > 0 ? ' > ' : null}
          {part}
        </span>
      ))}
    </>
  )
}

export const Link = ({
  href,
  text,
  noBreadcrumb,
  doNotInferSectionTitle,
  noWarning,
  children,
  className,
  ...props
}: LinkProps) => {
  const runtime = useUniversalMdxRuntime()

  if (typeof href !== 'string' || href === '') {
    assertWarning(false, '<Link /> is missing `href`.')

    return (
      <a className={cmMerge(className, 'inline-flex gap-1 items-center')} {...props}>
        {text ?? children ?? 'LINK-TARGET-NOT-FOUND'}
      </a>
    )
  }

  assertUsage(
    href.startsWith('/') || href.startsWith('#') || isExternalHref(href),
    `<Link href /> prop \`href==='${href}'\` but should be external or start with '/' or '#'`,
  )
  assertUsage(!text || !children, 'Cannot use both `text` or `children`')

  const content = text ?? children
  const resolvedDocLink = runtime?.resolveDocLink?.({
    href,
    doNotInferSectionTitle,
    noWarning,
  })
  const localizedHref = resolvedDocLink?.href ?? runtime?.localizeHref?.(href) ?? withSiteBaseUrl(href)
  const inferredSectionTitle =
    resolvedDocLink?.sectionTitle ?? (!doNotInferSectionTitle ? determineSectionTitle(href) : null)
  const inferredText =
    content ??
    (resolvedDocLink
      ? getLinkText({
          breadcrumb: resolvedDocLink.breadcrumb,
          isCurrentPage: resolvedDocLink.isCurrentPage,
          noBreadcrumb,
          sectionTitle: inferredSectionTitle ?? undefined,
          title: resolvedDocLink.title,
        })
      : isExternalHref(href)
        ? href
        : (inferredSectionTitle ?? 'LINK-TARGET-NOT-FOUND'))

  return (
    <a href={localizedHref} className={cmMerge(className, '')} {...props}>
      {inferredText}
    </a>
  )
}
