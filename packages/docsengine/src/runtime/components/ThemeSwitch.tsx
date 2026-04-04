import { Moon, Sun } from 'lucide-react'
import type { DocsThemeConfig } from '../../types.js'
import { useDocsUserSettingsStore } from '../store/settings-store.js'
import { resolveThemePreference } from '../theme.js'

export const ThemeSwitch = ({ theme }: { theme: Required<DocsThemeConfig> }) => {
  const themePreference = useDocsUserSettingsStore((state) => state.themePreference)
  const setThemePreference = useDocsUserSettingsStore((state) => state.setThemePreference)
  const effectiveThemePreference = resolveThemePreference(themePreference, theme)

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setThemePreference(effectiveThemePreference === 'light' ? 'dark' : 'light')}
      className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-base-muted-light bg-base-200"
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </button>
  )
}
