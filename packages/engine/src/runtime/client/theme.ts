import type { DocsThemeConfig, ThemePreference } from '../../docs/types.js'

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'light'
export const DARK_THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)'

const getDataTheme = (themePreference: ThemePreference, themeConfig: Required<DocsThemeConfig>) => {
  return themePreference === 'dark' ? themeConfig.dark : themeConfig.light
}

const isThemePreference = (value: unknown): value is ThemePreference => {
  return value === 'light' || value === 'dark'
}

const getSystemThemePreference = (fallbackThemePreference: ThemePreference): ThemePreference => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return fallbackThemePreference
  }

  return window.matchMedia(DARK_THEME_MEDIA_QUERY).matches ? 'dark' : 'light'
}

export const resolveThemePreference = (
  themePreference: ThemePreference | null | undefined,
  themeConfig: Required<DocsThemeConfig>,
) => {
  if (isThemePreference(themePreference)) {
    return themePreference
  }

  return getSystemThemePreference(themeConfig.defaultPreference)
}

export const applyThemePreference = (
  themePreference: ThemePreference | null | undefined,
  themeConfig: Required<DocsThemeConfig>,
) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute(
    'data-theme',
    getDataTheme(resolveThemePreference(themePreference, themeConfig), themeConfig),
  )
}
