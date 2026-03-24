import { Smile } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import LayoutComponent from '@/components/LayoutComponent'
import DocsMenu from '@/components/Navbar/DocsMenu'
import LanguageSwitch from '@/components/Navbar/LanguageSwitch'
import Search from '@/components/Navbar/Search'
import ThemeSwitch from '@/components/Navbar/ThemeSwitch'
import SocialIcons from '@/components/SocialIcons'
import type { Locale } from '@/lib/i18n/config'
import { t } from '@/lib/i18n/messages'
import { localizeHref } from '@/lib/i18n/routing'

const VikeLogo = ({ locale, isLanding = false }: { locale: Locale; isLanding?: boolean }) => (
  <a href={localizeHref('/', locale)} className="flex gap-2 items-center text-base-content">
    <Smile className="w-6 h-6" />
    <span className="font-semibold">Vike {!isLanding ? t(locale, 'header', 'docsHome') : null}</span>
  </a>
)

const Navbar = () => {
  const { locale, urlPathname } = usePageContext()
  const isLandingPage = urlPathname === '/'

  const _piCalculator = useMemo(() => {
    return locale
  }, [locale])

  useEffect(() => {
    console.log('Current URL Pathname:', urlPathname)
  }, [urlPathname])

  return (
    <header className="bg-base-300 fixed z-10 w-full h-16 border-vike-grey border-b dark:shadow">
      <LayoutComponent className="h-full">
        {isLandingPage ? (
          <div className="py-4 flex justify-between items-center h-full relative z-3">
            <div className="flex-1 flex items-center gap-4">
              <VikeLogo locale={locale} isLanding />
            </div>
            <div className="flex flex-1 items-center justify-center gap-4 top-0 left-0 w-full">
              <Search />
            </div>
            <div className="flex-1 flex items-center justify-end gap-2">
              <div className="hidden xl:block">
                <SocialIcons />
              </div>
              <LanguageSwitch />
              <ThemeSwitch />
            </div>
          </div>
        ) : (
          <div className="py-4 flex justify-between items-center h-full relative z-3">
            <div className="flex-1 lg:flex-none flex items-center justify-between gap-2 w-90">
              <VikeLogo locale={locale} />
              <Search />
            </div>
            <div className="flex flex-1 items-center justify-center lg:justify-start lg:pl-10 xl:pl-14 gap-4 top-0 left-0 w-full">
              <DocsMenu />
            </div>
            <div className="flex-1 lg:flex-none flex items-center justify-end gap-2">
              <div className="hidden xl:block">
                <SocialIcons />
              </div>
              <LanguageSwitch />
              <ThemeSwitch />
            </div>
          </div>
        )}
      </LayoutComponent>
    </header>
  )
}

export default Navbar
