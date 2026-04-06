import type { ReactNode } from 'react'
import { withSiteBaseUrl } from '../../shared/assets.js'
import { renderInlineMarkdown } from '../../shared/renderInlineMarkdown.js'
import type { UniversalResolvedOverviewItem } from './types.js'
import { useUniversalMdxRuntime } from './UniversalMdxProvider.js'

type OverviewLinkItem = {
  title: ReactNode
  href: string
  excerpt?: ReactNode | null
}

type OverviewDividerItem = {
  dividerText: ReactNode
}

export type OverviewItem = OverviewLinkItem | OverviewDividerItem

interface OverviewProps {
  items: Array<string | OverviewItem>
}

const isOverviewDividerItem = (item: string | OverviewItem): item is OverviewDividerItem =>
  typeof item === 'object' && item !== null && 'dividerText' in item

function assertUsage(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[UniversalMdxMods][Wrong Usage] ${message}`)
  }
}

const groupOverviewItems = (items: OverviewItem[]) => {
  const groups: { dividerText?: ReactNode; items: OverviewLinkItem[] }[] = []
  let currentGroup: { dividerText?: ReactNode; items: OverviewLinkItem[] } = {
    items: [],
  }

  const commitCurrentGroup = () => {
    if (currentGroup.items.length > 0) {
      groups.push(currentGroup)
    }
  }

  for (const item of items) {
    if (isOverviewDividerItem(item)) {
      commitCurrentGroup()
      currentGroup = {
        dividerText: item.dividerText,
        items: [],
      }
      continue
    }

    currentGroup.items.push(item)
  }

  commitCurrentGroup()

  return groups
}

const OverviewCard = ({ excerpt, href, title }: OverviewLinkItem) => {
  return (
    <a
      href={withSiteBaseUrl(href)}
      className="group flex h-full flex-col gap-3 rounded-box border border-base-muted-light bg-base-muted-superlight p-5 no-underline hover:border-primary-muted-medium hover:bg-base-muted-superlight/50"
    >
      <h3 className="text-lg font-semibold text-base-content">{renderInlineMarkdown(title)}</h3>
      {excerpt ? <p className="text-sm leading-relaxed text-base-muted">{renderInlineMarkdown(excerpt)}</p> : null}
    </a>
  )
}

const normalizeOverviewItems = (
  items: Array<string | OverviewItem>,
  resolveOverviewItem?: (key: string) => UniversalResolvedOverviewItem | null,
): OverviewItem[] => {
  return items.map((item) => {
    if (typeof item !== 'string') {
      return item
    }

    const resolvedItem = resolveOverviewItem?.(item)

    assertUsage(
      resolvedItem,
      `Overview item "${item}" requires runtime.resolveOverviewItem(). Pass { title, href, excerpt } manually when no resolver is available.`,
    )

    return resolvedItem
  })
}

export const Overview = ({ items }: OverviewProps) => {
  const runtime = useUniversalMdxRuntime()
  const groups = groupOverviewItems(normalizeOverviewItems(items, runtime?.resolveOverviewItem))

  if (groups.length === 0) {
    return null
  }

  return (
    <div className="prose-headings:my-0 prose-p:my-0 my-5 flex flex-col gap-8">
      {groups.map((group, groupIndex) => (
        <section className="flex flex-col gap-4" key={groupIndex}>
          {group.dividerText ? (
            <p className="text-sm font-semibold uppercase tracking-wide">{renderInlineMarkdown(group.dividerText)}</p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            {group.items.map((item, itemIndex) => (
              <OverviewCard {...item} key={item.href || itemIndex} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
