import { USER_SETTINGS_STORAGE_KEY } from '@/lib/settings-storage'

export type ThemePreference = 'light' | 'dark'

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'dark'

const dataThemeByPreference = {
  light: 'vike-light',
  dark: 'vike-dark',
} satisfies Record<ThemePreference, string>

const getDataTheme = (themePreference: ThemePreference) => {
  return dataThemeByPreference[themePreference]
}

export const applyThemePreference = (themePreference: ThemePreference) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('data-theme', getDataTheme(themePreference))
}

export const themeBootstrapScript = `(() => {
  const storageKey = ${JSON.stringify(USER_SETTINGS_STORAGE_KEY)};
  const themes = {
    light: ${JSON.stringify(getDataTheme('light'))},
    dark: ${JSON.stringify(getDataTheme('dark'))}
  };

  try {
    const persistedValue = window.localStorage.getItem(storageKey);
    const parsedValue = persistedValue ? JSON.parse(persistedValue) : null;
    const storedThemePreference = parsedValue?.state?.themePreference;
    const themePreference =
      storedThemePreference === 'light' || storedThemePreference === 'dark'
        ? storedThemePreference
        : ${JSON.stringify(DEFAULT_THEME_PREFERENCE)};

    document.documentElement.setAttribute('data-theme', themes[themePreference]);
  } catch {
    document.documentElement.setAttribute('data-theme', themes[${JSON.stringify(DEFAULT_THEME_PREFERENCE)}]);
  }
})();`
