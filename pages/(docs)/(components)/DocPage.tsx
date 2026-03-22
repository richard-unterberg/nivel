import { usePageContext } from 'vike-react/usePageContext'
import { getDocPage } from '@/lib/docs/content'

const DocPage = (props: { slug: string }) => {
  const pageContext = usePageContext()
  const entry = getDocPage(props.slug, pageContext.locale)
  const Page = entry?.Page

  if (!Page) return <p>Missing document: {props.slug}</p>

  return <Page />
}

export const createDocPage = (slug: string) => {
  return () => <DocPage slug={slug} />
}
