import { createMemo, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { usePageContext } from 'vike-solid/usePageContext'
import { getDocPage } from '@/lib/docs/content'

const DocPage = (props: { slug: string }) => {
  const pageContext = usePageContext()
  const entry = createMemo(() => getDocPage(props.slug, pageContext.locale))
  const Page = createMemo(() => entry()?.Page)

  return (
    <Show when={Page()} fallback={<p>Missing document: {props.slug}</p>}>
      {(CurrentPage) => <Dynamic component={CurrentPage()} />}
    </Show>
  )
}

export const createDocPage = (slug: string) => {
  return () => <DocPage slug={slug} />
}
