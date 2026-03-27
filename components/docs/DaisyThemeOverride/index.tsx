import { cmMerge } from '@classmatejs/react'
import { useEffect, useState } from 'react'
import { Presenter } from '@/components/docs'
import { useUserSettingsStore } from '@/lib/settings-store'
import { applyThemePreference } from '@/lib/theme'

type DaisyThemeMeta = {
  name: string
  scheme: 'light' | 'dark'
}

let overrideStylesPromise: Promise<unknown> | null = null

const ensureOverrideStyles = () => {
  overrideStylesPromise ??= import('@/components/docs/DaisyThemeOverride/override.css')
  return overrideStylesPromise
}

const DAISY_DEFAULT_THEMES: DaisyThemeMeta[] = [
  { name: 'light', scheme: 'light' },
  { name: 'dark', scheme: 'dark' },
  { name: 'cupcake', scheme: 'light' },
  { name: 'bumblebee', scheme: 'light' },
  { name: 'emerald', scheme: 'light' },
  { name: 'corporate', scheme: 'light' },
  { name: 'synthwave', scheme: 'dark' },
  { name: 'retro', scheme: 'light' },
  { name: 'cyberpunk', scheme: 'light' },
  { name: 'valentine', scheme: 'light' },
  { name: 'halloween', scheme: 'dark' },
  { name: 'garden', scheme: 'light' },
  { name: 'forest', scheme: 'dark' },
  { name: 'aqua', scheme: 'dark' },
  { name: 'lofi', scheme: 'light' },
  { name: 'pastel', scheme: 'light' },
  { name: 'fantasy', scheme: 'light' },
  { name: 'wireframe', scheme: 'light' },
  { name: 'black', scheme: 'dark' },
  { name: 'luxury', scheme: 'dark' },
  { name: 'dracula', scheme: 'dark' },
  { name: 'cmyk', scheme: 'light' },
  { name: 'autumn', scheme: 'light' },
  { name: 'business', scheme: 'dark' },
  { name: 'acid', scheme: 'light' },
  { name: 'lemonade', scheme: 'light' },
  { name: 'night', scheme: 'dark' },
  { name: 'coffee', scheme: 'dark' },
  { name: 'winter', scheme: 'light' },
  { name: 'dim', scheme: 'dark' },
  { name: 'nord', scheme: 'light' },
  { name: 'sunset', scheme: 'dark' },
  { name: 'caramellatte', scheme: 'light' },
  { name: 'abyss', scheme: 'dark' },
  { name: 'silk', scheme: 'light' },
]

const LIGHT_THEMES = DAISY_DEFAULT_THEMES.filter((theme) => theme.scheme === 'light')
const DARK_THEMES = DAISY_DEFAULT_THEMES.filter((theme) => theme.scheme === 'dark')

const ThemePresenter = ({
  theme,
  setTemporaryTheme,
  hoveredTheme,
  setHoveredTheme,
}: {
  theme: DaisyThemeMeta
  setTemporaryTheme: (themeName: string) => void
  hoveredTheme: string | null
  setHoveredTheme: (themeName: string | null) => void
}) => {
  return (
    <Presenter key={theme.name} elevated className="relative m-0 p-0 overflow-hidden shadow">
      <div data-theme={theme.name}>
        <div
          className={cmMerge(
            hoveredTheme === theme.name ? 'opacity-50' : 'opacity-100',
            'transition-opacity bg-linear-to-t via-base-100/50 to-base-100 absolute left-0 top-0 h-full w-full',
          )}
        />
        <div className="bg-base-muted-superlight text-base-muted text-xs text-center relative z-2 py-1">
          {theme.name}
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-x-1 gap-y-1">
            <div className="col-span-4 flex gap-1">
              <button type="button" className="btn btn-xs btn-primary flex-1">
                P
              </button>
              <button type="button" className="btn btn-xs btn-secondary flex-1">
                S
              </button>
              <button type="button" className="btn btn-xs btn-accent flex-1">
                A
              </button>
            </div>
            <div className="h-2 bg-base-100" />
            <div className="h-2 bg-base-200" />
            <div className="h-2 bg-base-300" />
            <div className="h-2 bg-base-content" />
            <div className="h-2 bg-success" />
            <div className="h-2 bg-warning" />
            <div className="h-2 bg-error" />
            <div className="h-2 bg-info" />
          </div>
        </div>
        <button
          type="button"
          className="absolute inset-0 z-4 cursor-pointer"
          onClick={() => setTemporaryTheme(theme.name)}
          onMouseEnter={() => setHoveredTheme(theme.name)}
          onMouseLeave={() => setHoveredTheme(null)}
        />
      </div>
    </Presenter>
  )
}

export const DaisyThemeOverride = () => {
  const themePreference = useUserSettingsStore((state) => state.themePreference)
  const [temporaryTheme, setTemporaryTheme] = useState('')
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)

  useEffect(() => {
    void ensureOverrideStyles()
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    if (!temporaryTheme) {
      applyThemePreference(themePreference)
      return
    }

    document.documentElement.setAttribute('data-theme', temporaryTheme)

    return () => {
      applyThemePreference(themePreference)
    }
  }, [temporaryTheme, themePreference])

  return (
    <section className="grid grid-cols-4 gap-3 prose-headings:mt-0 mt-10">
      <div className="flex col-span-full items-center justify-between">
        <h3 className="scroll-mt-24">Dark Themes</h3>
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          disabled={!temporaryTheme}
          onClick={() => setTemporaryTheme('')}
        >
          Disable temporary theme
        </button>
      </div>
      {DARK_THEMES.map((theme) => (
        <ThemePresenter
          key={theme.name}
          theme={theme}
          setTemporaryTheme={setTemporaryTheme}
          hoveredTheme={hoveredTheme}
          setHoveredTheme={setHoveredTheme}
        />
      ))}

      <div className="flex col-span-full items-center justify-between mt-8">
        <h3 className="scroll-mt-24">Light Themes</h3>
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          disabled={!temporaryTheme}
          onClick={() => setTemporaryTheme('')}
        >
          Disable temporary theme
        </button>
      </div>
      {LIGHT_THEMES.map((theme) => (
        <ThemePresenter
          key={theme.name}
          theme={theme}
          setTemporaryTheme={setTemporaryTheme}
          hoveredTheme={hoveredTheme}
          setHoveredTheme={setHoveredTheme}
        />
      ))}

      <div className="col-span-full"></div>
    </section>
  )
}
