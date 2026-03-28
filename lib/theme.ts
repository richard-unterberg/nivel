export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'dark'

const dataThemeByPreference = {
  light: 'mdex-light',
  dark: 'mdex-dark',
} satisfies Record<ThemePreference, string>

export type ThemePreference = 'light' | 'dark'

export const getDataTheme = (themePreference: ThemePreference) => {
  return dataThemeByPreference[themePreference]
}

export const applyThemePreference = (themePreference: ThemePreference) => {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.setAttribute('data-theme', getDataTheme(themePreference))
}
