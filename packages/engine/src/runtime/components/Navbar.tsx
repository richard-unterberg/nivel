import { cmMerge } from '@classmatejs/react'
import { useEffect, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { renderInlineMarkdown } from '../../components/renderInlineMarkdown.js'
import { baseAssets, withSiteBaseUrl } from '../../nivelAssets.js'
import type { DocsThemeConfig, ResolvedDocsBrandConfig, ResolvedNavbarItem } from '../../types.js'
import { Brand } from './Brand.js'
import { LayoutComponent } from './LayoutComponent.js'
import { ThemeSwitch } from './ThemeSwitch.js'

interface NavbarProps {
  brand: ResolvedDocsBrandConfig
  activeSectionId: string | null
  navbarItems: ResolvedNavbarItem[]
  theme: Required<DocsThemeConfig>
}

export const Navbar = ({ brand, activeSectionId, navbarItems, theme }: NavbarProps) => {
  const { urlPathname } = usePageContext()
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

  const showChrome = !isLandingPage || isLandingPageScrolled

  return (
    <header
      className={cmMerge(
        'fixed top-0 left-0 z-20 h-16 w-full border-b border-transparent',
        showChrome &&
          'bg-linear-to-t from-base-100 via-base-100/40 to-base-100 backdrop-grayscale border-base-muted-light dark:shadow',
      )}
    >
      <div
        className="absolute inset-0 hidden dark:block"
        // biome-ignore lint/nursery/noInlineStyles: decorator
        style={{ backgroundImage: `url(${baseAssets}decorators/pattern.png)` }}
      />
      <div
        className="absolute inset-0 dark:hidden"
        // biome-ignore lint/nursery/noInlineStyles: decorator
        style={{ backgroundImage: `url(${baseAssets}decorators/pattern-light.png)` }}
      />
      <LayoutComponent className="h-full">
        {isLandingPage ? (
          <div className="relative z-3 flex h-full items-center justify-between py-4">
            <div className="flex flex-1 items-center gap-4">
              <Brand brand={brand} />
            </div>
            <nav
              aria-label="Primary"
              className="top-0 left-0 flex min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto"
            >
              <ul className="flex items-center gap-2 font-semibold">
                {navbarItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={withSiteBaseUrl(item.href)}
                      className={cmMerge(
                        'btn px-2 whitespace-nowrap',
                        item.id === activeSectionId ? 'btn-primary btn-soft' : 'btn-ghost',
                      )}
                    >
                      {renderInlineMarkdown(item.title)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-1 items-center justify-end gap-2">
              <ThemeSwitch theme={theme} />
            </div>
          </div>
        ) : (
          <div className="relative z-3 flex h-full items-center justify-between py-4">
            <div className="flex w-80 flex-1 items-center justify-between gap-2 lg:flex-none">
              <Brand brand={brand} />
            </div>
            <nav
              aria-label="Primary"
              className="top-0 left-0 flex min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto lg:justify-start lg:pl-6 xl:pl-10"
            >
              <ul className="flex items-center gap-2 font-semibold">
                {navbarItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={withSiteBaseUrl(item.href)}
                      className={cmMerge(
                        'btn px-2 whitespace-nowrap',
                        item.id === activeSectionId ? 'btn-primary btn-soft' : 'btn-ghost',
                      )}
                    >
                      {renderInlineMarkdown(item.title)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-1 items-center justify-end gap-2 lg:flex-none">
              <ThemeSwitch theme={theme} />
            </div>
          </div>
        )}
      </LayoutComponent>
    </header>
  )
}
