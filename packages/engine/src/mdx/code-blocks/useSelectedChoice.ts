import { useEffect, useState, useSyncExternalStore } from 'react'
import { useUniversalMdxRuntime } from '../components/UniversalMdxProvider.js'

const subscribeNoop = () => () => {}
const getServerSnapshot = () => null

export const useSelectedChoice = (choiceGroupName: string, defaultValue: string) => {
  const runtime = useUniversalMdxRuntime()
  const choiceStore = runtime?.codeBlockChoices
  const storedChoice = useSyncExternalStore(
    choiceStore?.subscribe ?? subscribeNoop,
    () => choiceStore?.getChoice(choiceGroupName) ?? null,
    getServerSnapshot,
  )
  const [localChoice, setLocalChoice] = useState(defaultValue)

  useEffect(() => {
    if (!choiceStore || storedChoice) {
      return
    }

    const legacyChoice = choiceStore.getLegacyChoice?.(choiceGroupName)
    if (legacyChoice) {
      choiceStore.setChoice(choiceGroupName, legacyChoice)
    }
  }, [choiceGroupName, choiceStore, storedChoice])

  if (choiceStore) {
    return [storedChoice ?? defaultValue, (value: string) => choiceStore.setChoice(choiceGroupName, value)] as const
  }

  return [localChoice, setLocalChoice] as const
}
