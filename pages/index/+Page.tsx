import { usePageContext } from 'vike-react/usePageContext'
import LayoutComponent from '@/components/LayoutComponent'
import { t } from '@/lib/i18n/messages'
import { localizeHref } from '@/lib/i18n/routing'

const Page = () => {
  const { locale } = usePageContext()

  return (
    <LayoutComponent>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div className="text-center w-4/5 lg:w-3/5 mx-auto mt-20">
          <h1
            className="text-4xl lg:text-5xl xl:text-6xl"
            dangerouslySetInnerHTML={{ __html: t(locale, 'home', 'title') }}
          ></h1>
          <p className="font-semibold text-vike-grey-300 text-lg lg:text-xl">{t(locale, 'home', 'subtitle')}</p>
          <a
            href={localizeHref('/get-started', locale)}
            className="btn btn-outline btn-lg border-vike-grey-300 text-vike-grey-300 mx-auto"
          >
            {t(locale, 'home', 'cta')} ✨
          </a>
        </div>
      </div>
    </LayoutComponent>
  )
}

export default Page
