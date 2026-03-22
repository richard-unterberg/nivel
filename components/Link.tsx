import type { ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { getHeadingTitleFromHref } from '@/lib/headings'
import { getLogicalPathname, localizeHref } from '@/lib/i18n/routing'

export const Link = (props: { href: string; children?: ReactNode; doNotInferSectionTitle?: boolean }) => {
  const pageContext = usePageContext()
  const href = localizeHref(props.href, pageContext.locale)
  const currentPathname = getLogicalPathname(pageContext.urlPathname)
  const targetPathname = getLogicalPathname(href)
  const isActive =
    currentPathname === '/' ? currentPathname === targetPathname : currentPathname.startsWith(targetPathname)
  const label =
    props.children ??
    (props.doNotInferSectionTitle
      ? props.href
      : (getHeadingTitleFromHref(props.href, pageContext.locale) ?? props.href))

  return (
    <a href={href} className={isActive ? 'is-active' : undefined}>
      {label}
    </a>
  )
}
