import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config'
import { readPersistedSettingsState, USER_SETTINGS_STORAGE_KEY } from '@/lib/settings-storage'
import { DEFAULT_THEME_PREFERENCE, type ThemePreference } from '@/lib/theme'

type UserSettingsState = {
  codeBlockChoices: Record<string, string>
  themePreference: ThemePreference
  localePreference: Locale
  setCodeBlockChoice: (choiceGroupName: string, choice: string) => void
  setThemePreference: (themePreference: ThemePreference) => void
  setLocalePreference: (localePreference: Locale) => void
}

const initialSettingsState = {
  codeBlockChoices: {},
  themePreference: DEFAULT_THEME_PREFERENCE,
  localePreference: DEFAULT_LOCALE,
} satisfies Pick<UserSettingsState, 'codeBlockChoices' | 'themePreference' | 'localePreference'>

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set) => ({
      ...initialSettingsState,
      setCodeBlockChoice: (choiceGroupName, choice) =>
        set((state) => ({
          codeBlockChoices: {
            ...state.codeBlockChoices,
            [choiceGroupName]: choice,
          },
        })),
      setThemePreference: (themePreference) => set({ themePreference }),
      setLocalePreference: (localePreference) => set({ localePreference }),
    }),
    {
      name: USER_SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ codeBlockChoices, themePreference, localePreference }) => ({
        codeBlockChoices,
        themePreference,
        localePreference,
      }),
    },
  ),
)

export const getStoredLocalePreference = () => {
  const persistedState = readPersistedSettingsState()
  const localePreference = persistedState?.localePreference
  return typeof localePreference === 'string' && isLocale(localePreference) ? localePreference : null
}
