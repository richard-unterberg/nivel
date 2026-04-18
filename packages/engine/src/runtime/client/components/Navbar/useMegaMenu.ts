import { useCallback, useEffect, useRef, useState } from 'react'
import type { ResolvedDocsSection } from '../../../../docs/types'

const megaMenuOpenDelayMs = 120
const megaMenuCloseDelayMs = 140

const useMegaMenu = ({ activeSectionId, sections }: { activeSectionId?: string; sections: ResolvedDocsSection[] }) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const megaMenuOpenTimeoutRef = useRef<number | null>(null)
  const megaMenuCloseTimeoutRef = useRef<number | null>(null)
  const [hoveredSectionId, setHoveredSectionId] = useState<string | undefined>(activeSectionId ?? sections[0]?.id)

  const clearMegaMenuOpenTimeout = useCallback(() => {
    if (megaMenuOpenTimeoutRef.current === null) {
      return
    }

    window.clearTimeout(megaMenuOpenTimeoutRef.current)
    megaMenuOpenTimeoutRef.current = null
  }, [])

  const clearMegaMenuCloseTimeout = useCallback(() => {
    if (megaMenuCloseTimeoutRef.current === null) {
      return
    }

    window.clearTimeout(megaMenuCloseTimeoutRef.current)
    megaMenuCloseTimeoutRef.current = null
  }, [])

  const openMegaMenu = (currentSectionId?: string) => {
    if (currentSectionId !== undefined) {
      setHoveredSectionId(currentSectionId)
    }

    clearMegaMenuOpenTimeout()
    clearMegaMenuCloseTimeout()
    setIsMegaMenuOpen(true)
  }

  const scheduleMegaMenuOpen = (currentSectionId?: string) => {
    if (currentSectionId !== undefined) {
      setHoveredSectionId(currentSectionId)
    }

    clearMegaMenuOpenTimeout()
    clearMegaMenuCloseTimeout()

    if (isMegaMenuOpen) {
      setIsMegaMenuOpen(true)
      return
    }

    megaMenuOpenTimeoutRef.current = window.setTimeout(() => {
      setIsMegaMenuOpen(true)
      megaMenuOpenTimeoutRef.current = null
    }, megaMenuOpenDelayMs)
  }

  const closeMegaMenu = () => {
    clearMegaMenuOpenTimeout()
    clearMegaMenuCloseTimeout()
    setIsMegaMenuOpen(false)
  }

  const scheduleMegaMenuClose = () => {
    clearMegaMenuOpenTimeout()
    clearMegaMenuCloseTimeout()
    megaMenuCloseTimeoutRef.current = window.setTimeout(() => {
      setIsMegaMenuOpen(false)
      megaMenuCloseTimeoutRef.current = null
    }, megaMenuCloseDelayMs)
  }

  useEffect(() => {
    return () => {
      clearMegaMenuOpenTimeout()
      clearMegaMenuCloseTimeout()
    }
  }, [clearMegaMenuCloseTimeout, clearMegaMenuOpenTimeout])

  useEffect(() => {
    setHoveredSectionId(activeSectionId ?? sections[0]?.id)
  }, [activeSectionId, sections])

  return {
    isMegaMenuOpen,
    hoveredSectionId,
    openMegaMenu,
    scheduleMegaMenuOpen,
    closeMegaMenu,
    scheduleMegaMenuClose,
  }
}

export default useMegaMenu
