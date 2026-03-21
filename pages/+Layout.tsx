import type { JSXElement } from 'solid-js'
import { usePageContext } from 'vike-solid/usePageContext'
import LanguageSwitcher from '@/components/LanguageSwitch'
import LayoutComponent from '@/components/LayoutComponent'
import ThemeSwitch from '@/components/ThemeSwitch'
import appConfig from '@/lib/config'
import { t } from '@/lib/i18n/messages'
import { localizeHref } from '@/lib/i18n/routing'

const PageLayout = (props: { children: JSXElement }) => {
  const pageContext = usePageContext()

  return (
    <>
      <header class="bg-base-300 fixed z-10 w-full h-16 border-vike-grey border-b">
        <LayoutComponent class="h-full">
          <header class="py-4 flex justify-between items-center h-full">
            <a href={localizeHref('/', pageContext.locale)} class="flex gap-2 items-center">
              <img src={`${appConfig.publicAssets}vike.svg`} alt="Vike Logo" class="w-6 dark:hidden" />
              <img src={`${appConfig.publicAssets}vike-dark.svg`} alt="Vike Logo" class="w-6 hidden dark:block" />
              <span class="font-medium">Vike {t(pageContext.locale, 'header', 'docsHome')}</span>
            </a>
            <div class="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeSwitch />
            </div>
          </header>
        </LayoutComponent>
      </header>
      <div class='pt-12'>
        {props.children}
      </div>
    </>
  )
}

export default PageLayout
