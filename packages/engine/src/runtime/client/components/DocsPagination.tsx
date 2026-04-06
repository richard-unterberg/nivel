import { cmMerge } from '@classmatejs/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { DocPageData } from '../../../docs/types.js'
import { withSiteBaseUrl } from '../../../shared/assets.js'
import { renderInlineMarkdown } from '../../../shared/renderInlineMarkdown.js'

interface PaginationCardProps {
  item: NonNullable<DocPageData['previousPage']>
  direction: 'previous' | 'next'
  isOffset?: boolean
}

const PaginationCard = ({ item, direction, isOffset }: PaginationCardProps) => {
  const isPrevious = direction === 'previous'

  return (
    <a
      href={withSiteBaseUrl(item.href)}
      className={cmMerge(
        'group rounded-box border border-base-muted-light bg-base-100 p-5 no-underline hover:border-primary-muted-medium hover:bg-base-200',
        isPrevious ? 'text-left' : 'text-right',
        isOffset && 'sm:col-start-2',
      )}
      aria-label={`${isPrevious ? 'Previous' : 'Next'}: ${item.title}`}
    >
      <div className="flex flex-col justify-between gap-2">
        <p className="text-lg font-semibold text-base-content">{renderInlineMarkdown(item.title)}</p>
        <div
          className={cmMerge(
            'flex items-center gap-1 text-base-muted group-hover:text-base-content',
            isPrevious ? 'justify-start' : 'justify-end',
          )}
        >
          {isPrevious && <ChevronLeft className="h-4 w-4" />}
          <span>{isPrevious ? 'Previous' : 'Next'}</span>
          {!isPrevious && <ChevronRight className="h-4 w-4" />}
        </div>
      </div>
    </a>
  )
}

interface DocsPaginationProps {
  previousPage: DocPageData['previousPage']
  nextPage: DocPageData['nextPage']
}

export const DocsPagination = ({ previousPage, nextPage }: DocsPaginationProps) => {
  if (!previousPage && !nextPage) {
    return null
  }

  return (
    <nav className="mb-10 mt-16" aria-label="Previous Next">
      <div className="grid gap-4 sm:grid-cols-2">
        {previousPage && <PaginationCard item={previousPage} direction="previous" />}
        {nextPage && <PaginationCard isOffset={!previousPage} item={nextPage} direction="next" />}
      </div>
    </nav>
  )
}
