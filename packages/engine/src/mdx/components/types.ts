import type { ReactNode } from 'react'

export type UniversalMdxTranslationFn = (group: string, key: string) => string

export type UniversalResolveDocLinkArgs = {
  href: string
  doNotInferSectionTitle?: boolean
  noWarning?: boolean
}

export type UniversalResolvedDocLink = {
  href: string
  title?: ReactNode
  breadcrumb?: ReactNode[]
  sectionTitle?: ReactNode
  isCurrentPage?: boolean
}

export type UniversalResolveDocLinkFn = (args: UniversalResolveDocLinkArgs) => UniversalResolvedDocLink | null

export type UniversalResolvedOverviewItem = {
  title: ReactNode
  href: string
  excerpt?: ReactNode | null
}

export type UniversalResolveOverviewItemFn = (key: string) => UniversalResolvedOverviewItem | null

export interface UniversalMdxCodeBlockChoiceStore {
  subscribe: (listener: () => void) => () => void
  getChoice: (choiceGroupName: string) => string | null
  setChoice: (choiceGroupName: string, choice: string) => void
  getLegacyChoice?: (choiceGroupName: string) => string | null
}

export interface UniversalMdxRuntimeValue {
  locale: string
  t?: UniversalMdxTranslationFn
  localizeHref?: (href: string) => string
  resolveDocLink?: UniversalResolveDocLinkFn
  resolveOverviewItem?: UniversalResolveOverviewItemFn
  codeBlockChoices?: UniversalMdxCodeBlockChoiceStore
}
