import { cmMerge } from '@classmatejs/react'
import { usePageContext } from 'vike-react/usePageContext'
import LayoutComponent from '@/components/LayoutComponent'
import DocsMenu from '@/components/Navbar/DocsMenu'
import ThemeSwitch from '@/components/Navbar/ThemeSwitch'
import Search from '@/components/Search'
import SocialIcons from '@/components/SocialIcons'
import baseAssets from '@/lib/baseAssets'
import type { Locale } from '@/lib/i18n/config'
import { localizeHref } from '@/lib/i18n/routing'
import { t } from '@/lib/messages'

const BrandLogo = ({ locale, isLanding = false }: { locale: Locale; isLanding?: boolean }) => (
  <a href={localizeHref('/', locale)} className="flex gap-2 items-center text-base-content">
    {/* <img src={`${baseAssets}logo-dark.svg`} alt="telefunc logo" className="w-6 h-6 dark:hidden block" />
    <img src={`${baseAssets}logo-light.svg`} alt="telefunc logo" className="w-6 h-6 hidden dark:block" /> */}
    <img src={`${baseAssets}favicon/favicon.svg`} alt="telefunc logo" className="w-6 h-6" />
    <span className="font-semibold text-xl">
      Telefunc{' '}
      <span className="font-normal text-base-muted text-xs lowercase">
        {!isLanding ? t(locale, 'header', 'docsHome') : null}
      </span>
    </span>
  </a>
)

const Navbar = () => {
  const { locale, urlPathname } = usePageContext()
  const isLandingPage = urlPathname === '/'

  return (
    <header
      className={cmMerge(
        isLandingPage ? '' : 'bg-base-100  border-base-muted-light border-b dark:shadow',
        'z-10 w-full h-16 fixed top-0 left-0',
      )}
    >
      <LayoutComponent className="h-full">
        {isLandingPage ? (
          <div className="py-4 flex justify-between items-center h-full relative z-3">
            <div className="flex-1 flex items-center gap-4">
              <BrandLogo locale={locale} isLanding />
            </div>
            <div className="flex flex-1 items-center justify-center gap-4 top-0 left-0 w-full">
              <Search inputSize={isLandingPage ? 'md' : 'sm'} />
            </div>
            <div className="flex-1 flex items-center justify-end gap-2">
              <div className="hidden xl:block">
                <SocialIcons />
              </div>
              <ThemeSwitch />
            </div>
          </div>
        ) : (
          <div className="py-4 flex justify-between items-center h-full relative z-3">
            <div className="flex-1 lg:flex-none flex items-center justify-between gap-2 w-80">
              <BrandLogo locale={locale} />
            </div>
            <div className="flex flex-1 items-center justify-center lg:justify-start lg:pl-10 xl:pl-14 gap-4 top-0 left-0 w-full">
              <DocsMenu />
            </div>
            <div className="flex-1 lg:flex-none flex items-center justify-end gap-2 ">
              <Search />
              <div className="hidden xl:block border-e border-e-base-muted-light pr-2 ">
                <SocialIcons />
              </div>
              <ThemeSwitch />
            </div>
          </div>
        )}
      </LayoutComponent>
    </header>
  )
}

export default Navbar
