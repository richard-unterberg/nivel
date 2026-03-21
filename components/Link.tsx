import type { JSXElement } from 'solid-js'
import { createMemo } from 'solid-js'
import { usePageContext } from 'vike-solid/usePageContext'
import { getHeadingTitleFromHref } from '@/lib/headings-flat'
import { getLogicalPathname, localizeHref } from '@/lib/i18n/routing'

export const Link = (props: { href: string; children?: JSXElement; doNotInferSectionTitle?: boolean }) => {
  const pageContext = usePageContext()
  const href = createMemo(() => localizeHref(props.href, pageContext.locale))
  const isActive = createMemo(() =>
    getLogicalPathname(pageContext.urlPathname) === '/'
      ? getLogicalPathname(pageContext.urlPathname) === getLogicalPathname(href())
      : getLogicalPathname(pageContext.urlPathname).startsWith(getLogicalPathname(href())),
  )
  const label = createMemo(() => {
    if (props.children) return props.children
    if (props.doNotInferSectionTitle) return props.href
    return getHeadingTitleFromHref(props.href, pageContext.locale) ?? props.href
  })

  return (
    <a href={href()} class={isActive() ? 'is-active' : undefined}>
      {label()}
    </a>
  )
}
