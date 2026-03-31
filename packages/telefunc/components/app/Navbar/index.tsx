import { cmMerge } from '@classmatejs/react'
import { useEffect, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import BrandLogo from '@/app-components/BrandLogo'
import LayoutComponent from '@/app-components/LayoutComponent'
import DocsMenu from '@/app-components/Navbar/DocsMenu'
import ThemeSwitch from '@/app-components/Navbar/ThemeSwitch'
import Search from '@/app-components/Search'
import SocialIcons from '@/app-components/SocialIcons'
import baseAssets from '@/lib/baseAssets'

const Navbar = () => {
  const { locale, urlPathname } = usePageContext()
  const isLandingPage = urlPathname === '/'
  const [isLandingPageScrolled, setIsLandingPageScrolled] = useState(false)

  useEffect(() => {
    if (!isLandingPage) {
      setIsLandingPageScrolled(false)
      return
    }

    const handleScroll = () => {
      setIsLandingPageScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isLandingPage])

  const isScrolledLandingPage = isLandingPage && isLandingPageScrolled

  return (
    <header
      className={cmMerge(
        'z-10 w-full h-16 fixed top-0 left-0 border-b border-transparent',
        isScrolledLandingPage || !isLandingPage
          ? 'bg-linear-to-t from-base-100/30 via-base-100/60 to-base-100/80 border-base-muted-light dark:shadow'
          : '',
      )}
    >
      <div
        className="absolute inset-0 hidden dark:block"
        style={{ backgroundImage: `url(${baseAssets}decorators/pattern.png)` }}
      />
      <div
        className="absolute inset-0 dark:hidden"
        style={{ backgroundImage: `url(${baseAssets}decorators/pattern-light.png)` }}
      />
      <LayoutComponent className="h-full">
        {isLandingPage ? (
          <div className="py-4 flex justify-between items-center h-full relative z-3">
            <div className="flex-1 flex items-center gap-4">
              <BrandLogo locale={locale} />
            </div>
            <div className="flex flex-1 items-center justify-center gap-4 top-0 left-0 w-full">
              <DocsMenu />
            </div>
            <div className="flex-1 flex items-center justify-end gap-2">
              <Search />
              <div className="hidden xl:block border-e border-e-base-muted-light pr-2 ">
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
