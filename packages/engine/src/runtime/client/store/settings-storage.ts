export const USER_SETTINGS_STORAGE_KEY = 'nivel-user-settings'
const LEGACY_CODE_BLOCK_CHOICE_STORAGE_KEY_PREFIX = 'vike-docpress:choice:'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const readPersistedSettingsState = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawValue = window.localStorage.getItem(USER_SETTINGS_STORAGE_KEY)
    if (!rawValue) {
      return null
    }

    const parsedValue = JSON.parse(rawValue) as unknown
    if (!isRecord(parsedValue)) {
      return null
    }

    const state = parsedValue.state
    return isRecord(state) ? state : null
  } catch {
    return null
  }
}

export const readLegacyCodeBlockChoice = (choiceGroupName: string) => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const value = window.localStorage.getItem(`${LEGACY_CODE_BLOCK_CHOICE_STORAGE_KEY_PREFIX}${choiceGroupName}`)
    return value || null
  } catch {
    return null
  }
}
