import { ChevronsRight } from 'lucide-react'
import { getDocsIconMapKey } from '../../../docs/iconKeys.js'
import { getActiveSectionByPathname } from '../../../docs/runtime.js'
import type { ResolvedSidebarNode } from '../../../docs/types.js'
import { renderInlineMarkdown } from '../../../shared/renderInlineMarkdown.js'
import { useDocsGlobalContext } from '../docsGlobalContext.js'

type BreadcrumbItem = {
  id: string
  kind: 'group' | 'page'
  title: string
}

const dedupeBreadcrumbs = (items: BreadcrumbItem[]) => {
  return items.filter((item, index) => index === 0 || items[index - 1]?.title !== item.title)
}

const getSidebarBreadcrumbs = (items: ResolvedSidebarNode[], currentHref: string): BreadcrumbItem[] | null => {
  for (const item of items) {
    if (item.kind === 'page') {
      if (item.href === currentHref) {
        return [{ id: item.id, kind: item.kind, title: item.navTitle }]
      }

      continue
    }

    if (item.href === currentHref) {
      return item.title ? [{ id: item.id, kind: item.kind, title: item.title }] : []
    }

    const nestedBreadcrumbs = getSidebarBreadcrumbs(item.items, currentHref)

    if (!nestedBreadcrumbs) {
      continue
    }

    return dedupeBreadcrumbs(item.title ? [{ id: item.id, kind: item.kind, title: item.title }] : nestedBreadcrumbs)
  }

  return null
}

const DocsBreadcrumbs = ({ currentHref }: { currentHref: string }) => {
  const docs = useDocsGlobalContext()
  const activeSection = getActiveSectionByPathname(docs, currentHref)
  const breadcrumbItems = dedupeBreadcrumbs([
    ...(activeSection ? (getSidebarBreadcrumbs(activeSection.items, currentHref) ?? []) : []),
  ])

  return (
    <span className="hidden lg:flex items-center text-sm gap-1 min-w-0 overflow-hidden mb-3 text-primary">
      {breadcrumbItems.map((item, index) => {
        const Icon = docs.docsIconMap[getDocsIconMapKey(item.kind, item.id)]

        return (
          <span key={item.id} className="contents">
            {index > 0 ? <ChevronsRight className="size-4 shrink-0 text-base-muted-medium" /> : null}
            <span className="flex min-w-0 items-center gap-1.5">
              {Icon ? <Icon className="size-3 shrink-0" aria-hidden="true" /> : null}
              <span className="truncate">{renderInlineMarkdown(item.title, { codeClassName: 'text-sm!' })}</span>
            </span>
          </span>
        )
      })}
    </span>
  )
}

export default DocsBreadcrumbs
