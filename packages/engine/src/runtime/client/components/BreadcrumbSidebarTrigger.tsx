import { ChevronLast, ChevronsRight } from 'lucide-react'
import { useCallback } from 'react'
import { getActiveSectionByPathname } from '../../../docs/runtime.js'
import type { ResolvedSidebarNode } from '../../../docs/types.js'
import { renderInlineMarkdown } from '../../../shared/renderInlineMarkdown.js'
import { useDocsGlobalContext } from '../docsGlobalContext.js'

type BreadcrumbItem = {
  id: string
  title: string
}

const dedupeBreadcrumbs = (items: BreadcrumbItem[]) => {
  return items.filter((item, index) => index === 0 || items[index - 1]?.title !== item.title)
}

const getSidebarBreadcrumbs = (items: ResolvedSidebarNode[], currentHref: string): BreadcrumbItem[] | null => {
  for (const item of items) {
    if (item.kind === 'page') {
      if (item.href === currentHref) {
        return [{ id: item.id, title: item.navTitle }]
      }

      continue
    }

    if (item.href === currentHref) {
      return item.title ? [{ id: item.id, title: item.title }] : []
    }

    const nestedBreadcrumbs = getSidebarBreadcrumbs(item.items, currentHref)

    if (!nestedBreadcrumbs) {
      continue
    }

    return dedupeBreadcrumbs(
      item.title ? [{ id: item.id, title: item.title }, ...nestedBreadcrumbs] : nestedBreadcrumbs,
    )
  }

  return null
}

const BreadcrumbSidebarTrigger = ({ currentHref }: { currentHref: string }) => {
  const docs = useDocsGlobalContext()
  const activeSection = getActiveSectionByPathname(docs, currentHref)
  const breadcrumbItems = dedupeBreadcrumbs([
    ...(activeSection ? [{ id: activeSection.id, title: activeSection.navTitle }] : []),
    ...(activeSection ? (getSidebarBreadcrumbs(activeSection.items, currentHref) ?? []) : []),
  ])

  const handleClick = useCallback(() => {
    alert('TODO: Open mobile menu')
  }, [])

  return (
    <button className="cursor-pointer min-w-0 max-w-full block" type="button" onClick={handleClick}>
      <span className="flex items-center gap-1 min-w-0 overflow-hidden lg:hidden">
        <ChevronLast className="size-4 shrink-0 text-primary" />
        <span className="flex items-center gap-1">
          {breadcrumbItems.map((item, index) => (
            <span key={item.id} className="contents">
              {index > 0 ? <ChevronsRight className="size-4 shrink-0 text-base-muted-medium" /> : null}
              <span className={index === 0 ? 'font-semibold truncate' : 'text-sm truncate'}>
                {renderInlineMarkdown(item.title, { codeClassName: 'text-sm!' })}
              </span>
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}

export default BreadcrumbSidebarTrigger
