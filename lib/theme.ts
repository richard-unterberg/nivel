export type ThemePreference = 'light' | 'dark'

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'dark'
export const THEME_STORAGE_KEY = 'vike-theme-preference'

const dataThemeByPreference = {
  light: 'vike-light',
  dark: 'vike-dark',
} satisfies Record<ThemePreference, string>

export const isThemePreference = (value: unknown): value is ThemePreference => {
  return value === 'light' || value === 'dark'
}

export const getDataTheme = (themePreference: ThemePreference) => {
  return dataThemeByPreference[themePreference]
}

export const getThemePreferenceFromDataTheme = (dataTheme: string | null) => {
  if (dataTheme === dataThemeByPreference.light) {
    return 'light'
  }

  if (dataTheme === dataThemeByPreference.dark) {
    return 'dark'
  }

  return null
}

export const readStoredThemePreference = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const storedThemePreference = window.localStorage.getItem(THEME_STORAGE_KEY)

  return isThemePreference(storedThemePreference) ? storedThemePreference : null
}

export const applyThemePreference = (themePreference: ThemePreference) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('data-theme', getDataTheme(themePreference))
}
