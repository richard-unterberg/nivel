import { useEffect } from 'react'
import type { DocsConfig } from '../../../docs/types.js'
import { useDocsUserSettingsStore } from '../store/settings-store.js'
import { applyThemePreference, resolveThemePreference } from '../theme.js'

export const UserSettingsSync = ({ theme }: { theme?: DocsConfig['theme'] }) => {
  const themePreference = useDocsUserSettingsStore((state) => state.themePreference)
  const lightTheme = theme?.light ?? 'consumer-light'
  const darkTheme = theme?.dark ?? 'consumer-dark'
  const defaultThemePreference = theme?.defaultPreference ?? 'light'
  const resolvedTheme = { light: lightTheme, dark: darkTheme, defaultPreference: defaultThemePreference }
  const effectiveThemePreference = resolveThemePreference(themePreference, resolvedTheme)

  useEffect(() => {
    applyThemePreference(effectiveThemePreference, resolvedTheme)
  }, [darkTheme, defaultThemePreference, effectiveThemePreference, lightTheme])

  return null
}
