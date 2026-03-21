import { Show } from 'solid-js'
import { usePageContext } from 'vike-solid/usePageContext'
import { t } from '@/lib/i18n/messages'

const Page = () => {
  const pageContext = usePageContext()
  return (
    <Show
      when={pageContext.is404}
      fallback={
        <>
          <h1>{t(pageContext.locale, 'error', 'internalTitle')}</h1>
          <p>{t(pageContext.locale, 'error', 'internalBody')}</p>
        </>
      }
    >
      <h1>{t(pageContext.locale, 'error', 'notFoundTitle')}</h1>
      <p>{t(pageContext.locale, 'error', 'notFoundBody')}</p>
    </Show>
  )
}
export default Page
