import { cmMerge } from '@classmatejs/react'
import type { ResolvedTopBarNavItem } from '../../../../docs/types.js'
import { withSiteBaseUrl } from '../../../../shared/assets.js'
import { renderInlineMarkdown } from '../../../../shared/renderInlineMarkdown.js'

interface TopBarNavLinksProps {
  items: ResolvedTopBarNavItem[]
  minWidthClass: string
}

export const TopBarNavLinks = ({ items, minWidthClass }: TopBarNavLinksProps) => {
  return (
    <>
      {items.map((item) => (
        <li key={`${item.href}:${item.label}`}>
          <a
            href={withSiteBaseUrl(item.href)}
            className={cmMerge(
              'btn text-base btn-sm px-2 whitespace-nowrap tracking-tight',
              minWidthClass,
              item.isCta ? 'btn-primary btn-soft' : 'btn-ghost',
            )}
          >
            {renderInlineMarkdown(item.label)}
          </a>
        </li>
      ))}
    </>
  )
}
