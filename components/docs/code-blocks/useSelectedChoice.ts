import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY_PREFIX = 'solid-docpress:choice'

export const useSelectedChoice = (choiceGroupName: string, defaultValue: string) => {
  return useLocalStorage(`${STORAGE_KEY_PREFIX}:${choiceGroupName}`, defaultValue)
}
