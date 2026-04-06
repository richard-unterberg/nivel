import { cmMerge } from '@classmatejs/react'
import type { ResolvedDocsSection, ResolvedSidebarPage } from '../../../../../docs/types.js'
import { withSiteBaseUrl } from '../../../../../shared/assets.js'
import { LayoutComponent } from '../../LayoutComponent.js'

export const MegaMenu = ({
  isActive,
  onOpen,
  onClose,
  sections,
  showChrome,
}: {
  isActive: boolean
  onOpen: () => void
  onClose: () => void
  sections: ResolvedDocsSection[]
  showChrome: boolean
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
          showChrome ? 'border-b border-base-muted-light' : '',
          'relative z-4 origin-top transition-transform duration-200 bg-base-100',
        )}
      >
        <LayoutComponent $size="lg">
          <div
            className={cmMerge(
              isActive ? 'opacity-100 delay-120' : 'opacity-0',
              'relative z-4 transition-opacity duration-300 py-8',
            )}
          >
            {sections.map((section) => (
              <div key={section.id} className="mb-8 last:mb-0">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                {section.items.length > 0 && (
                  <ul className="menu xl:menu-horizontal ">
                    {section.items.map((child) => (
                      <li key={child.id}>
                        {child.kind === 'page' && (
                          <a
                            onClick={onClose}
                            href={withSiteBaseUrl((child as ResolvedSidebarPage).href)}
                            className="block rounded-md px-3 py-2 text-sm hover:bg-base-200"
                          >
                            {child.title}
                          </a>
                        )}
                        {/* {child.kind === 'group' && (
                          <ul className="mt-2 space-y-1 pl-4">
                            {child.items.map((grandChild) => (
                              <li key={grandChild.id}>
                                {grandChild.kind === 'page' && (
                                  <a
                                  onClick={onClose}
                                    href={withSiteBaseUrl((grandChild as ResolvedSidebarPage).href)}
                                    className="block rounded-md px-3 py-2 text-sm hover:bg-base-200"
                                  >
                                    {grandChild.title}
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        )} */}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* <h2 className="text-2xl font-bold">Mega Menu</h2>
            <p className="text-base-muted mt-2">This is a placeholder for the mega menu content.</p> */}
          </div>
        </LayoutComponent>
      </div>
    </div>
  )
}
