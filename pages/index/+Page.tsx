import { ArrowBigDownDash, Sticker } from 'lucide-react'
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
      <div className="overflow-x-clip min-h-[calc(100svh-40*var(--spacing))] flex flex-col justify-center gap-16 py-16">
        <LayoutComponent className="relative">
          <div className="z-1 object-center absolute w-300 h-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={`${baseAssets}decorators/mascot-bg.avif`}
              alt=""
              width={300}
              height={300}
              className="w-full h-full select-none pointer-events-none opacity-40 dark:opacity-45"
            />
          </div>
          <div className="text-center w-4/5 lg:w-3/5 mx-auto z-2 relative">
            <h1 className="text-4xl lg:text-5xl xl:text-7xl font-bold">
              {t(locale, 'home', 'titlePrefix')}{' '}
              <GradientText className="underline">{t(locale, 'home', 'titleAccent')}</GradientText>
            </h1>
            <p className="font-normal text-base-dark text-lg lg:text-2xl mt-10">
              <GradientText className="font-semibold text-base-content">mdex</GradientText>{' '}
              {t(locale, 'home', 'subtitle')}
            </p>
            <a
              href={localizeHref(getDocsIndexPath(config.mdex), locale)}
              className="btn  btn-lg btn-neutral mx-auto mt-8"
            >
              {t(locale, 'home', 'cta')}
            </a>
          </div>
        </LayoutComponent>
        <LayoutComponent $size="sm" className="relative">
          <UspSection />
        </LayoutComponent>
      </div>
      <div className=" animate-bounce">
        <Sticker className="w-8 h-8 mx-auto mb-2 text-base-dark" />
        <ArrowBigDownDash className="w-6 h-6 mx-auto text-base-dark animate-bounce" />
      </div>
    </>
  )
}

export default Page
