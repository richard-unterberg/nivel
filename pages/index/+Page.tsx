import { usePageContext } from 'vike-react/usePageContext'
import GradientText from '@/components/GradientText'
import LayoutComponent from '@/components/LayoutComponent'
import baseAssets from '@/lib/baseAssets'
import { getDocsIndexPath } from '@/lib/docs/systemConfig'
import { localizeHref } from '@/lib/i18n/routing'
import { t } from '@/lib/messages'
import UspSection from '@/pages/index/UspSection'

const Page = () => {
  const { locale, config } = usePageContext()

  return (
    <>
      <div className="overflow-x-clip">
        <LayoutComponent className="pt-20 relative">
          <div className="z-1 object-center absolute w-300 h-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={`${baseAssets}decorators/mascot-bg.png`}
              alt=""
              width={300}
              height={300}
              className="w-full h-full select-none pointer-events-none opacity-40 dark:opacity-45"
            />
          </div>
          <div className="text-center w-4/5 lg:w-3/5 mx-auto z-2 relative">
            <h1 className="text-4xl lg:text-5xl xl:text-7xl font-bold">
              {t(locale, 'home', 'titlePrefix')} <GradientText>{t(locale, 'home', 'titleAccent')}</GradientText>
            </h1>
            <p className="font-normal text-vike-grey-300 text-lg lg:text-2xl mt-8">{t(locale, 'home', 'subtitle')}</p>
            <a
              href={localizeHref(getDocsIndexPath(config.mdex), locale)}
              className="btn  btn-lg btn-neutral mx-auto mt-8"
            >
              {t(locale, 'home', 'cta')}
            </a>
          </div>
        </LayoutComponent>
      </div>
      <LayoutComponent $size="sm" className="relative">
        <UspSection />
      </LayoutComponent>
    </>
  )
}

export default Page
