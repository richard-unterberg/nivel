import type { DocsGeneratedIconName } from '../generated/iconNames.js'
import { docsGeneratedIconNames } from '../generated/iconNames.js'

export type DocsIconName = DocsGeneratedIconName

const docsIconNames = Object.freeze([...docsGeneratedIconNames])

const docsIconNameSet = new Set<string>(docsIconNames)

const isDocsIconName = (value: string): value is DocsIconName => {
  return docsIconNameSet.has(value)
}

export const assertDocsIconName = (value: string, context: string) => {
  if (isDocsIconName(value)) {
    return
  }

  throw new Error(
    `${context} must be a valid lucide-react icon export. Received "${value}". See https://lucide.dev/icons/`,
  )
}
