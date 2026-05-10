import cm, { cmMerge } from '@classmatejs/react'
import { Flame, TableOfContentsIcon } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { DocHeading, ResolvedDocsPartnersConfig } from '../../../docs/types.js'
import { useDocsGlobalContext } from '../docsGlobalContext.js'
import StickyContent from './StickyContent.js'

const getPadLeft = (depth: number) => {
  switch (depth) {
    case 1:
      return 'pl-3'
    case 2:
      return 'pl-3'
    case 3:
      return 'pl-5'
    case 4:
      return 'pl-7'
  }
}

interface TableOfContentsProps {
  headings?: DocHeading[]
  tableOfContents?: boolean
  activeHeadingId?: string
  setActiveHeadingId?: Dispatch<SetStateAction<string>>
}

export const TableOfContents = ({
  headings: headingsProp = [],
  tableOfContents: tableOfContentsProp = false,
  activeHeadingId = '',
  setActiveHeadingId = () => undefined,
}: TableOfContentsProps) => {
  const { partners } = useDocsGlobalContext()
  const effectiveHeadings = headingsProp
  const effectiveTableOfContents = tableOfContentsProp

  return (
    <aside className={cmMerge(effectiveTableOfContents ? 'w-58' : 'w-32', 'hidden shrink-0 xl:block')}>
      <div className="sticky top-14">
        <div className="absolute left-0 bottom-0 bg-linear-to-t h-10 w-full from-base-100 z-20 pointer-events-none" />
        <StickyContent className="pt-10 pb-8">
          {effectiveTableOfContents
            ? effectiveHeadings.length > 0 && (
                <>
                  <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-base-muted">
                    <TableOfContentsIcon className="size-3" />
                    On this page
                  </p>
                  <nav aria-label="On this page" className="mb-12">
                    <ul>
                      {effectiveHeadings.map((heading) => {
                        return (
                          <li key={heading.id}>
                            <a
                              href={`#${heading.id}`}
                              aria-current={activeHeadingId === heading.id ? 'location' : undefined}
                              onClick={() => setActiveHeadingId(heading.id)}
                              className={cmMerge(
                                'cursor-pointer block border-l-1 border-base-muted-light py-1.5 text-base-muted hover:border-primary-muted hover:text-base-content text-xs',
                                getPadLeft(heading.depth),
                                activeHeadingId === heading.id ? 'border-primary text-base-content' : '',
                              )}
                            >
                              {heading.title}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>
                </>
              )
            : null}
          <Adbar partners={partners} />
        </StickyContent>
      </div>
    </aside>
  )
}

const Adbar = ({ partners }: { partners: ResolvedDocsPartnersConfig }) => {
  if (partners.primary.length === 0 && partners.gold.length === 0) {
    return null
  }

  return (
    <aside>
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-base-muted">
        <Flame className="size-3" />
        Partners
      </p>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-3 opacity-90">
        {partners.primary.map((partner) => (
          <AdbarItem key={partner.name} className="col-span-full">
            <AdbarLink href={partner.href} title={partner.name}>
              <PartnerLogo partner={partner} />
            </AdbarLink>
          </AdbarItem>
        ))}
        {partners.gold.map((partner) => (
          <AdbarItem key={partner.name}>
            <AdbarLink href={partner.href} title={partner.name}>
              <PartnerLogo partner={partner} />
            </AdbarLink>
          </AdbarItem>
        ))}
      </ul>
    </aside>
  )
}

const PartnerLogo = ({
  partner,
}: {
  partner: ResolvedDocsPartnersConfig['primary'][number] | ResolvedDocsPartnersConfig['gold'][number]
}) => {
  return (
    <>
      <Image
        src={partner.logoLight}
        width={200}
        height={200}
        alt={partner.logoAlt}
        className={cmMerge('block', partner.logoDark ? 'dark:hidden' : 'dark:invert')}
      />
      {partner.logoDark ? (
        <Image src={partner.logoDark} width={200} height={200} alt={partner.logoAlt} className="hidden dark:block" />
      ) : null}
    </>
  )
}

const AdbarItem = cm.li`
  list-none
  px-5
  py-5
  bg-base-200
  text-center
  flex
  items-center
  justify-center
  rounded-field
`

const AdbarLink = cm.a`
  block
  w-full
  transition-opacity
  hover:opacity-100
  focus-visible:opacity-100
`

const Image = cm.img`
  mx-auto
  w-24
  h-auto
`
