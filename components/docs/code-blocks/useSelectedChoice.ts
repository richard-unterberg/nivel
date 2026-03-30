import { useEffect } from 'react'
import { readLegacyCodeBlockChoice } from '@/lib/settings-storage'
import { useUserSettingsStore } from '@/lib/settings-store'

export const useSelectedChoice = (choiceGroupName: string, defaultValue: string) => {
  const storedChoice = useUserSettingsStore((state) => state.codeBlockChoices[choiceGroupName])
  const setCodeBlockChoice = useUserSettingsStore((state) => state.setCodeBlockChoice)

  useEffect(() => {
    if (storedChoice) {
      return
    }

    const legacyChoice = readLegacyCodeBlockChoice(choiceGroupName)
    if (legacyChoice) {
      setCodeBlockChoice(choiceGroupName, legacyChoice)
    }
  }, [choiceGroupName, setCodeBlockChoice, storedChoice])

  return [storedChoice ?? defaultValue, (value: string) => setCodeBlockChoice(choiceGroupName, value)] as const
}
