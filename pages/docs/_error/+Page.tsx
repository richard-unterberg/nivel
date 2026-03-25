import { Frown } from 'lucide-react'
import { usePageContext } from 'vike-react/usePageContext'
import { t } from '@/lib/i18n/messages'

const Page = () => {
  const { locale, is404 } = usePageContext()

  const headline = t(locale, 'error', is404 ? 'notFoundTitle' : 'internalTitle')
  const message = t(locale, 'error', is404 ? 'notFoundBody' : 'internalBody')

  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <Frown className="w-16 h-16 mb-4" />
      <h1>{headline}</h1>
      <p>{message}</p>
    </div>
  )
}
export default Page
