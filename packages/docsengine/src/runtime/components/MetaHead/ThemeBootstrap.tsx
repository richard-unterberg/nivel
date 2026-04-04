import type { DocsThemeConfig } from '../../../types.js'
import { USER_SETTINGS_STORAGE_KEY } from '../../store/settings-storage.js'
import { DARK_THEME_MEDIA_QUERY } from '../../theme.js'

const getThemeBootstrapScript = (theme: Required<DocsThemeConfig>) => {
  return `(() => {
  const storageKey = ${JSON.stringify(USER_SETTINGS_STORAGE_KEY)};
  const darkThemeMediaQuery = ${JSON.stringify(DARK_THEME_MEDIA_QUERY)};
  const defaultThemePreference = ${JSON.stringify(theme.defaultPreference)};
  const themes = {
    light: ${JSON.stringify(theme.light)},
    dark: ${JSON.stringify(theme.dark)}
  };

  try {
    const persistedValue = window.localStorage.getItem(storageKey);
    const parsedValue = persistedValue ? JSON.parse(persistedValue) : null;
    const storedThemePreference = parsedValue?.state?.themePreference;
    const themePreference =
      storedThemePreference === 'light' || storedThemePreference === 'dark'
        ? storedThemePreference
        : typeof window.matchMedia === 'function'
          ? window.matchMedia(darkThemeMediaQuery).matches
            ? 'dark'
            : 'light'
          : defaultThemePreference;

    document.documentElement.setAttribute('data-theme', themes[themePreference]);
  } catch {
    const themePreference =
      typeof window.matchMedia === 'function'
        ? window.matchMedia(darkThemeMediaQuery).matches
          ? 'dark'
          : 'light'
        : defaultThemePreference;

    document.documentElement.setAttribute('data-theme', themes[themePreference]);
  }
})();`
}

export const ThemeBootstrap = ({ theme }: { theme: Required<DocsThemeConfig> }) => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: getThemeBootstrapScript(theme),
      }}
    />
  )
}
