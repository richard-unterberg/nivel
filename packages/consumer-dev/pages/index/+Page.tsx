import { LayoutComponent } from '@unterberg/nivel/client'
import BackendCode from './backendCode.mdx'
import CTAButtons from './CTA'
import { Features } from './Features'
import StartPageFooter from './Footer'
import FrontendCode from './frontendCode.mdx'
import { Quickstart } from './QuickStart/QuickStart'
import SectionHeading from './SectionHeading'

const styles = `
  .landing-code-samples [data-code-block-content] {
    height: 100%;
    margin-bottom: 0 !important;
    padding-top: 1rem !important;
    font-size: 12.5px !important;
  }

  .landing-code-samples [data-rehype-pretty-code-figure] {
    height: 100%;
  }

  .landing-code-samples [data-code-block-frame] {
    height: 100%;
  }

  .landing-code-samples [data-choice-group-outer] {
    margin-top: 0 !important;
  }
`

const Page = () => {
  return (
    <div className="landing-code-samples">
      <style>{styles}</style>
      <div className="overflow-x-clip min-h-[calc(100svh-14*var(--spacing))] flex flex-col justify-center py-16 w-full">
        <div className="w-full overflow-x-hidden h-full max-w-full absolute top-0 left-0">
          <div className="absolute top-0 min-w-300 left-1/2 w-full h-svh bg-radial-[at_50%_50%] from-primary-muted-light/30 dark:from-primary-muted-light/30 to-55% translate-x-[-50%] pointer-events-none" />
        </div>

        <LayoutComponent className="relative">
          <div className="text-center mx-auto z-2 relative">
            {/* <div className="flex rounded-field justify-center w-fit mx-auto shadow border border-base-muted-medium/50 overflow-hidden">
            <span className="block py-1.5 px-2 font-semibold text-xs text-base-muted tracking-wide">REPLACES</span>
            <span className="block py-1.5 px-2 bg-base-muted-superlight text-base-muted font-semibold text-xs">
              REST / GraphQL / tRPC / Server Actions
            </span>
          </div> */}
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl! font-bold tracking-tight">
                Telefunc(tions)
              </h1>
              <p className="font-normal text-base-muted text-lg lg:text-3xl mt-4">
                End-to-End type safety without the schema
              </p>
            </div>
          </div>
        </LayoutComponent>

        <LayoutComponent $size="sm" className="flex gap-2 justify-center">
          <CTAButtons />
        </LayoutComponent>
        <LayoutComponent $size="sm">
          <div className="grid grid-cols-2 gap-4">
            <h2 className="text-lg font mb-2 text-center">Call in the browser</h2>
            <h2 className="text-lg font mb-2 text-center">Run on the server</h2>
          </div>
          <div className="landing-code-samples grid grid-cols-2 gap-4 items-stretch">
            <FrontendCode />
            <BackendCode />
          </div>
        </LayoutComponent>
      </div>

      <div className="relative h-fit overflow-x-clip">
        <div className="w-full overflow-hidden h-full max-w-full absolute top-0 left-0">
          <div className="absolute top-0 left-0 w-[160svh] h-full bg-radial from-primary-muted-light/30 to-65%" />
        </div>
        <LayoutComponent $size="md">
          <SectionHeading>Features</SectionHeading>
          <Features />
          <CTAButtons />
        </LayoutComponent>
      </div>
      <LayoutComponent $size="md">
        <SectionHeading>Quick Start</SectionHeading>
        <Quickstart />
        <CTAButtons />
      </LayoutComponent>
      <div className="relative overflow-hidden">
        <div className="w-full overflow-x-hidden overflow-y-hidden h-full max-w-full absolute top-0 left-0">
          <div className="absolute top-0 left-0 w-full h-[60svh] bg-radial from-primary-muted-light/40 to-65%" />
        </div>
        <LayoutComponent $size="sm">
          <SectionHeading>You may not need an API schema</SectionHeading>
          <StartPageFooter />
        </LayoutComponent>
      </div>
    </div>
  )
}

export default Page
