import cm from '@classmatejs/react'
import { TableOfContents } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { DocHeading } from '../../../docs/types'
import BreadcrumbSidebarTrigger from './BreadcrumbSidebarTrigger'

interface TableOfContentsProps {
  headings?: DocHeading[]
  tableOfContents?: boolean
  pageTitle?: string
  currentHref: string
  activeHeadingId?: string
  setActiveHeadingId?: Dispatch<SetStateAction<string>>
}

const TableOfContentsMobile = ({
  headings = [],
  tableOfContents = false,
  pageTitle = 'On this page',
  currentHref,
  activeHeadingId = '',
  setActiveHeadingId = () => undefined,
}: TableOfContentsProps) => {
  const topOptionValue = '__docs-page-top__'
  const selectedValue =
    tableOfContents && headings.some((heading) => heading.id === activeHeadingId) ? activeHeadingId : ''

  return (
    <>
      <div className="h-12 xl:hidden"></div>
      <StyledTOC>
        <StyledTOCInner>
          <BreadcrumbSidebarTrigger currentHref={currentHref} />
          <label className="select select-sm md:w-80 w-full" htmlFor="table-of-contents-select">
            <span className="label flex">
              <TableOfContents className="w-4 h-4" />
            </span>
            <select
              id="table-of-contents-select"
              value={selectedValue || topOptionValue}
              onChange={(e) => {
                const value = e.target.value
                if (value === topOptionValue) {
                  setActiveHeadingId('')
                  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
                  window.scrollTo({ top: 0, behavior: 'auto' })
                  return
                }

                setActiveHeadingId(value)
                window.location.hash = encodeURIComponent(value)
              }}
            >
              <option value={topOptionValue}>{pageTitle}</option>
              {tableOfContents &&
                headings.map((heading) => (
                  <option key={heading.id} value={heading.id}>
                    {heading.title}
                  </option>
                ))}
            </select>
          </label>
        </StyledTOCInner>
      </StyledTOC>
    </>
  )
}

export default TableOfContentsMobile

const StyledTOC = cm.div`
  block xl:hidden
  fixed
  bg-base-100 border-b-base-muted-light
  w-full h-14
  top-14 left-0 border-b z-5
  lg:w-[calc(100svw-80*var(--spacing))]
  lg:left-80
`

const StyledTOCInner = cm.div`
  absolute inset-0 flex justify-between items-center
  pr-4
  px-4 lg:pl-14
`
