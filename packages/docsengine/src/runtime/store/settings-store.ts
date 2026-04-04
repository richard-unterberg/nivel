import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { UniversalMdxCodeBlockChoiceStore } from '../../components/types.js'
import type { ThemePreference } from '../../types.js'
import { readLegacyCodeBlockChoice, USER_SETTINGS_STORAGE_KEY } from './settings-storage.js'

type DocsUserSettingsState = {
  codeBlockChoices: Record<string, string>
  themePreference: ThemePreference | null
  setCodeBlockChoice: (choiceGroupName: string, choice: string) => void
  setThemePreference: (themePreference: ThemePreference) => void
}

export const useDocsUserSettingsStore = create<DocsUserSettingsState>()(
  persist(
    (set) => ({
      codeBlockChoices: {},
      themePreference: null,
      setCodeBlockChoice: (choiceGroupName, choice) =>
        set((state) => ({
          codeBlockChoices: {
            ...state.codeBlockChoices,
            [choiceGroupName]: choice,
          },
        })),
      setThemePreference: (themePreference) => set({ themePreference }),
    }),
    {
      name: USER_SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ codeBlockChoices, themePreference }) => ({
        codeBlockChoices,
        themePreference,
      }),
    },
  ),
)

export const docsCodeBlockChoiceStore: UniversalMdxCodeBlockChoiceStore = {
  subscribe: (listener) => useDocsUserSettingsStore.subscribe(listener),
  getChoice: (choiceGroupName) => useDocsUserSettingsStore.getState().codeBlockChoices[choiceGroupName] ?? null,
  setChoice: (choiceGroupName, choice) =>
    useDocsUserSettingsStore.getState().setCodeBlockChoice(choiceGroupName, choice),
  getLegacyChoice: readLegacyCodeBlockChoice,
}
