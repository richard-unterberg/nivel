import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import {
  applyThemePreference,
  DEFAULT_THEME_PREFERENCE,
  getThemePreferenceFromDataTheme,
  readStoredThemePreference,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from '@/lib/theme'

type ThemeContextValue = {
  themePreference: ThemePreference
  setThemePreference: (themePreference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const getInitialThemePreference = (pageThemePreference: ThemePreference) => {
  if (typeof document === 'undefined') {
    return pageThemePreference
  }

  return (
    readStoredThemePreference() ??
    getThemePreferenceFromDataTheme(document.documentElement.getAttribute('data-theme')) ??
    pageThemePreference
  )
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const pageContext = usePageContext()
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    return getInitialThemePreference(pageContext.themePreference ?? DEFAULT_THEME_PREFERENCE)
  })

  useEffect(() => {
    pageContext.themePreference = themePreference
    applyThemePreference(themePreference)
    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference)
  }, [pageContext, themePreference])

  return <ThemeContext.Provider value={{ themePreference, setThemePreference }}>{children}</ThemeContext.Provider>
}

export const useThemePreference = () => {
  const value = useContext(ThemeContext)

  if (!value) {
    throw new Error('useThemePreference must be used within ThemeProvider')
  }

  return value
}

