import { useCallback, useSyncExternalStore } from 'react'

export const useLocalStorage = (storageKey: string, clientValue: string, ssrValue?: string) => {
  const subscribe = useCallback(
    (callback: () => void) => {
      const onStorage = (event: StorageEvent) => {
        if (event.key === storageKey) {
          callback()
        }
      }

      window.addEventListener('storage', onStorage)
      return () => window.removeEventListener('storage', onStorage)
    },
    [storageKey],
  )

  const getSnapshot = useCallback(() => {
    const storedValue = localStorage.getItem(storageKey)
    return storedValue || clientValue
  }, [clientValue, storageKey])

  const setValue = (value: string) => {
    localStorage.setItem(storageKey, value)
    window.dispatchEvent(new StorageEvent('storage', { key: storageKey }))
  }

  const value = useSyncExternalStore(subscribe, getSnapshot, () => ssrValue || clientValue)

  return [value, setValue] as const
}
