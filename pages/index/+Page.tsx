import { usePageContext } from 'vike-react/usePageContext'
import LayoutComponent from '@/app-components/LayoutComponent'
import ProseContainer from '@/components/app/ProseContainer'
import Link from '@/components/docs/Link'
import { headingDefinitions } from '@/lib/headings'
import { t } from '@/lib/messages'
import BackendCode from '@/pages/index/backendCode.mdx'
import { Features } from '@/pages/index/Features'
import FrontendCode from '@/pages/index/frontendCode.mdx'
import { Quickstart } from './QuickStart/QuickStart'

const Page = () => {
  const { locale } = usePageContext()

  return (
    <>
      <div className="overflow-x-clip min-h-[calc(100svh-16*var(--spacing))] flex flex-col justify-center py-16 w-full">
        <LayoutComponent className="relative">
          <div className="text-center mx-auto z-2 relative">
            {/* <div className="flex rounded-field justify-center w-fit mx-auto shadow border border-base-muted-medium/50 overflow-hidden">
            <span className="block py-1.5 px-2 font-semibold text-xs text-base-muted tracking-wide">REPLACES</span>
            <span className="block py-1.5 px-2 bg-base-muted-superlight text-base-muted font-semibold text-xs">
              REST / GraphQL / tRPC / Server Actions
            </span>
          </div> */}
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl font-bold">
                {t(locale, 'home', 'titlePrefix')} {t(locale, 'home', 'titleAccent')}
              </h1>
              <p className="font-normal text-base-muted text-lg lg:text-3xl mt-4">{t(locale, 'home', 'subtitle')}</p>
            </div>
          </div>
        </LayoutComponent>

        <LayoutComponent $size="sm" className="flex gap-2 justify-center my-10">
          <Link href={`/${headingDefinitions.quickStart.docPath}`} className="btn btn-secondary btn-lg">
            {t(locale, 'landing', 'getStartedButton')}
          </Link>
          <Link
            href={`/${headingDefinitions.concepts.docPath}`}
            className="btn btn-ghost border-base-content bg-transparent btn-lg"
          >
            {t(locale, 'landing', 'learnMoreButton')}
          </Link>
        </LayoutComponent>
        <LayoutComponent $size="sm">
          <div className="grid grid-cols-2 gap-4">
            <h2 className="text-lg font mb-2 text-center">{t(locale, 'landing', 'frontendCodeTitle')}</h2>
            <h2 className="text-lg font mb-2 text-center">{t(locale, 'landing', 'backendCodeTitle')}</h2>
          </div>
          <div className="landing-code-samples grid grid-cols-2 gap-4 items-stretch">
            <FrontendCode />
            <BackendCode />
          </div>
        </LayoutComponent>
      </div>

      <LayoutComponent $size="sm" className="mt-10">
        <ProseContainer className="prose-headings:my-0 prose-headings:mb-4 prose-img:my-0">
          <Features />
          <Quickstart />
        </ProseContainer>
      </LayoutComponent>
    </>
  )
}

export default Page
