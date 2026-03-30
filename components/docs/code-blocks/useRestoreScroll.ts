import { useEffect, useRef } from 'react'

type ScrollPosition = {
  top: number
  element: Element
}

export const useRestoreScroll = (deps: ReadonlyArray<unknown>) => {
  const previousPositionRef = useRef<ScrollPosition | null>(null)

  useEffect(() => {
    if (!previousPositionRef.current) {
      return
    }

    const { top, element } = previousPositionRef.current
    const delta = element.getBoundingClientRect().top - top

    if (delta !== 0) {
      window.scrollBy(0, delta)
    }

    previousPositionRef.current = null
    // biome-ignore lint/correctness/useExhaustiveDependencies: @todo: investigate if this can be safely ignored
  }, deps)

  return previousPositionRef
}
