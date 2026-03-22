import { usePageContext } from 'vike-react/usePageContext'
import LayoutComponent from '@/components/LayoutComponent'
import LanguageSwitch from '@/components/Navbar/LanguageSwitch'
import ThemeSwitch from '@/components/Navbar/ThemeSwitch'
import appConfig from '@/lib/config'
import { t } from '@/lib/i18n/messages'
import { localizeHref } from '@/lib/i18n/routing'

const Navbar = () => {
  const pageContext = usePageContext()

  return (
    <header className="bg-base-300 fixed z-10 w-full h-16 border-vike-grey border-b dark:shadow">
      <LayoutComponent className="h-full">
        <div className="py-4 flex justify-between items-center h-full">
          <a href={localizeHref('/', pageContext.locale)} className="flex gap-2 items-center">
            <img src={`${appConfig.publicAssets}vike.svg`} alt="Vike Logo" className="w-6 h-6 dark:hidden" />
            <img src={`${appConfig.publicAssets}vike-dark.svg`} alt="Vike Logo" className="w-6 h-6 hidden dark:block" />
            <span className="font-semibold">Vike {t(pageContext.locale, 'header', 'docsHome')}</span>
          </a>
          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <ThemeSwitch />
          </div>
        </div>
      </LayoutComponent>
    </header>
  )
}

export default Navbar
