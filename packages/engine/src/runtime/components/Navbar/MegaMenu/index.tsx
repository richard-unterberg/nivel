import { cmMerge } from '@classmatejs/react'
import { LayoutComponent } from '../../LayoutComponent'

export const MegaMenu = ({
  isActive,
  onOpen,
  onClose,
}: {
  isActive: boolean
  onOpen: () => void
  onClose: () => void
}) => {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: ok
    <div
      className={cmMerge(
        'fixed top-14 left-0 z-3 w-full pt-2',
        isActive ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      onPointerEnter={onOpen}
      onPointerLeave={onClose}
    >
      <div
        className={cmMerge(
          isActive ? 'opacity-100' : 'opacity-0',
          'pointer-events-none absolute top-0 left-0 h-svh w-full bg-linear-to-t from-base-100/60 to-base-100 transition-opacity duration-200 backdrop-blur-md',
        )}
      />
      <div
        className={cmMerge(
          isActive ? 'translate-y-0' : 'translate-y-[calc(-100%+1px)]',
          'relative z-4 origin-top transition-all duration-200 border-b border-base-muted-light bg-base-100',
        )}
      >
        <LayoutComponent $size="lg">
          <div
            className={cmMerge(
              isActive ? 'opacity-100 delay-120' : 'opacity-0',
              'relative z-4 transition-opacity duration-300 py-8',
            )}
          >
            <h2 className="text-2xl font-bold">Mega Menu</h2>
            <p className="text-base-muted mt-2">This is a placeholder for the mega menu content.</p>
          </div>
        </LayoutComponent>
      </div>
    </div>
  )
}
