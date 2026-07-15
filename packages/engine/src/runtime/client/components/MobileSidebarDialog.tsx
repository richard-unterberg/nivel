import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useDocsGlobalContext } from '../docsGlobalContext.js'
import { useDocsSidebarActions, useDocsSidebarStore } from '../store/runtime-store.js'
import { Brand } from './Brand.js'
import { SidebarContent } from './Sidebar.js'
import { ThemeSwitch } from './ThemeSwitch.js'

export const MobileSidebarDialog = () => {
  const docs = useDocsGlobalContext()
  const isOpen = useDocsSidebarStore((state) => state.isMobileMenuOpen)
  const { closeMobileMenu } = useDocsSidebarActions()
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    closeButtonRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMobileMenu, isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-50 flex flex-col bg-base-100 text-base-content lg:hidden"
    >
      <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-base-muted-light px-4">
        <div className="min-w-0 shrink">
          <Brand brand={docs.brand} />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeSwitch theme={docs.theme} />
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close navigation menu"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-base-muted-light bg-base-200"
            onClick={closeMobileMenu}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
      <nav aria-label="Documentation" className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 w-full [&_.menu]:w-full">
        <SidebarContent onNavigate={closeMobileMenu} />
      </nav>
    </div>
  )
}
