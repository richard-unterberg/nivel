import type { ComponentPropsWithoutRef } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { localizeHref } from '@/lib/i18n/routing'

type AnchorProps = ComponentPropsWithoutRef<'a'>

const getLocalizedMdxHref = (href: AnchorProps['href'], locale: string | undefined) => {
  if (typeof href !== 'string' || !href.startsWith('/')) {
    return href
  }

  return localizeHref(href, locale)
}

export const MdxLink = ({ href, ...props }: AnchorProps) => {
  const { locale } = usePageContext()
  return <a href={getLocalizedMdxHref(href, locale)} {...props} />
}
