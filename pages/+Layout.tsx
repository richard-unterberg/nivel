import type { JSXElement } from 'solid-js'
import ThemeSwitch from '@/components/ThemeSwitch'
import appConfig from '@/lib/config'

const PageLayout = ({ children }: { children: JSXElement }) => {
  return (
    <div>
      <header class="navbar flex justify-between items-center">
        <a href="/" class="flex gap-2 items-center">
          <img src={`${appConfig.publicAssets}vike.svg`} alt="Vike Logo" class="w-6 dark:hidden" />
          <img src={`${appConfig.publicAssets}vike-dark.svg`} alt="Vike Logo" class="w-6 hidden dark:block" />
          <span class="text-lg font-bold">Vike</span>
        </a>
        <ThemeSwitch />
      </header>
      {children}
      <footer class="mt-8 text-center text-sm text-gray-500">
        The Footer
      </footer>
    </div>
  )
}

export default PageLayout
