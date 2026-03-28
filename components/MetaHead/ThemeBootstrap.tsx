import { USER_SETTINGS_STORAGE_KEY } from '@/lib/settings-storage'
import { DEFAULT_THEME_PREFERENCE, getDataTheme } from '@/lib/theme'

const themeBootstrapScript = `(() => {
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

const ThemeBootstrap = () => {
  return <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
}

export default ThemeBootstrap
