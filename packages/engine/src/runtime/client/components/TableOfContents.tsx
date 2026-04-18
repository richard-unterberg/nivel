import cm, { cmMerge } from '@classmatejs/react'
import { Flame, TableOfContentsIcon } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { DocHeading, ResolvedDocsPartnersConfig } from '../../../docs/types.js'
import { useDocsGlobalContext } from '../docsGlobalContext.js'

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
    <aside className={cmMerge(effectiveTableOfContents ? 'w-64' : 'w-32', 'hidden shrink-0 xl:block')}>
      <div className="sticky top-14">
        <div className="relative h-[calc(100svh-14*var(--spacing))] overflow-y-auto overflow-x-hidden pt-10 pb-8">
          {effectiveTableOfContents
            ? effectiveHeadings.length > 0 && (
                <>
                  <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-base-muted">
                    <TableOfContentsIcon className="h-3 w-3" />
                    On this page
                  </p>
                  <nav aria-label="On this page" className="mb-12">
                    <ul>
                      {effectiveHeadings.map((heading) => (
                        <li key={heading.id}>
                          <a
                            href={`#${heading.id}`}
                            aria-current={activeHeadingId === heading.id ? 'location' : undefined}
                            onClick={() => setActiveHeadingId(heading.id)}
                            className={cmMerge(
                              'cursor-pointer block border-l border-base-muted-light py-1.5 text-sm text-base-muted hover:border-primary-muted hover:text-base-content',
                              heading.depth > 2 ? 'pl-6' : 'pl-4',
                              activeHeadingId === heading.id
                                ? 'border-l-2 border-primary font-semibold text-base-content'
                                : '',
                            )}
                          >
                            {heading.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </>
              )
            : null}
          <Adbar partners={partners} />
        </div>
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
        <Flame className="h-3 w-3" />
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

const AdbarItem = cm.div`
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
