import { usePageContext } from 'vike-react/usePageContext'
import LayoutComponent from '@/components/LayoutComponent'
import { getDocsIndexPath } from '@/lib/docs/systemConfig'
import { localizeHref } from '@/lib/i18n/routing'
import { t } from '@/lib/messages'

const Page = () => {
  const { locale, config } = usePageContext()

  return (
    <LayoutComponent>
      <div className="max-w-none dark:prose-invert">
        <div className="text-center w-4/5 lg:w-3/5 mx-auto mt-20">
          <h1
            className="text-4xl lg:text-5xl xl:text-7xl"
            dangerouslySetInnerHTML={{ __html: t(locale, 'home', 'title') }}
          />
          <p className="font-semibold text-vike-grey-300 text-lg lg:text-xl">{t(locale, 'home', 'subtitle')}</p>
          <a
            href={localizeHref(getDocsIndexPath(config.mdex), locale)}
            className="btn btn-soft btn-lg btn-neutral mx-auto"
          >
            {t(locale, 'home', 'cta')}
          </a>
        </div>
      </div>
    </LayoutComponent>
  )
}

export default Page
