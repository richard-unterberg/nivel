export const NIVEL_ACTION_EVENT = 'nivel:action' as const

export type NivelActionEventDetail = {
  action: string
  component: string
  choice?: string | null
  choiceGroup?: string | null
  env?: string | null
  label?: string | null
  language?: string | null
  success?: boolean
}

export const dispatchNivelAction = (target: EventTarget, detail: NivelActionEventDetail) => {
  target.dispatchEvent(
    new CustomEvent<NivelActionEventDetail>(NIVEL_ACTION_EVENT, {
      bubbles: true,
      composed: true,
      detail,
    }),
  )
}
