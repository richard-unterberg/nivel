import { useEffect, useId, useState } from 'react'
import { useUserSettingsStore } from '@/lib/settings-store'
import { applyThemePreference } from '@/lib/theme'

type DaisyThemeMeta = {
  name: string
  scheme: 'light' | 'dark'
}

let overrideStylesPromise: Promise<unknown> | null = null

const ensureOverrideStyles = () => {
  overrideStylesPromise ??= import('./override.css')
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

export const DaisyThemeOverride = () => {
  const selectId = useId()
  const themePreference = useUserSettingsStore((state) => state.themePreference)
  const [temporaryTheme, setTemporaryTheme] = useState('')

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
    <section className="not-prose my-8">
      <div className="rounded-box border border-base-light bg-base-200 p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Temporary Global Theme Override</h2>
            <p className="max-w-2xl text-sm text-base-dark">
              Selecting a DaisyUI theme updates the app-wide <code>data-theme</code> attribute on the main layout.
              Disable it to go back to the stored light or dark preference.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-base-dark">
                DaisyUI theme
              </span>
              <select
                id={selectId}
                className="select select-bordered w-full min-w-64"
                value={temporaryTheme}
                onChange={(event) => setTemporaryTheme(event.target.value)}
              >
                <option value="">Stored app theme</option>
                <optgroup label="Light themes">
                  {LIGHT_THEMES.map((theme) => (
                    <option key={theme.name} value={theme.name}>
                      {theme.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Dark themes">
                  {DARK_THEMES.map((theme) => (
                    <option key={theme.name} value={theme.name}>
                      {theme.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setTemporaryTheme('')}
              disabled={!temporaryTheme}
            >
              Disable temporary theme
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`badge ${temporaryTheme ? 'badge-primary' : 'badge-outline'}`}>
            {temporaryTheme || 'stored preference'}
          </span>
          {temporaryTheme && <span className="badge badge-secondary badge-outline">temporary override active</span>}
          <span className="badge badge-outline">global layout</span>
        </div>
      </div>
    </section>
  )
}
